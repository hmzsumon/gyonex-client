// components/trade/parts/PositionBadgeOverlay.tsx
"use client";

/* ── চার্টের উপর ছোট ব্যাজ + ক্লোজ ──────────────────────────
   - গ্লোবাল ইভেন্ট: position:opened / position:closed
   - P/L ক্যাল্ক: tradeMath.positionPnl (crypto: 1 lot = 1 coin)
---------------------------------------------------------------- */
import { usePriceStream } from "@/hooks/usePriceStream";
import { fmt } from "@/utils/num";
import { positionPnl } from "@/utils/tradeMath";
import { useEffect, useMemo, useState } from "react";
import ClosePositionDialog from "./ClosePositionDialog";

type Pos = {
  _id: string;
  symbol: string;
  side: "buy" | "sell";
  volume: number; // ✅ backend field name
  entryPrice: number;
  status: "open" | "closed";
};

export default function PositionBadgeOverlay({
  symbol,
  accountCurrency = "USD",
}: {
  symbol: string;
  accountCurrency?: string;
}) {
  const { price } = usePriceStream(symbol);
  const [pos, setPos] = useState<Pos | null>(null);
  const [showClose, setShowClose] = useState(false);

  // listen global events from place/close APIs
  useEffect(() => {
    const onOpen = (e: any) => {
      const p: Pos | undefined = e.detail?.position;
      if (
        p &&
        (p.symbol || "").toUpperCase() === symbol.toUpperCase() &&
        p.status === "open"
      ) {
        setPos(p);
      }
    };
    const onClosed = (e: any) => {
      const id = e.detail?.id;
      setPos((prev) => (prev && prev._id === id ? null : prev));
    };
    addEventListener("position:opened", onOpen as any);
    addEventListener("position:closed", onClosed as any);
    return () => {
      removeEventListener("position:opened", onOpen as any);
      removeEventListener("position:closed", onClosed as any);
    };
  }, [symbol]);

  // exec/close px (buy→bid, sell→ask)
  const closePx = useMemo(() => {
    if (!price || !pos) return NaN;
    const px = pos.side === "buy" ? price.bid : price.ask;
    return typeof px === "number" && isFinite(px) ? px : NaN;
  }, [pos, price]);

  // একটাই ম্যাথ
  const pnl = useMemo(() => {
    if (!pos || !isFinite(closePx)) return NaN;
    return positionPnl({
      side: pos.side,
      entryPrice: pos.entryPrice,
      closePrice: closePx,
      lots: pos.volume,
    });
  }, [pos, closePx]);

  if (!pos) return null;

  return (
    <>
      {/* entry badge + P/L + close button */}
      <div className="absolute left-0 bottom-0 z-10">
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
            {fmt(pos.volume, 2)}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded ${
              Number.isFinite(pnl) && pnl >= 0
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {Number.isFinite(pnl) ? (pnl >= 0 ? "+" : "") + fmt(pnl, 2) : "–"}{" "}
            {accountCurrency}
          </span>
          <button
            onClick={() => setShowClose(true)}
            className="ml-2 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs"
            title="Close position"
          >
            ✕
          </button>
        </div>
      </div>

      {showClose && (
        <ClosePositionDialog
          position={{
            _id: pos._id,
            symbol: pos.symbol,
            side: pos.side,
            volume: pos.volume,
            entryPrice: pos.entryPrice,
          }}
          lastPrice={price?.mid ?? pos.entryPrice}
          onDone={() => setShowClose(false)}
        />
      )}
    </>
  );
}
