/* components/trade/parts/LiveChartPositionOverlay.tsx */
"use client";

import { usePriceStream } from "@/hooks/usePriceStream";
import { IChartApi, IPriceLine } from "lightweight-charts";
import { useEffect, useMemo, useRef, useState } from "react";
import ClosePositionDialog from "./ClosePositionDialog";

type Pos = {
  _id: string;
  symbol: string; // Binance raw (e.g. BTCUSDT)
  side: "buy" | "sell";
  lots: number; // demo: amount
  entryPrice: number;
  status: "open" | "closed";
};

export default function LiveChartPositionOverlay({
  symbol,
  accountCurrency = "USD",
}: {
  symbol: string;
  accountCurrency?: string;
}) {
  const [pos, setPos] = useState<Pos | null>(null);
  const [showClose, setShowClose] = useState(false);

  // ✅ সঠিক টাইপ: addCandlestickSeries এর ReturnType
  type CandlestickSeries = ReturnType<IChartApi["addCandlestickSeries"]>;
  const seriesRef = useRef<CandlestickSeries | null>(null);
  const priceLineRef = useRef<IPriceLine | null>(null);

  const { price } = usePriceStream(symbol);

  /* ───────────────── chart ready → pick series ───────────────── */
  useEffect(() => {
    const onReady = (e: CustomEvent) => {
      // expect: dispatchEvent(new CustomEvent("chart:ready", { detail: { symbol, series } }))
      const detail: any = (e as any).detail;
      if (!detail || detail.symbol !== symbol) return;

      seriesRef.current = detail.series as CandlestickSeries;

      // যদি position আগে থেকেই থাকে তাহলে এন্ট্রি লাইন আঁকো
      if (pos && !priceLineRef.current && seriesRef.current) {
        priceLineRef.current = seriesRef.current.createPriceLine({
          price: pos.entryPrice,
          color: "#3b82f6",
          lineStyle: 2,
          lineWidth: 2,
          axisLabelVisible: true,
          title: pos.side === "buy" ? "BUY" : "SELL",
        });
      }
    };

    addEventListener("chart:ready", onReady as EventListener);
    return () => {
      removeEventListener("chart:ready", onReady as EventListener);
    };
  }, [symbol, pos]);

  /* ─────────────── position open/close events ─────────────── */
  useEffect(() => {
    const onOpen = (e: CustomEvent) => {
      const p: Pos | undefined = (e as any).detail?.position;
      if (!p || p.symbol !== symbol || p.status !== "open") return;

      setPos(p);

      if (seriesRef.current && !priceLineRef.current) {
        priceLineRef.current = seriesRef.current.createPriceLine({
          price: p.entryPrice,
          color: "#3b82f6",
          lineStyle: 2,
          lineWidth: 2,
          axisLabelVisible: true,
          title: p.side === "buy" ? "BUY" : "SELL",
        });
      }
    };

    const onClosed = (e: CustomEvent) => {
      const id = (e as any).detail?.id as string | undefined;
      if (!pos || !id || id !== pos._id) return;

      setPos(null);

      // ✅ সঠিক রিমুভ API
      try {
        if (seriesRef.current && priceLineRef.current) {
          seriesRef.current.removePriceLine(priceLineRef.current);
        }
      } catch {
        /* ignore */
      } finally {
        priceLineRef.current = null;
      }
    };

    addEventListener("position:opened", onOpen as EventListener);
    addEventListener("position:closed", onClosed as EventListener);
    return () => {
      removeEventListener("position:opened", onOpen as EventListener);
      removeEventListener("position:closed", onClosed as EventListener);
    };
  }, [symbol, pos]);

  /* ─────────────── live PNL (buy→bid, sell→ask) ─────────────── */
  const pnl = useMemo(() => {
    if (!pos || !price) return 0;
    const closeable =
      pos.side === "buy"
        ? price.bid ?? price.mid ?? pos.entryPrice
        : price.ask ?? price.mid ?? pos.entryPrice;
    const diff =
      pos.side === "buy"
        ? closeable - pos.entryPrice
        : pos.entryPrice - closeable;
    // ক্রিপ্টো: lots = amount (contractSize=1)
    return diff * pos.lots;
  }, [pos, price]);

  if (!pos) return null;

  return (
    <>
      {/* Top P/L ticker (right) */}
      <div className="absolute right-4 top-[66px] z-20">
        <div
          className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border ${
            pnl >= 0
              ? "bg-green-600/15 text-green-300 border-green-700/40"
              : "bg-red-600/15 text-red-300 border-red-700/40"
          }`}
        >
          <div className="font-semibold">
            {pnl >= 0 ? "+" : ""}
            {pnl.toFixed(2)} {accountCurrency}
          </div>
          <button
            onClick={() => setShowClose(true)}
            className="opacity-80 hover:opacity-100"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Left entry badge (lots + live pnl + close) */}
      <div className="absolute left-4 top-[120px] z-20">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-sm">
            {pos.lots.toFixed(2)}
          </span>
          <span
            className={`px-2 py-1 rounded-md text-sm ${
              pnl >= 0
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {pnl >= 0 ? "+" : ""}
            {pnl.toFixed(2)} {accountCurrency}
          </span>
          <button
            onClick={() => setShowClose(true)}
            className="ml-1 px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Close dialog */}
      {showClose && (
        <ClosePositionDialog
          position={{
            _id: pos._id,
            symbol: pos.symbol,
            side: pos.side,
            volume: pos.lots, // dialog prop name 'volume'
            entryPrice: pos.entryPrice,
          }}
          lastPrice={price?.mid ?? pos.entryPrice}
          onDone={() => setShowClose(false)}
        />
      )}
    </>
  );
}
