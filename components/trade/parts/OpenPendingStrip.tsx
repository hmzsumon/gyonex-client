"use client";

import { usePriceStream } from "@/hooks/usePriceStream";

export type ActivePos = {
  _id: string;
  symbol: string;
  side: "buy" | "sell";
  volume: number; // lots/units
  entryPrice: number;
  contractSize?: number; // crypto হলে 1, metals হলে 100, ইত্যাদি
};

type Props = {
  symbol: string;
  openCount: number; // parent থেকে আসবে
  pendingCount?: number; // optional, default 0
  active: ActivePos | null; // শুধু current symbol-এর active position (থাকলে)
  onClosed?: (id: string) => void;
};

export default function OpenPendingStrip({
  symbol,
  openCount,
  pendingCount = 0,
  active,
  onClosed,
}: Props) {
  // live price for current symbol
  const { price } = usePriceStream(symbol);
  const bid = price?.bid ?? NaN;
  const ask = price?.ask ?? NaN;

  // active position-এর লাইভ PnL (buy→bid, sell→ask)
  let pnl = 0;
  if (active) {
    const closePx =
      active.side === "buy"
        ? isFinite(bid)
          ? bid
          : active.entryPrice
        : isFinite(ask)
        ? ask
        : active.entryPrice;

    const cs =
      typeof active.contractSize === "number"
        ? active.contractSize
        : active.symbol.includes("XAU")
        ? 100
        : 1; // crypto fallback

    const diff =
      active.side === "buy"
        ? closePx - active.entryPrice
        : active.entryPrice - closePx;

    pnl = diff * cs * active.volume;
  }

  const pillClass =
    pnl >= 0 ? "bg-green-600/15 text-green-400" : "bg-red-600/15 text-red-400";

  // এক্সনেসের মত: ওপেন পজিশন থাকলে তবেই স্ট্রিপ দেখাই
  if (!openCount) return null;

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 px-3 py-2">
      <div className="flex items-center justify-between">
        {/* left: Open / Pending */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-full bg-neutral-800 text-sm">
            Open <b className="ml-1">{openCount}</b>
          </button>
          <span className="px-3 py-1.5 rounded-full bg-neutral-800 text-sm opacity-80">
            Pending <b className="ml-1">{pendingCount}</b>
          </span>
        </div>

        {/* right: pnl pill + close */}
        <div
          className={`flex items-center gap-3 px-3 py-1.5 rounded-lg ${pillClass}`}
        >
          <span>
            {(pnl >= 0 ? "+" : "") + (isFinite(pnl) ? pnl.toFixed(2) : "0.00")}{" "}
            USD
          </span>
          <button
            onClick={() => active?._id && onClosed?.(active._id)}
            className="px-1.5 py-1 rounded bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700"
            title="Close position"
            disabled={!active?._id}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
