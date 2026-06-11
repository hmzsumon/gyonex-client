"use client";

/* compact single position row
   - live pnl badge (shared)
   - live close price readout (right of pnl)
   - close button opens ClosePositionDialog
*/
import ClosePositionDialog from "@/components/trade/parts/ClosePositionDialog";
import LiveClosePrice from "@/components/ui/LiveClosePrice";
import LivePnlBadge from "@/components/ui/LivePnlBadge";
import { useState } from "react";

function fmt2(n?: number) {
  return Number.isFinite(n as number) ? (n as number).toFixed(2) : "—";
}

export default function PositionRow({
  p,
  onCloseClick,
}: {
  p: {
    _id: string;
    symbol: string;
    side: "buy" | "sell";
    volume: number;
    entryPrice: number;
    status: "open" | "closed";
    profit?: number;
    lastPrice?: number;
  };
  onCloseClick?: (posId: string) => void;
}) {
  const sideC = p.side === "buy" ? "text-blue-400" : "text-red-400";
  const [showClose, setShowClose] = useState(false);

  const lastPx = Number.isFinite(p.lastPrice)
    ? (p.lastPrice as number)
    : p.entryPrice;

  const sideClr =
    p.side === "buy"
      ? "text-emerald-400 border-emerald-500/30"
      : "text-red-400 border-red-500/30";

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-1 py-2">
        {/* left: meta */}
        <div className="flex items-center gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-200">
              <span>{p.symbol}</span>
            </div>

            <div className="text-xs text-neutral-400">
              <span
                className={`mr-1 rounded px-1.5 py-0.5 text-[10px] border ${sideClr}`}
              >
                {p.side.toUpperCase()}
              </span>{" "}
              {Number(p.volume | 0).toFixed(2)} lot at {fmt2(p.entryPrice)}
            </div>
          </div>
        </div>

        {/* right: PnL badge + live close price + close button */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <LivePnlBadge
              position={{
                _id: p._id,
                symbol: p.symbol,
                side: p.side,
                entryPrice: p.entryPrice,
                lots: p.volume,
                profit: p.profit,
                lastPrice: p.lastPrice,
                status: p.status,
              }}
              onClose={onCloseClick}
              size="sm"
            />

            {/* live close price readout (like Exness small gray number) */}
            <LiveClosePrice
              symbol={p.symbol}
              side={p.side}
              fallback={lastPx}
              className="min-w-[64px]" // keeps it aligned; tweak as you like
            />
          </div>

          {p.status === "open" && (
            <button
              onClick={() => setShowClose(true)}
              className="px-1.5 py-1 rounded bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700"
              title="Close position"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {showClose && (
        <ClosePositionDialog
          position={{
            _id: p._id,
            symbol: p.symbol,
            side: p.side,
            volume: p.volume,
            entryPrice: p.entryPrice,
          }}
          lastPrice={lastPx}
          onDone={() => {
            setShowClose(false);
            if (onCloseClick) onCloseClick(p._id);
          }}
        />
      )}
    </>
  );
}
