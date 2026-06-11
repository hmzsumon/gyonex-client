"use client";

import { fmt } from "@/utils/num";

export default function ClosedItemRow({
  item,
  onClick,
}: {
  item: {
    _id: string;
    symbol: string;
    side: "buy" | "sell";
    lots: number; // ← lots
    entryPrice: number;
    closePrice: number;
    pnl: number;
  };
  onClick: (id: string) => void;
}) {
  const pnlPos = item.pnl >= 0;

  return (
    <button
      onClick={() => onClick(item._id)}
      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 text-left hover:bg-neutral-900/70"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">
            {item.symbol.replace("USDT", "/USD")}
          </div>
          <div className="text-xs text-neutral-400">
            <span
              className={item.side === "buy" ? "text-blue-400" : "text-red-400"}
            >
              {item.side === "buy" ? "Buy" : "Sell"}
            </span>{" "}
            {fmt(item.lots, 2)} lot at {fmt(item.entryPrice, 2)}
          </div>
        </div>

        <div>
          <div
            className={[
              "rounded-md px-2 py-1 text-xs font-semibold",
              pnlPos
                ? "bg-green-700/15 text-green-400"
                : "bg-red-700/15 text-red-400",
            ].join(" ")}
          >
            <span>{(pnlPos ? "+" : "") + fmt(item.pnl, 2)} USDT</span>
          </div>
          <div className="rounded-md px-2 py-1 text-xs font-semibold">
            {" "}
            <span className="text-neutral-400"> {fmt(item.closePrice, 2)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
