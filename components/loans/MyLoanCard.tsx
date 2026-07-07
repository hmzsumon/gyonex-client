"use client";

import { formatUSD } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Timer } from "lucide-react";
import { useState } from "react";
import { STATUS_MAP } from "./loan.constants";
import { getLoanType } from "./loan.helpers";
import { useCountdown } from "./useCountdown";

/* ─────────────────────────────────────────────────────────────
   My loan smart card
────────────────────────────────────────────────────────────── */
export default function MyLoanCard({
  loan,
  onRepay,
}: {
  loan: any;
  onRepay: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const type = getLoanType(loan.loanType);
  const Icon = type.icon;
  const status = STATUS_MAP[loan.status] || STATUS_MAP.pending;
  const time = useCountdown(loan.dueDate);
  const remaining = Math.max(0, (loan.totalRepayable || 0) - (loan.totalPaid || 0));
  const repayPct = loan.totalRepayable
    ? Math.min(100, ((loan.totalPaid || 0) / loan.totalRepayable) * 100)
    : 0;

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03] shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/[0.025]"
      >
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1"
          style={{
            background: `${type.color}15`,
            color: type.color,
            borderColor: `${type.color}30`,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-white">{type.label}</p>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-black"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/45">
            <span>
              Requested: <b className="text-white">{formatUSD(loan.requestedAmount || 0)}</b>
            </span>
            {!!loan.approvedAmount && (
              <span>
                Approved: <b className="text-emerald-300">{formatUSD(loan.approvedAmount)}</b>
              </span>
            )}
            {loan.status === "active" && (
              <span>
                Remaining: <b className="text-red-300">{formatUSD(remaining)}</b>
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {loan.status === "active" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRepay(loan._id);
              }}
              className="hidden rounded-xl bg-blue-500 px-3 py-2 text-xs font-black text-white sm:block"
            >
              Repay
            </button>
          )}
          {open ? (
            <ChevronUp className="h-4 w-4 text-white/35" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/35" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-white/35">
                  Loan details
                </p>
                {[
                  ["Period", `${loan.repaymentPeriodDays || 0} days`],
                  ["Rate", `${((loan.interestRate || 0.06) * 100).toFixed(0)}%/month`],
                  ["Total repayable", formatUSD(loan.totalRepayable || 0)],
                  ["Total paid", formatUSD(loan.totalPaid || 0)],
                  ["Admin note", loan.adminNote || "—"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-white/10 py-2 text-xs last:border-b-0"
                  >
                    <span className="text-white/40">{label}</span>
                    <span className="text-right font-bold text-white/80">{value}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-white/35">
                  Repayment status
                </p>
                {loan.status === "active" && (
                  <div className="mb-3 rounded-2xl bg-blue-400/10 p-3 text-xs font-black text-blue-300 ring-1 ring-blue-400/20">
                    <Timer className="mb-1 h-4 w-4" />
                    {time.days}d {String(time.hours).padStart(2, "0")}h {String(time.mins).padStart(2, "0")}m left
                  </div>
                )}
                <div className="mb-2 flex justify-between text-[11px] font-bold text-white/45">
                  <span>Paid progress</span>
                  <span>{repayPct.toFixed(0)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${repayPct}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
