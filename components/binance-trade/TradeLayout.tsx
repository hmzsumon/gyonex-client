// components/trade/TradeLayout.tsx
"use client";

import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MarketList from "./MarketList";
import OrderBook from "./OrderBook";
import OrderForm from "./OrderForm";
import PairDrawer from "./PairDrawer";

export type Side = "buy" | "sell";
export type OrderType = "limit" | "market" | "stop-limit";

const TradeLayout: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [side, setSide] = useState<Side>("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [pairDrawerOpen, setPairDrawerOpen] = useState(false);

  // ✅ URL থেকে preselect symbol
  const qSymbol = searchParams.get("symbol");

  useEffect(() => {
    if (!qSymbol) return;
    setSymbol(qSymbol.toUpperCase());
  }, [qSymbol]);

  const lastPrice = useBinanceTicker(symbol);
  const prettySymbol = symbol.endsWith("USDT")
    ? `${symbol.replace("USDT", "")}/USDT`
    : symbol;

  return (
    <>
      <div className="min-h-screen bg-slate-950 px-4 py-5 text-slate-50 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row">
          {/* LEFT PANEL */}
          <div className="w-full rounded-2xl bg-slate-900/80 p-4 shadow-lg shadow-black/40 md:w-80">
            {/* HEADER: BTC/USDT + arrow + নিচে Vol */}
            <button
              type="button"
              onClick={() => setPairDrawerOpen(true)}
              className="mb-3 flex w-full items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2 text-left transition hover:bg-slate-800/90"
            >
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold leading-none">
                    {prettySymbol}
                  </span>
                  <span className="text-xs text-slate-400">▼</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  Vol 1.70B • 10x
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-semibold text-emerald-400">
                  {lastPrice ? Number(lastPrice).toLocaleString() : "--"}
                </div>
                <div className="text-[10px] text-slate-500">
                  24h Change -3.6%
                </div>
              </div>
            </button>

            {/* BUY / SELL Tabs – Binance shape */}
            <div className="mb-3 flex h-9 overflow-hidden rounded-md border border-slate-700 bg-slate-900 text-sm">
              {(["buy", "sell"] as Side[]).map((s) => {
                const active = side === s;
                const isBuy = s === "buy";

                const clipPath = isBuy
                  ? "polygon(0 0, 100% 0, 85% 100%, 0% 100%)"
                  : "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)";

                const bgColor = isBuy ? "#22c55e" : "#ef4444";

                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    className="relative flex-1 text-xs font-semibold uppercase tracking-wide text-slate-300"
                  >
                    {active && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{ clipPath, backgroundColor: bgColor }}
                      />
                    )}
                    <span className="relative z-10 flex h-full items-center justify-center">
                      {isBuy ? "Buy" : "Sell"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Order type tabs */}
            <div className="mb-3 flex gap-2 text-[11px]">
              {(["market"] as OrderType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`flex-1 rounded-full px-2 py-1 capitalize transition ${
                    orderType === type
                      ? "bg-slate-800 text-yellow-400"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <OrderForm side={side} symbol={symbol} lastPrice={lastPrice} />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 grid gap-4 md:grid-rows-[1.4fr_1.6fr]">
            <OrderBook lastPrice={lastPrice} />
            <MarketList />
          </div>
        </div>
      </div>

      {/* Pair drawer */}
      <PairDrawer
        open={pairDrawerOpen}
        selectedSymbol={symbol}
        side={side}
        onClose={() => setPairDrawerOpen(false)}
        onSelectSymbol={(newSymbol) => {
          setSymbol(newSymbol);
          setPairDrawerOpen(false);

          // ✅ (optional but nice) drawer থেকে select করলে URL-ও আপডেট
          router.replace(`/trade?symbol=${encodeURIComponent(newSymbol)}`);
        }}
      />
    </>
  );
};

export default TradeLayout;
