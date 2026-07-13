"use client";

import { formatUSD } from "@/lib/format";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  LockKeyhole,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { cn } from "./loan.helpers";

/* ─────────────────────────────────────────────────────────────
   Eligibility + KYC smart banner
────────────────────────────────────────────────────────────── */
export default function LoanEligibilityHero({
  eligible,
  isKycVerified,
  maxLoan,
  usdtBal,
  onApply,
}: {
  eligible: boolean;
  isKycVerified: boolean;
  maxLoan: number;
  usdtBal: number;
  onApply: () => void;
}) {
  const support = eligible ? (usdtBal >= 5001 ? "100%" : "50%") : "0%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_34%),linear-gradient(135deg,rgba(9,212,125,0.12),rgba(10,10,12,0.92)_48%,rgba(245,183,49,0.10))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Smart Loan Center
          </div>

          <h1 className="mt-4 text-xl font-black leading-tight text-white md:text-3xl">
            Get a fast loan with verified KYC and admin review.
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-white/55">
            Once KYC is verified, no extra document is required. Submit the
            amount and repayment period, then the status will be Under Review.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[10px] text-white/40">USDT Balance</p>
              <p className="mt-1 text-sm font-black text-white font-num">
                {formatUSD(usdtBal)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[10px] text-white/40">Support</p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                {support}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[10px] text-white/40">Max Loan</p>
              <p className="mt-1 text-sm font-black text-amber-300 font-num">
                {formatUSD(maxLoan)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[10px] text-white/40">KYC</p>
              <p
                className={cn(
                  "mt-1 text-sm font-black",
                  isKycVerified ? "text-emerald-300" : "text-red-300",
                )}
              >
                {isKycVerified ? "Verified" : "Required"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 backdrop-blur">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
            {isKycVerified ? (
              <BadgeCheck className="h-7 w-7" />
            ) : (
              <LockKeyhole className="h-7 w-7" />
            )}
          </div>

          <p className="mt-4 text-sm font-black text-white">
            {isKycVerified
              ? "KYC verified — ready to apply"
              : "KYC verification required"}
          </p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            {isKycVerified
              ? "Your KYC is already verified by admin, so the apply form is now simple."
              : "You need to submit and approve KYC before applying for a loan."}
          </p>

          {isKycVerified && eligible ? (
            <button
              type="button"
              onClick={onApply}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-3 text-sm font-black text-white shadow-[0_14px_45px_rgba(16,217,128,0.25)] transition hover:opacity-90"
            >
              Apply now <ArrowRight className="h-4 w-4" />
            </button>
          ) : !isKycVerified ? (
            <Link
              href="/settings/profile"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-black text-black shadow-[0_14px_45px_rgba(245,183,49,0.22)] transition hover:opacity-90"
            >
              Verify KYC <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/deposit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-black text-red-300 ring-1 ring-red-400/20 transition hover:bg-red-500/20"
            >
              Deposit USDT <Wallet className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
