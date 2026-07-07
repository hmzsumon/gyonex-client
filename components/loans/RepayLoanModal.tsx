"use client";

import { formatUSD } from "@/lib/format";
import { useRepayLoanMutation } from "@/redux/features/loan/loanApi";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────
   Repay modal
────────────────────────────────────────────────────────────── */
export default function RepayLoanModal({
  loan,
  onClose,
}: {
  loan: any;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [repayLoan, repayMutation] = useRepayLoanMutation();
  const remaining = Math.max(0, (loan.totalRepayable || 0) - (loan.totalPaid || 0));

  /* ────────── Handle repay loan ──────────
     Repayment success/error message will be shown using react-hot-toast.
  ────────────────────────────────────────────── */
  const handleRepay = async () => {
    const toastId = toast.loading("Processing repayment...");

    try {
      const res = await repayLoan({ loanId: loan._id, amount: Number(amount) }).unwrap();
      toast.success(res?.message || "Loan repayment successful", { id: toastId });
      onClose();
    } catch (e: any) {
      toast.error(
        e?.data?.message || e?.data?.error || e?.message || "Repayment failed",
        { id: toastId },
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.94, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 12 }}
        className="w-full max-w-md rounded-[28px] border border-white/10 bg-neutral-950 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.60)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">Repay Loan</h3>
            <p className="text-xs text-white/45">Remaining: {formatUSD(remaining)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/55"
          >
            ✕
          </button>
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Max ${formatUSD(remaining)}`}
          className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-center text-xl font-black text-white outline-none placeholder:text-white/25 focus:border-blue-400/40"
        />

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setAmount(((remaining * pct) / 100).toFixed(2))}
              className="rounded-xl bg-white/[0.06] py-2 text-xs font-black text-white/65 ring-1 ring-white/10"
            >
              {pct}%
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRepay}
          disabled={repayMutation.isLoading || !amount || Number(amount) <= 0}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 py-3 text-sm font-black text-white disabled:opacity-45"
        >
          {repayMutation.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Confirm Repayment
        </button>
      </motion.div>
    </motion.div>
  );
}
