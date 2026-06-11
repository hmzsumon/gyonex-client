'use client';
import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient, walletApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import { formatUSD } from '@/lib/format';
import {
  CreditCard, Upload, CheckCircle, AlertTriangle, Clock, DollarSign,
  Shield, ArrowRight, RefreshCw, ChevronDown, ChevronUp, Timer,
  List, Plus, XCircle, Wallet, TrendingUp
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────────── */
const LOAN_TYPES = [
  { key:'trading',   label:'Trading Loan',  rate:'6%/mo', icon:'T', color:'#3B82F6', maxDays:50,  defaultDays:50  },
  { key:'house',     label:'Home Loan',     rate:'6%/mo', icon:'H', color:'#10D980', maxDays:90,  defaultDays:90  },
  { key:'business',  label:'Business Loan', rate:'6%/mo', icon:'B', color:'#8B5CF6', maxDays:120, defaultDays:120 },
  { key:'study',     label:'Student Loan',  rate:'6%/mo', icon:'S', color:'#06B6D4', maxDays:90,  defaultDays:90  },
  { key:'land',      label:'Land Loan',     rate:'6%/mo', icon:'L', color:'#F5B731', maxDays:180, defaultDays:90  },
  { key:'emergency', label:'Emergency',     rate:'6%/mo', icon:'E', color:'#F04B55', maxDays:30,  defaultDays:14  },
];

const STATUS_MAP: Record<string,{label:string;color:string;bg:string}> = {
  pending:   { label:'Under Review', color:'var(--warning)', bg:'var(--warning-dim)'  },
  active:    { label:'Active',       color:'var(--brand)',   bg:'var(--brand-alpha)'  },
  completed: { label:'Completed',    color:'var(--text-2)',  bg:'var(--bg-active)'    },
  rejected:  { label:'Rejected',     color:'var(--loss)',    bg:'var(--loss-dim)'     },
  defaulted: { label:'Defaulted',    color:'var(--loss)',    bg:'var(--loss-dim)'     },
};

/* ── Live Countdown hook ─────────────────────────────────────────────────── */
function useCountdown(dueDate?: string) {
  const calc = useCallback(() => {
    if (!dueDate) return { days:0, hours:0, mins:0, secs:0, isOverdue:false };
    const ms = Math.max(0, new Date(dueDate).getTime() - Date.now());
    return {
      days:     Math.floor(ms / 86400000),
      hours:    Math.floor((ms % 86400000) / 3600000),
      mins:     Math.floor((ms % 3600000) / 60000),
      secs:     Math.floor((ms % 60000) / 1000),
      isOverdue: new Date(dueDate) < new Date() && ms === 0,
    };
  }, [dueDate]);
  const [t, setT] = useState(calc);
  useState(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); });
  return t;
}

