// components/positions/ClosedDetailDrawer.tsx
"use client";

import { fmt } from "@/utils/num";

export default function ClosedDetailDrawer({
  open,
  onClose,
  onViewChart,
  item,
}: {
  open: boolean;
  onClose: () => void;
  onViewChart?: (item: {
    _id: string;
    symbol: string;
    side: "buy" | "sell";
  }) => void;
  item?: {
    _id: string;
    ticket?: string | number; // optional order number for header
    symbol: string;
    side: "buy" | "sell";
    lots: number;
    entryPrice: number;
    closePrice: number;
    openedAt?: string | Date | null;
    closedAt?: string | Date | null;
    pnl: number;
    commissionClose?: number;
    takeProfit?: number;
    stopLoss?: number;
    closedBy?: string; // e.g. "User"
  };
}) {
  if (!open || !item) return null;

  const sideC = item.side === "buy" ? "text-blue-400" : "text-red-400";
  const pnlPos = item.pnl >= 0;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* sheet */}
      <div className="absolute left-0 right-0 bottom-0 bg-neutral-950 rounded-t-2xl border-t border-neutral-800">
        {/* handle */}
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-neutral-700/60" />

        {/* header */}
        <div className="px-5 pt-2 pb-1 text-center">
          <div className="text-xs text-neutral-500 font-medium">
            #{String(item.ticket ?? item._id).slice(-10)}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-left">
              <div className="text-base font-semibold">{item.symbol}</div>
              <div className="text-sm">
                <span className={sideC}>
                  {item.side === "buy" ? "Buy" : "Sell"}
                </span>{" "}
                {fmt(item.lots, 2)} at {fmt(item.entryPrice, 2)}
              </div>
            </div>

            <div
              className={[
                "rounded-lg px-3 py-1.5 text-sm font-semibold",
                pnlPos
                  ? "bg-green-600/15 text-green-400"
                  : "bg-red-600/15 text-red-400",
              ].join(" ")}
            >
              {(pnlPos ? "+" : "") + fmt(item.pnl, 2)} USD
            </div>
          </div>
        </div>

        {/* body */}
        <div className="px-5 pb-4">
          <div className="grid  gap-2 text-sm">
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Open time</div>
              <div>
                {item.openedAt ? new Date(item.openedAt).toLocaleString() : "–"}
              </div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Close time</div>
              <div>
                {item.closedAt ? new Date(item.closedAt).toLocaleString() : "–"}
              </div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Closed by</div>
              <div>{item.closedBy ?? "User"}</div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Commission</div>
              <div>{fmt(item.commissionClose ?? 0, 2)} USD</div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Stop Loss</div>
              <div>
                {Number.isFinite(item.stopLoss as number)
                  ? fmt(item.stopLoss, 2)
                  : "—"}
              </div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Take Profit</div>
              <div>
                {Number.isFinite(item.takeProfit as number)
                  ? fmt(item.takeProfit, 2)
                  : "—"}
              </div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Open Price</div>
              <div>{fmt(item.entryPrice, 2)}</div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-neutral-400">Close Price</div>
              <div>{fmt(item.closePrice, 2)}</div>
            </div>
          </div>
        </div>

        {/* footer action (full-width like screenshot) */}
      </div>
    </div>
  );
}
