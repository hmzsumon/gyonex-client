"use client";

import { FiCheck, FiClock, FiCopy } from "react-icons/fi";

/* ── props ─────────────────────────────────────────────────── */
type Item = {
  id: string;
  amount: number;
  status: "Completed" | "Pending";
  date: string;
  txId: string;
};

type Props = {
  items: Item[];
  onCopy: (txId: string) => void;
  copiedId: string | null;
  formatTxId: (txId: string) => string;
};

/* ── component ─────────────────────────────────────────────── */
export default function HistoryPanel({
  items,
  onCopy,
  copiedId,
  formatTxId,
}: Props) {
  return (
    <div className="border-b border-neutral-800 bg-neutral-950 px-6 py-4">
      <h3 className="mb-3 flex items-center text-sm font-medium text-neutral-200">
        <FiClock className="mr-2 text-neutral-400" /> Deposit history
      </h3>

      <div className="max-h-60 space-y-3 overflow-y-auto">
        {items.map((d) => (
          <div
            key={d.id}
            className="border-b border-neutral-900 pb-3 last:border-0"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-neutral-100">${d.amount} USDT</p>
                <p className="text-xs text-neutral-400">{d.date}</p>
              </div>

              <div className="text-right">
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs",
                    d.status === "Completed"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-yellow-500/15 text-yellow-300",
                  ].join(" ")}
                >
                  {d.status}
                </span>

                <div className="mt-1 flex items-center justify-end">
                  <p className="text-xs text-neutral-400">
                    {formatTxId(d.txId)}
                  </p>
                  <button
                    onClick={() => onCopy(d.txId)}
                    className="ml-1 rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                    title="Copy full TX ID"
                  >
                    {copiedId === d.txId ? (
                      <FiCheck className="text-emerald-400" />
                    ) : (
                      <FiCopy />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No deposit history yet.</p>
        )}
      </div>
    </div>
  );
}
