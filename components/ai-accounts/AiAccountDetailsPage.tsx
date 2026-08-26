/* ──────────────────────────────────────────────────────────────────────────
   AiAccountDetailsPage — Smart Account Details with Cancel feature
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useFilteredClosedPositions } from "@/hooks/ai/useFilteredClosedPositions";
import {
  IAccount,
  useCancelAiAccountMutation,
} from "@/redux/features/ai-account/ai-accountApi";
import { useState } from "react";
import toast from "react-hot-toast";

/* ────────── helpers ────────── */
function fmt(n: number, d = 2) {
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-green-900/30 text-green-400 border border-green-800",
    inactive: "bg-red-900/30 text-red-400 border border-red-800",
    closed: "bg-neutral-800 text-neutral-400 border border-neutral-700",
  };
  const label = status === "inactive" ? "Cancelled" : status.toUpperCase();
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] ?? map.closed
      }`}
    >
      {label}
    </span>
  );
}

/* ────────── CancelModal ────────── */
function CancelModal({
  acc,
  onClose,
  onConfirmed,
}: {
  acc: IAccount;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  const [cancelAccount, { isLoading }] = useCancelAiAccountMutation();

  const planPrice = Number(acc.planPrice || 0);
  const fee = Math.round(planPrice * 0.25 * 100) / 100;
  const refund = Math.round((planPrice - fee) * 100) / 100;

  const handleConfirm = async () => {
    const toastId = toast.loading("Cancelling account…");
    try {
      const res: any = await cancelAccount({ id: acc._id }).unwrap();
      toast.success(
        res.message || `Account cancelled. ${refund} USDT refunded.`,
        { id: toastId },
      );
      onConfirmed();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-8">
      <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-6">
        {/* Title */}
        <div className="mb-1 flex items-center gap-2">
          <span className="text-red-400 text-xl">⚠️</span>
          <h3 className="text-lg font-bold text-white">Cancel Account?</h3>
        </div>
        <p className="text-sm text-neutral-400 mb-5">
          Cancelling this account will deduct a{" "}
          <span className="font-semibold text-red-400">
            25% cancellation fee
          </span>{" "}
          from your plan price. The remaining balance will be credited to your
          main wallet immediately.
        </p>

        {/* Fee breakdown */}
        <div className="mb-6 rounded-xl bg-neutral-800 p-4 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Plan Price</span>
            <span className="text-white font-medium">
              {fmt(planPrice)} USDT
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Cancellation Fee (25%)</span>
            <span className="text-red-400 font-medium">− {fmt(fee)} USDT</span>
          </div>
          <div className="border-t border-neutral-700 pt-2.5 flex justify-between">
            <span className="text-neutral-200 font-semibold">
              You will receive
            </span>
            <span className="text-green-400 font-bold">{fmt(refund)} USDT</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-neutral-800 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Keep Account
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-red-700 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────── InfoRow ────────── */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-neutral-800 last:border-0">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className="text-sm font-medium text-white text-right">{value}</span>
    </div>
  );
}

/* ────────── Main Component ────────── */
export default function AiAccountDetailsPage({
  acc,
  onBack,
}: {
  acc: IAccount;
  onBack: () => void;
}) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { items: closedPositions, loading: posLoading } =
    useFilteredClosedPositions();

  /* total profit from all closed positions for this account */
  const totalProfit = closedPositions.reduce((sum, p) => {
    const pnl = Number(p.pnlUsd ?? p.profit ?? 0);
    return sum + pnl;
  }, 0);

  const totalWinning = closedPositions.filter(
    (p) => !p.is_loss && Number(p.pnlUsd ?? p.profit ?? 0) > 0,
  ).length;

  const planPrice = Number(acc.planPrice || 0);
  const balance = Number(acc.balance ?? 0);

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white pb-28">
      <div className="max-w-4xl mx-auto px-4">
        {/* ── Header ── */}
        <div className="pt-6 flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold">Smart Trade Account Details</h1>
        </div>

        {/* ── Hero balance card ── */}
        <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-5 mb-4">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs text-neutral-500 mb-0.5">Account</p>
              <p className="text-lg font-bold tracking-wide">
                ST #{acc.accountNumber}
              </p>
              <div className="mt-1.5 flex gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                  CGFX
                </span>
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                  ST
                </span>
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 capitalize">
                  {acc.plan}
                </span>
              </div>
            </div>
            <StatusBadge status={acc.status} />
          </div>

          {/* Balance + Profit row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-neutral-800/60 p-3.5">
              <p className="text-xs text-neutral-500 mb-1">Current Balance</p>
              <p className="text-xl font-bold">
                {fmt(balance)}{" "}
                <span className="text-xs font-normal text-neutral-400">
                  USDT
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-neutral-800/60 p-3.5">
              <p className="text-xs text-neutral-500 mb-1">Total Profit</p>
              <p
                className={`text-xl font-bold ${
                  totalProfit >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {totalProfit >= 0 ? "+" : ""}
                {fmt(totalProfit)}{" "}
                <span className="text-xs font-normal text-neutral-400">
                  USDT
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Account Info ── */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 px-4 py-2 mb-4">
          <InfoRow label="Plan Price" value={`${fmt(planPrice)} USDT`} />
          <InfoRow label="Currency" value={acc.currency} />
          <InfoRow label="Status" value={<StatusBadge status={acc.status} />} />
          <InfoRow
            label="Closed Trades"
            value={posLoading ? "…" : closedPositions.length}
          />
          <InfoRow
            label="Winning Trades"
            value={
              posLoading ? (
                "…"
              ) : (
                <span className="text-green-400">{totalWinning}</span>
              )
            }
          />
        </div>

        {/* ── Trade History ── */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 mb-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-3">
            Trade History
          </h2>

          {posLoading ? (
            <p className="text-neutral-500 text-sm text-center py-6 animate-pulse">
              Loading…
            </p>
          ) : closedPositions.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-6">
              No closed positions yet
            </p>
          ) : (
            <div className="space-y-2">
              {closedPositions.slice(0, 15).map((pos) => {
                const pnl = Number(pos.pnlUsd ?? pos.profit ?? 0);
                return (
                  <div
                    key={pos.id}
                    className="flex items-center justify-between rounded-xl bg-neutral-900 px-3 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">
                        {pos.s}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          pos.side === "buy"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-red-900/50 text-red-400"
                        }`}
                      >
                        {pos.side?.toUpperCase()}
                      </span>
                      {pos.is_loss && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-900/30 text-red-500">
                          SL
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-semibold ${
                        pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {fmt(pnl)} USDT
                    </span>
                  </div>
                );
              })}
              {closedPositions.length > 15 && (
                <p className="text-center text-xs text-neutral-600 pt-1">
                  Showing 15 of {closedPositions.length} trades
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Cancel Button — only for active accounts ── */}
        {acc.status === "active" && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full rounded-xl border border-red-900 bg-red-900/20 py-3.5 text-sm font-semibold text-red-400 hover:bg-red-900/40 transition-colors"
          >
            Cancel Account
          </button>
        )}

        {acc.status === "inactive" && (
          <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 py-3.5 text-center text-sm text-neutral-500">
            This account has been cancelled
          </div>
        )}
      </div>

      {/* ── Cancel Confirmation Modal ── */}
      {showCancelModal && (
        <CancelModal
          acc={acc}
          onClose={() => setShowCancelModal(false)}
          onConfirmed={() => {
            setShowCancelModal(false);
            onBack();
          }}
        />
      )}
    </div>
  );
}