/* ── Loan Card ───────────────────────────────────────────────────────────── */
function LoanCard({ loan, onRepay }: { loan: any; onRepay: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const time   = useCountdown(loan.dueDate);
  const type   = LOAN_TYPES.find(t => t.key === loan.loanType) || LOAN_TYPES[0];
  const s      = STATUS_MAP[loan.status] || STATUS_MAP.pending;
  const rem    = Math.max(0, (loan.totalRepayable || 0) - (loan.totalPaid || 0));
  const repayPct = loan.totalRepayable ? ((loan.totalPaid || 0) / loan.totalRepayable) * 100 : 0;
  const daysLeft = time.days;
  const timePct  = loan.repaymentPeriodDays > 0
    ? Math.min(100, Math.max(0, (daysLeft / loan.repaymentPeriodDays) * 100))
    : 0;
  const urgency = time.isOverdue ? 'overdue' : daysLeft <= 2 ? 'critical' : daysLeft <= 5 ? 'warning' : 'normal';
  const urgColor = { overdue: 'var(--loss)', critical: 'var(--loss)', warning: 'var(--warning)', normal: type.color }[urgency];

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${loan.status === 'active' ? urgColor + '30' : 'var(--border-1)'}`, background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-3 px-4 py-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="text-2xl flex-shrink-0">{type.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{type.label}</p>
            <span className="badge pill text-[10px]" style={{ background: s.bg, color: s.color }}>{s.label}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 text-[11px]" style={{ color: 'var(--text-2)' }}>
            <span>Requested: <strong style={{ color: 'var(--text-1)' }}>{formatUSD(loan.requestedAmount)}</strong></span>
            {loan.approvedAmount && <span>Approved: <strong style={{ color: 'var(--profit)' }}>{formatUSD(loan.approvedAmount)}</strong></span>}
            {loan.status === 'active' && <span>Remaining: <strong style={{ color: 'var(--loss)' }}>{formatUSD(rem)}</strong></span>}
          </div>
          {loan.status === 'active' && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: `${urgColor}12`, border: `1px solid ${urgColor}25` }}>
                  <Timer className="w-3 h-3" style={{ color: urgColor }} />
                  <motion.span key={daysLeft} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                    className="text-xs font-black font-num" style={{ color: urgColor }}>
                    {String(daysLeft).padStart(2, '0')}d {String(time.hours).padStart(2, '0')}h {String(time.mins).padStart(2, '0')}m {String(time.secs).padStart(2, '0')}s
                  </motion.span>
                </div>
                {loan.dueDate && (
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                    Due: <strong style={{ color: 'var(--text-1)' }}>
                      {new Date(loan.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </strong>
                  </span>
                )}
              </div>
              {[
                { l: 'Time remaining', v: timePct,  c: urgColor },
                { l: 'Amount repaid',  v: repayPct, c: 'var(--profit)' },
              ].map(b => (
                <div key={b.l}>
                  <div className="flex justify-between text-[9px] mb-0.5" style={{ color: 'var(--text-3)' }}>
                    <span>{b.l}</span><span style={{ color: b.c }}>{b.v.toFixed(0)}%</span>
                  </div>
                  <div className="progress-track h-1.5">
                    <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${b.v}%` }}
                      transition={{ duration: 0.6 }} style={{ background: b.c as string }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {loan.status === 'active' && (
            <button onClick={e => { e.stopPropagation(); onRepay(loan._id); }} className="btn btn-brand btn-sm">
              Repay
            </button>
          )}
          {open ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-3)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-3)' }} />}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ borderTop: '1px solid var(--border-1)' }}>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Details</p>
                {([
                  ['Applicant', loan.applicantName],
                  ['NID Number', loan.nidNumber],
                  ['Purpose', (loan.purpose || '').slice(0, 80)],
                  ['Rate', `${((loan.interestRate || 0.06) * 100).toFixed(0)}%/month`],
                  ['Term', `${loan.repaymentPeriodDays} days`],
                  ['Total Repayable', formatUSD(loan.totalRepayable || 0)],
                  ['Total Paid', formatUSD(loan.totalPaid || 0)],
                  ...(loan.adminNote ? [['Admin Note', loan.adminNote]] : []),
                ] as [string, string][]).map(([l, v]) => (
                  <div key={l} className="flex justify-between text-[11px] py-1.5" style={{ borderBottom: '1px solid var(--border-1)' }}>
                    <span style={{ color: 'var(--text-3)' }}>{l}</span>
                    <span className="font-medium text-right ml-4 max-w-[55%] break-words" style={{ color: 'var(--text-1)' }}>{v || '—'}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>
                  Repayments ({loan.repaymentHistory?.length || 0})
                </p>
                {!loan.repaymentHistory?.length ? (
                  <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>No payments yet</p>
                ) : (
                  <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
                    {loan.repaymentHistory.slice().reverse().map((r: { amount: number; paidAt: string }, i: number) => (
                      <div key={i} className="flex justify-between text-[11px] py-1.5" style={{ borderBottom: '1px solid var(--border-1)' }}>
                        <span style={{ color: 'var(--text-3)' }}>
                          {new Date(r.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="font-bold font-num" style={{ color: 'var(--profit)' }}>+{formatUSD(r.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Repay Modal ─────────────────────────────────────────────────────────── */
function RepayModal({ loan, onClose }: { loan: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [amt, setAmt] = useState('');
  const [toast, setToast] = useState('');
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const rem = Math.max(0, (loan.totalRepayable || 0) - (loan.totalPaid || 0));
  const time = useCountdown(loan.dueDate);
  const urgColor = time.isOverdue ? 'var(--loss)' : time.days <= 5 ? 'var(--warning)' : 'var(--brand)';

  const repayMutation = useMutation({
    mutationFn: () => apiClient.post(`/loans/${loan._id}/repay`, { amount: parseFloat(amt) }),
    onSuccess: () => {
      show('Repayment recorded!');
      setTimeout(() => { onClose(); qc.invalidateQueries({ queryKey: ['my-loans'] }); }, 1200);
    },
    onError: (e: any) => show('' + (e.response?.data?.message || 'Failed')),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-elevated)', border: `2px solid ${urgColor}30` }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-1)', background: `color-mix(in srgb, ${urgColor} 6%, transparent)` }}>
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-1)' }}>
            <DollarSign className="w-4 h-4" style={{ color: urgColor }} /> Loan Repayment
          </h3>
          <button onClick={onClose} className="text-sm px-2 py-1 rounded-lg transition-colors hover:opacity-70" style={{ color: 'var(--text-3)' }}>x</button>
        </div>
        <div className="p-5 space-y-4">
          {toast && (
            <div className="px-3 py-2.5 rounded-xl text-xs font-medium"
              style={{
                background: !toast.startsWith('[ERR]') ? 'var(--profit-dim)' : 'var(--loss-dim)',
                color: !toast.startsWith('[ERR]') ? 'var(--profit)' : 'var(--loss)',
              }}>{toast}</div>
          )}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
            <Timer className="w-4 h-4 flex-shrink-0" style={{ color: urgColor }} />
            <div className="flex-1">
              <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>Time remaining</p>
              <p className="text-sm font-black font-num" style={{ color: urgColor }}>
                {time.days}d {String(time.hours).padStart(2,'0')}h {String(time.mins).padStart(2,'0')}m {String(time.secs).padStart(2,'0')}s
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>Remaining</p>
              <p className="text-sm font-black font-num" style={{ color: 'var(--loss)' }}>{formatUSD(rem)}</p>
            </div>
          </div>
          {([
            ['Repayable', formatUSD(loan.totalRepayable || 0), 'var(--text-1)'],
            ['Paid',      formatUSD(loan.totalPaid || 0),      'var(--profit)'],
            ['Balance',   formatUSD(rem),                      'var(--loss)'],
          ] as [string,string,string][]).map(([l, v, clr]) => (
            <div key={l} className="flex justify-between text-xs py-1.5" style={{ borderBottom: '1px solid var(--border-1)' }}>
              <span style={{ color: 'var(--text-3)' }}>{l}</span>
              <span className="font-bold font-num" style={{ color: clr }}>{v}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map(pct => (
              <button key={pct} onClick={() => setAmt((rem * pct / 100).toFixed(2))}
                className="py-2 rounded-xl text-[10px] font-bold transition-all"
                style={{
                  background: amt === (rem * pct / 100).toFixed(2) ? urgColor : 'var(--bg-active)',
                  color: amt === (rem * pct / 100).toFixed(2) ? 'white' : 'var(--text-2)',
                }}>
                {pct}%
              </button>
            ))}
          </div>
          <input type="number" value={amt} onChange={e => setAmt(e.target.value)}
            placeholder={`Max $${rem.toFixed(2)}`} min={0.01} max={rem}
            className="input-field text-center text-xl font-black font-num py-4" />
          <div className="flex gap-3">
            <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
            <button onClick={() => repayMutation.mutate()}
              disabled={repayMutation.isPending || !amt || parseFloat(amt) <= 0}
              className="btn btn-brand flex-1 disabled:opacity-40">
              {repayMutation.isPending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <RefreshCw className="w-4 h-4" />}
              Confirm Repayment
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EXTERNAL APPLY FORM — shown only when eligible
══════════════════════════════════════════════════════════════════════════ */
function ApplyForm({
  eligible, maxLoan, usdtBal, onSuccess
}: {
  eligible: boolean;
  maxLoan:  number;
  usdtBal:  number;
  onSuccess: () => void;
}) {
  const qc  = useQueryClient();
  const { user } = useAuthStore();
  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0]);
  const [form, setForm] = useState({
    applicantName:       user?.fullName  || '',
    applicantEmail:      user?.email     || '',
    nidNumber:           '',
    requestedAmount:     '',
    purpose:             '',
    repaymentPeriodDays: String(LOAN_TYPES[0].defaultDays),
  });
  const [nidPreview,    setNidPreview]    = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [nidFile,       setNidFile]       = useState<File | null>(null);
  const [selfieFile,    setSelfieFile]    = useState<File | null>(null);
  const [toast,         setToast]         = useState('');
  const nidRef    = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const show = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };
  const set  = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleImg = (file: File, setP: (s: string) => void, setF: (f: File) => void) => {
    if (!file.type.startsWith('image/')) { show('Images only'); return; }
    if (file.size > 8 * 1024 * 1024)    { show('Max file size 8 MB'); return; }
    setF(file);
    const r = new FileReader();
    r.onload = e => setP(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const amt      = parseFloat(form.requestedAmount) || 0;
  const days     = parseInt(form.repaymentPeriodDays) || selectedType.defaultDays;
  const interest = amt * 0.06 * (days / 30);
  const total    = amt + interest;
  const daily    = days > 0 ? total / days : 0;

  const canSubmit = form.applicantName && form.applicantEmail && form.nidNumber
    && form.requestedAmount && parseFloat(form.requestedAmount) >= 50
    && form.purpose && nidFile;

  const applyMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      Object.entries({ ...form, loanType: selectedType.key }).forEach(([k, v]) => fd.append(k, v));
      if (nidFile)    fd.append('nidPhoto', nidFile);
      if (selfieFile) fd.append('selfie',   selfieFile);
      return apiClient.post('/loans/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => {
      show('Application submitted! We\'ll review within 24 hours.');
      setTimeout(() => { onSuccess(); qc.invalidateQueries({ queryKey: ['my-loans'] }); }, 1500);
    },
    onError: (e: any) => show('' + (e.response?.data?.message || 'Submission failed')),
  });

  /* ── NOT ELIGIBLE — full block ──────────────────────────────────────── */
  if (!eligible) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 text-center space-y-4"
        style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(240,80,75,0.3)' }}>
        <div style={{width:56,height:56,borderRadius:14,background:"var(--loss-dim)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><svg viewBox="0 0 24 24" width="28" height="28" stroke="var(--loss)" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></div>
        <div>
          <p className="text-base font-black mb-1" style={{ color: 'var(--loss)' }}>
            Not Eligible for a Loan
          </p>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            You need a minimum USDT balance of{' '}
            <strong style={{ color: 'var(--text-1)' }}>$2,001</strong> to apply.
          </p>
        </div>
        {/* Balance visual */}
        <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--bg-elevated)' }}>
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--text-3)' }}>Your USDT balance</span>
            <span className="font-black font-num" style={{ color: 'var(--loss)' }}>{formatUSD(usdtBal)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--text-3)' }}>Required minimum</span>
            <span className="font-black font-num" style={{ color: 'var(--warning)' }}>$2,001.00</span>
          </div>
          <div className="flex justify-between text-xs pt-1" style={{ borderTop: '1px solid var(--border-1)' }}>
            <span style={{ color: 'var(--text-3)' }}>Still needed</span>
            <span className="font-black font-num" style={{ color: 'var(--loss)' }}>
              {formatUSD(Math.max(0, 2001 - usdtBal))}
            </span>
          </div>
          {/* Progress bar toward eligibility */}
          <div>
            <div className="flex justify-between text-[9px] mb-1" style={{ color: 'var(--text-3)' }}>
              <span>Eligibility progress</span>
              <span>{Math.min(100, (usdtBal / 2001) * 100).toFixed(0)}%</span>
            </div>
            <div className="progress-track h-2">
              <motion.div className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (usdtBal / 2001) * 100)}%` }}
                transition={{ duration: 0.8 }}
                style={{ background: 'var(--loss)' }} />
            </div>
          </div>
        </div>
        <a href="/wallet"
          className="btn btn-brand btn-lg w-full flex items-center justify-center gap-2">
          <Wallet className="w-4 h-4" /> Deposit USDT Now
        </a>
        <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
          Once you reach $2,001 USDT, the Apply form will unlock automatically.
        </p>
      </motion.div>
    );
  }

  /* ── ELIGIBLE — show full form ──────────────────────────────────────── */
  return (
    <div className="space-y-5">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl text-xs font-medium"
          style={{
            background: !toast.startsWith('[ERR]') ? 'var(--profit-dim)' : 'var(--loss-dim)',
            border: `1px solid ${!toast.startsWith('[ERR]') ? 'rgba(9,212,125,0.4)' : 'rgba(240,80,75,0.4)'}`,
            color: !toast.startsWith('[ERR]') ? 'var(--profit)' : 'var(--loss)',
          }}>
          {toast}
        </motion.div>
      )}

      {/* ── Max loan info banner ──────────────────────────────── */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'var(--profit-dim)', border: '1px solid rgba(9,212,125,0.25)' }}>
        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--profit)' }} />
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: 'var(--profit)' }}>
            Eligible — Max loan: {formatUSD(maxLoan)}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
            Your USDT balance: <span className="font-num font-semibold" style={{ color: 'var(--text-1)' }}>{formatUSD(usdtBal)}</span>
            {usdtBal < 5001
              ? ' · 50% loan support (need $5,001+ for 100%)'
              : ' · 100% loan support'}
          </p>
        </div>
      </div>

      {/* ── Loan type selector ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {LOAN_TYPES.map(lt => (
          <button key={lt.key}
            onClick={() => { setSelectedType(lt); set('repaymentPeriodDays', String(lt.defaultDays)); }}
            className="rounded-xl p-4 text-left transition-all"
            style={{
              background: selectedType.key === lt.key ? `${lt.color}12` : 'var(--bg-card)',
              border: `2px solid ${selectedType.key === lt.key ? lt.color : 'var(--border-1)'}`,
            }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `color-mix(in srgb, ${lt.color} 20%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: lt.color, marginBottom: 6 }}>{lt.icon}</div>
            <p className="text-xs font-bold" style={{ color: selectedType.key === lt.key ? lt.color : 'var(--text-1)' }}>
              {lt.label}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{lt.rate} · max {lt.maxDays}d</p>
          </button>
        ))}
      </div>

      {/* ── Form card ────────────────────────────────────────── */}
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-1)' }}>

        {/* Personal info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { l: 'Full Name *',      k: 'applicantName',  type: 'text',  ph: 'Your legal full name'   },
            { l: 'Email Address *',  k: 'applicantEmail', type: 'email', ph: 'you@example.com'        },
          ].map(f => (
            <div key={f.k}>
              <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>{f.l}</label>
              <input type={f.type} value={form[f.k as keyof typeof form]}
                onChange={e => set(f.k, e.target.value)}
                placeholder={f.ph} className="input-field" />
            </div>
          ))}
        </div>

        {/* NID */}
        <div>
          <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>
            NID / Passport Number *
          </label>
          <input value={form.nidNumber} onChange={e => set('nidNumber', e.target.value)}
            placeholder="Enter your NID or Passport number" className="input-field" />
        </div>

        {/* Photo uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { ref: nidRef,    l: 'NID Card Photo *', preview: nidPreview,    file: nidFile,    setP: setNidPreview,    setF: setNidFile,    ph: 'Upload NID front photo', c: 'var(--profit)'  },
            { ref: selfieRef, l: 'Selfie (optional)', preview: selfiePreview, file: selfieFile, setP: setSelfiePreview, setF: setSelfieFile, ph: 'Selfie with NID card',   c: 'var(--brand)'   },
          ].map((u, i) => (
            <div key={i}>
              <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>{u.l}</label>
              <input ref={u.ref} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleImg(e.target.files[0], u.setP as any, u.setF as any)} />
              <button onClick={() => u.ref.current?.click()}
                className="w-full rounded-xl overflow-hidden transition-all"
                style={{
                  border:      `2px dashed ${u.file ? u.c : 'var(--border-2)'}`,
                  background:  u.file ? `color-mix(in srgb, ${u.c} 5%, transparent)` : 'var(--bg-elevated)',
                  minHeight:   110,
                }}>
                {u.preview
                  ? <img src={u.preview} alt="preview" className="w-full h-28 object-cover" />
                  : (
                    <div className="flex flex-col items-center justify-center h-28 gap-2">
                      <Upload className="w-6 h-6" style={{ color: 'var(--text-3)' }} />
                      <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>{u.ph}</p>
                    </div>
                  )}
              </button>
              {u.file && (
                <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: u.c }}>
                  <CheckCircle className="w-3 h-3" />{u.file.name}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Amount + term */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>
              Loan Amount (USDT) *
              <span className="ml-2 font-normal text-[10px]" style={{ color: 'var(--text-3)' }}>
                max {formatUSD(maxLoan)}
              </span>
            </label>
            <input type="number" value={form.requestedAmount}
              onChange={e => set('requestedAmount', e.target.value)}
              placeholder="Min $50"
              min={50} max={maxLoan}
              className="input-field" />
            {amt > maxLoan && (
              <p className="text-[10px] mt-1" style={{ color: 'var(--loss)' }}>
                 Exceeds max loan of {formatUSD(maxLoan)}
              </p>
            )}
          </div>
          <div>
            <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>
              Repayment Period * <span style={{ color: 'var(--text-3)' }}>max {selectedType.maxDays}d</span>
            </label>
            <select value={form.repaymentPeriodDays}
              onChange={e => set('repaymentPeriodDays', e.target.value)}
              className="input-field">
              {[7, 14, 30, 50, 60, 90, 120, 180]
                .filter(d => d <= selectedType.maxDays)
                .map(d => (
                  <option key={d} value={d}>
                    {d} days{d === selectedType.defaultDays ? ' (recommended)' : ''}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="text-[11px] font-semibold mb-1.5 block" style={{ color: 'var(--text-2)' }}>
            Loan Purpose *
          </label>
          <textarea value={form.purpose} onChange={e => set('purpose', e.target.value)}
            placeholder="Describe how you will use this loan..." rows={3} maxLength={500}
            className="input-field resize-none" />
          <p className="text-[9px] text-right mt-0.5" style={{ color: 'var(--text-3)' }}>
            {form.purpose.length}/500
          </p>
        </div>

        {/* Repayment preview */}
        {amt >= 50 && amt <= maxLoan && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4"
            style={{ background: 'var(--brand-alpha)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-[10px] font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--brand)' }}>
              <TrendingUp className="w-3 h-3" /> Repayment Estimate — {days}-day countdown
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {([
                ['Principal', formatUSD(amt),      'var(--text-1)'  ],
                ['Interest',  formatUSD(interest), 'var(--loss)'    ],
                ['Total',     formatUSD(total),    'var(--warning)' ],
                ['Daily',     formatUSD(daily),    'var(--profit)'  ],
              ] as [string, string, string][]).map(([l, v, clr]) => (
                <div key={l} className="rounded-lg py-2" style={{ background: 'var(--bg-elevated)' }}>
                  <p className="text-[9px] mb-0.5" style={{ color: 'var(--text-3)' }}>{l}</p>
                  <p className="text-xs font-black font-num" style={{ color: clr }}>{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl"
          style={{ background: 'var(--warning-dim)', border: '1px solid rgba(245,183,49,0.2)' }}>
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <p className="text-[10px]" style={{ color: 'var(--text-2)' }}>
            NID will be verified by admin. Loans must be fully repaid before the countdown reaches 0 to avoid default.
            Powered by <strong style={{ color: 'var(--brand)' }}>Geyonex Financial Technology</strong>.
          </p>
        </div>

        {/* Submit */}
        <button onClick={() => applyMutation.mutate()}
          disabled={applyMutation.isPending || !canSubmit || amt > maxLoan}
          className="btn btn-brand btn-lg w-full disabled:opacity-40">
          {applyMutation.isPending
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
            : <><ArrowRight className="w-4 h-4" />Submit Loan Application</>}
        </button>
        {!nidFile && (
          <p className="text-center text-[10px]" style={{ color: 'var(--loss)' }}>Warning: NID card photo is required</p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function LoansPage() {
  const [tab,           setTab]    = useState<'list' | 'apply'>('list');
  const [repayId,       setRepay]  = useState<string | null>(null);
  const [filterStatus,  setFilter] = useState('all');

  const { data: loanData, isLoading } = useQuery({
    queryKey: ['my-loans'],
    queryFn:  () => apiClient.get('/loans/my'),
    refetchInterval: 15000,
  });
  const { data: walletsData } = useQuery({
    queryKey: ['wallets'],
    queryFn:  walletApi.getWallets,
  });

  const loans    = loanData?.data?.data?.loans   || [];
  const summary  = loanData?.data?.data?.summary || {};
  const wallets  = walletsData?.data?.data        || [];
  const usdtBal  = wallets.find((w: { asset: string; balance: number }) => w.asset === 'USDT')?.balance || 0;
  const eligible = usdtBal >= 2001;
  const maxLoan  = usdtBal >= 5001 ? usdtBal : usdtBal >= 2001 ? usdtBal * 0.5 : 0;

  const filtered  = filterStatus === 'all' ? loans : loans.filter((l: { status: string }) => l.status === filterStatus);
  const repayLoan = filtered.find((l: any) => l._id === repayId);
  const STATUS_FILTERS = ['all', 'active', 'pending', 'completed', 'rejected', 'defaulted'];

  return (
    
      <div className="p-5 space-y-5 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-black flex items-center gap-2" style={{ color: 'var(--text-1)' }}>
              <CreditCard className="w-5 h-5" style={{ color: 'var(--brand)' }} /> Loans
            </h1>
            <p className="text-[9px] font-bold tracking-widest uppercase mt-0.5" style={{ color: 'var(--brand)' }}>
              Geyonex Financial Technology
            </p>
          </div>
          <button
            onClick={() => setTab(tab === 'apply' ? 'list' : 'apply')}
            className={`btn ${tab === 'apply' ? 'btn-ghost' : 'btn-brand'} flex items-center gap-1.5`}>
            {tab === 'apply'
              ? <><List className="w-3.5 h-3.5" /> My Loans</>
              : <><Plus className="w-3.5 h-3.5" /> Apply for Loan</>}
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: 'Active',   v: String(summary.activeLoans  || 0), c: 'var(--brand)',   click: () => { setTab('list'); setFilter('active');    } },
            { l: 'Pending',  v: String(summary.pendingLoans || 0), c: 'var(--warning)', click: () => { setTab('list'); setFilter('pending');   } },
            { l: 'Borrowed', v: formatUSD(summary.totalBorrowed || 0), c: 'var(--text-2)', click: () => { setTab('list'); setFilter('all'); } },
            { l: 'Repaid',   v: formatUSD(summary.totalRepaid   || 0), c: 'var(--profit)', click: () => { setTab('list'); setFilter('completed'); } },
          ].map((k, i) => (
            <motion.button key={k.l} onClick={k.click}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="kpi-card text-left hover:opacity-80 transition-opacity">
              <p className="text-[10px] mb-1" style={{ color: 'var(--text-2)' }}>{k.l}</p>
              <p className="text-lg font-black font-num" style={{ color: k.c }}>{k.v}</p>
            </motion.button>
          ))}
        </div>

        {/* ── Eligibility Banner ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            background: eligible ? 'var(--profit-dim)' : 'var(--loss-dim)',
            border:     `1px solid ${eligible ? 'rgba(9,212,125,0.25)' : 'rgba(240,80,75,0.25)'}`,
          }}>
          <span className="text-2xl">{eligible ? 'OK' : 'NO'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: eligible ? 'var(--profit)' : 'var(--loss)' }}>
              {eligible
                ? `Eligible — Max loan: ${formatUSD(maxLoan)}`
                : 'Not Eligible — Minimum $2,001 USDT balance required'}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
              Your USDT balance:{' '}
              <strong className="font-num" style={{ color: 'var(--text-1)' }}>{formatUSD(usdtBal)}</strong>
              {eligible && usdtBal < 5001 ? ' · 50% support' : eligible ? ' · 100% support' : ''}
            </p>
          </div>
          {eligible && tab !== 'apply' && (
            <button onClick={() => setTab('apply')} className="btn btn-brand btn-sm flex-shrink-0">
              Apply Now
            </button>
          )}
          {!eligible && (
            <a href="/wallet" className="btn btn-sm flex-shrink-0"
              style={{ background: 'var(--loss-dim)', color: 'var(--loss)', border: '1px solid rgba(240,80,75,0.3)' }}>
              Deposit
            </a>
          )}
        </motion.div>

        {/* ── LIST TAB ───────────────────────────────────────── */}
        {tab === 'list' && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {STATUS_FILTERS.map(st => {
                const cnt = st === 'all' ? loans.length : loans.filter((l: { status: string }) => l.status === st).length;
                const ss  = STATUS_MAP[st] || { color: 'var(--text-3)', bg: 'var(--bg-active)' };
                return (
                  <button key={st} onClick={() => setFilter(st)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap flex-shrink-0 capitalize transition-all"
                    style={{
                      background: filterStatus === st ? ss.bg : 'var(--bg-elevated)',
                      color:      filterStatus === st ? ss.color : 'var(--text-3)',
                      border:     `1px solid ${filterStatus === st ? ss.color + '40' : 'var(--border-1)'}`,
                    }}>
                    {st}
                    {cnt > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px]"
                        style={{
                          background: filterStatus === st ? ss.color + '25' : 'var(--bg-active)',
                          color:      filterStatus === st ? ss.color : 'var(--text-3)',
                        }}>
                        {cnt}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Loan cards */}
            {isLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-1)' }}>
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: 'var(--brand)' }} />
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-1)' }}>
                  {filterStatus === 'all' ? 'No loans yet' : `No ${filterStatus} loans`}
                </p>
                {filterStatus === 'all' && eligible && (
                  <button onClick={() => setTab('apply')} className="btn btn-brand btn-sm">Apply Now</button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((loan: any) => (
                  <LoanCard key={loan._id} loan={loan} onRepay={setRepay} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPLY TAB ──────────────────────────────────────── */}
        {tab === 'apply' && (
          <ApplyForm
            eligible={eligible}
            maxLoan={maxLoan}
            usdtBal={usdtBal}
            onSuccess={() => setTab('list')}
          />
        )}

        {/* Repay Modal */}
        <AnimatePresence>
          {repayId && repayLoan && <RepayModal loan={repayLoan} onClose={() => setRepay(null)} />}
        </AnimatePresence>
      </div>
   
  );
}
