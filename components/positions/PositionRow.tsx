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

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-1 py-2">
        {/* left: meta */}
        <div>
          <div className="text-xs text-neutral-300">
            <span className={sideC}>
              {p.side === "buy" ? "Buy" : "Sell"}{" "}
              {Number.isFinite(p.volume) ? p.volume.toFixed(2) : "–"} lot
            </span>{" "}
            <span className="text-neutral-400">
              at {Number.isFinite(p.entryPrice) ? p.entryPrice.toFixed(2) : "–"}
            </span>
          </div>
          {Number.isFinite(p.lastPrice) && (
            <div className="mt-0.5 text-xs text-neutral-500">
              {(p.lastPrice as number).toFixed(2)}
            </div>
          )}
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
