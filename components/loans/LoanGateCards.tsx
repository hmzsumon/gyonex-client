"use client";

import { formatUSD } from "@/lib/format";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, LockKeyhole, Wallet } from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   KYC gate card
────────────────────────────────────────────────────────────── */
export function KycGate() {
  return (
    <div className="rounded-[28px] border border-amber-400/20 bg-[linear-gradient(135deg,rgba(245,183,49,0.12),rgba(15,15,18,0.95))] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20">
        <LockKeyhole className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-lg font-black text-white">
        KYC verification needed
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/50">
        KYC verification is required before applying for a loan. Once KYC is
        complete, the loan form will not ask for NID, selfie, legal name, or
        email again.
      </p>
      <Link
        href="/settings/profile"
        className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-black text-black shadow-[0_14px_45px_rgba(245,183,49,0.20)] transition hover:opacity-90"
      >
        Go to KYC Verification <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Not eligible balance card
────────────────────────────────────────────────────────────── */
export function BalanceGate({ usdtBal }: { usdtBal: number }) {
  const progress = Math.min(100, (usdtBal / 2001) * 100);

  return (
    <div className="rounded-[28px] border border-red-400/20 bg-[linear-gradient(135deg,rgba(240,75,85,0.12),rgba(15,15,18,0.95))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-300 ring-1 ring-red-400/20">
            <AlertTriangle className="h-3.5 w-3.5" /> Not Eligible
          </div>
          <h2 className="mt-4 text-lg font-black text-white">
            Minimum $2,001 USDT balance required
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Your current balance is {formatUSD(usdtBal)}. You need
            {formatUSD(Math.max(0, 2001 - usdtBal))} more to unlock this option.
          </p>
        </div>
        <Link
          href="/wallet"
          className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
        >
          Deposit Now <Wallet className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-[11px] font-bold text-white/45">
          <span>Eligibility progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400"
          />
        </div>
      </div>
    </div>
  );
}
