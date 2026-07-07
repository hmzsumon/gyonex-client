"use client";

import { formatUSD } from "@/lib/format";
import { useApplyForLoanMutation } from "@/redux/features/loan/loanApi";
import { ArrowRight, Gauge, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { LOAN_TYPES } from "./loan.constants";
import { cn } from "./loan.helpers";
import { KycGate } from "./LoanGateCards";
import LoanTypeSelector from "./LoanTypeSelector";

/* ─────────────────────────────────────────────────────────────
   Smart loan apply form
   Only amount + repayment period will be submitted.
────────────────────────────────────────────────────────────── */
export default function SmartLoanApplyForm({
  eligible,
  isKycVerified,
  maxLoan,
  usdtBal,
  onSuccess,
}: {
  eligible: boolean;
  isKycVerified: boolean;
  maxLoan: number;
  usdtBal: number;
  onSuccess: () => void;
}) {
  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0]);
  const [requestedAmount, setRequestedAmount] = useState("");
  const [repaymentPeriodDays, setRepaymentPeriodDays] = useState(
    String(LOAN_TYPES[0].defaultDays),
  );
  const [applyForLoan, applyMutation] = useApplyForLoanMutation();

  const amount = Number(requestedAmount) || 0;
  const days = Number(repaymentPeriodDays) || selectedType.defaultDays;
  const interest = amount * 0.06 * (days / 30);
  const total = amount + interest;
  const daily = days > 0 ? total / days : 0;

  const canSubmit =
    isKycVerified && amount >= 50 && amount <= maxLoan && days >= 7;

  const amountChips = useMemo(() => {
    const values = [0.25, 0.5, 0.75, 1].map((pct) =>
      Math.max(50, Math.floor(maxLoan * pct)),
    );
    return Array.from(new Set(values)).filter((v) => v <= maxLoan && v >= 50);
  }, [maxLoan]);

  const periodOptions = useMemo(
    () => [7, 14, 30, 50, 60, 90, 120, 180].filter((d) => d <= selectedType.maxDays),
    [selectedType.maxDays],
  );

  /* ────────── Handle Apply Loan ──────────
     KYC verified user can apply for a loan.
     No file upload is required here, so FormData is not needed.
  ────────────────────────────────────────────── */
  const handleApply = async () => {
    const toastId = toast.loading("Submitting loan application...");

    try {
      const res = await applyForLoan({
        loanType: selectedType.key,
        requestedAmount: Number(amount),
        repaymentPeriodDays: Number(days),
      }).unwrap();

      toast.success(
        res?.message || "Loan application submitted. Status: Under Review.",
        { id: toastId },
      );

      setRequestedAmount("");
      window.setTimeout(() => onSuccess(), 1200);
    } catch (e: any) {
      toast.error(
        e?.data?.message || e?.data?.error || e?.message || "Submission failed",
        { id: toastId },
      );
    }
  };

  if (!isKycVerified) return <KycGate />;


  return (
    <div className="space-y-5">

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* ────────── Step 01: loan package ────────── */}
          <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                  Step 01
                </p>
                <h2 className="mt-1 text-lg font-black text-white">
                  Select loan package
                </h2>
              </div>
              <div className="hidden rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-400/20 sm:block">
                6% / month
              </div>
            </div>
            <LoanTypeSelector
              selectedType={selectedType}
              onSelect={(type) => {
                setSelectedType(type);
                setRepaymentPeriodDays(String(type.defaultDays));
              }}
            />
          </section>

          {/* ────────── Step 02: amount + period ────────── */}
          <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300">
                  Step 02
                </p>
                <h2 className="mt-1 text-lg font-black text-white">
                  Amount & repayment period
                </h2>
              </div>
              <div className="rounded-full bg-blue-400/10 px-3 py-1 text-[11px] font-bold text-blue-300 ring-1 ring-blue-400/20">
                Max {formatUSD(maxLoan)}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-white/65">
                  Loan Amount (USDT) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-white/35">
                    $
                  </span>
                  <input
                    type="number"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    min={50}
                    max={maxLoan}
                    placeholder="Enter loan amount"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-9 pr-4 text-base font-black text-white outline-none transition placeholder:text-white/25 focus:border-blue-400/40 focus:bg-white/[0.08]"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {amountChips.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRequestedAmount(String(value))}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[11px] font-black transition",
                        amount === value
                          ? "bg-blue-500 text-white"
                          : "bg-white/[0.06] text-white/55 ring-1 ring-white/10 hover:bg-white/[0.09]",
                      )}
                    >
                      {formatUSD(value)}
                    </button>
                  ))}
                </div>
                {amount > maxLoan && (
                  <p className="mt-2 text-xs font-semibold text-red-300">
                    Amount exceeds the maximum loan limit. Max {formatUSD(maxLoan)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-white/65">
                  Repayment Period *
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {periodOptions.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setRepaymentPeriodDays(String(day))}
                      className={cn(
                        "rounded-2xl px-3 py-3 text-center text-xs font-black transition",
                        days === day
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-[0_12px_35px_rgba(59,130,246,0.20)]"
                          : "bg-white/[0.06] text-white/55 ring-1 ring-white/10 hover:bg-white/[0.09]",
                      )}
                    >
                      {day} days
                      {day === selectedType.defaultDays && (
                        <span className="mt-1 block text-[9px] font-bold opacity-70">
                          Recommended
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ────────── Preview + submit card ────────── */}
        <aside className="space-y-4">
          <div className="sticky top-5 rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/20">
                <Gauge className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Loan Preview</p>
                <p className="text-[11px] text-white/45">
                  Admin can edit approved amount
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                ["Requested", amount >= 50 ? formatUSD(amount) : "—", "text-white"],
                ["Interest", amount >= 50 ? formatUSD(interest) : "—", "text-red-300"],
                ["Repayable", amount >= 50 ? formatUSD(total) : "—", "text-amber-300"],
                ["Daily approx", amount >= 50 ? formatUSD(daily) : "—", "text-emerald-300"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-3 ring-1 ring-white/10"
                >
                  <span className="text-xs text-white/45">{label}</span>
                  <span className={cn("text-sm font-black font-num", color)}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/10 p-3">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-[11px] leading-5 text-white/60">
                  After submission, the status will be <b className="text-amber-300">Under Review</b>. Admin can review, edit the approved amount, then approve or reject it.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApply}
              disabled={!canSubmit || applyMutation.isLoading}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 text-sm font-black text-white shadow-[0_14px_45px_rgba(16,217,128,0.22)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {applyMutation.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit for Under Review <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {!canSubmit && (
              <p className="mt-3 text-center text-[11px] font-semibold text-white/35">
                Amount must be between $50 and {formatUSD(maxLoan)}.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
