// components/trade/MarketList.tsx
import React, { useEffect, useState } from "react";

const SYMBOLS = ["BTCUSDT", "AAVEUSDT", "ADAUSDT", "ALGOUSDT"] as const;
type SymbolKey = (typeof SYMBOLS)[number];

interface MiniTickerRaw {
  s: string; // symbol
  c: string; // last price
  o: string; // open price
  v: string; // volume
  [key: string]: unknown;
}

interface MiniTicker {
  lastPrice: number;
  changePercent: number;
  volume: number;
}

type TickerMap = Record<SymbolKey, MiniTicker>;

const MarketList: React.FC = () => {
  const [tickers, setTickers] = useState<Partial<TickerMap>>({});

  useEffect(() => {
    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const arr = JSON.parse(event.data) as MiniTickerRaw[];
        if (!Array.isArray(arr)) return;

        setTickers((prev) => {
          const next: Partial<TickerMap> = { ...prev };

          arr.forEach((t) => {
            if (!SYMBOLS.includes(t.s as SymbolKey)) return;

            const last = parseFloat(t.c);
            const open = parseFloat(t.o);
            const vol = parseFloat(t.v);

            let changePercent = 0;
            if (!Number.isNaN(last) && !Number.isNaN(open) && open !== 0) {
              changePercent = ((last - open) / open) * 100;
            }

            next[t.s as SymbolKey] = {
              lastPrice: Number.isNaN(last) ? 0 : last,
              changePercent: Number.isNaN(changePercent) ? 0 : changePercent,
              volume: Number.isNaN(vol) ? 0 : vol,
            };
          });

          return next;
        });
      } catch (error) {
        console.error("miniTicker parse error", error);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col rounded-2xl bg-slate-900/80 p-3 text-xs shadow-lg shadow-black/40">
      {/* tabs */}
      <div className="mb-2 flex gap-2 text-[11px]">
        <button className="flex-1 rounded-full bg-slate-800 px-2 py-1 text-center text-yellow-400">
          USDT
        </button>
        <button className="flex-1 rounded-full bg-slate-900 px-2 py-1 text-slate-400">
          USDⓈ
        </button>
        <button className="flex-1 rounded-full bg-slate-900 px-2 py-1 text-slate-400">
          FDUSD
        </button>
      </div>

      <div className="mb-1 flex justify-between text-[10px] text-slate-400">
        <span>Name / Vol</span>
        <span>Last Price • 24h Chg</span>
      </div>

      <div className="divide-y divide-slate-800">
        {SYMBOLS.map((symbol) => {
          const t = tickers[symbol];
          const change = t?.changePercent ?? 0;
          const isDown = change < 0;

          return (
            <div
              key={symbol}
              className="flex items-center justify-between py-2"
            >
              <div>
                <div className="text-[13px] font-medium">
                  {symbol.replace("USDT", "/USDT")}
                </div>
                <div className="mt-[2px] text-[11px] text-slate-500">
                  Vol{" "}
                  {t
                    ? t.volume.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "--"}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-[13px] ${
                    isDown ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {t ? t.lastPrice.toLocaleString() : "--"}
                </div>
                <div
                  className={`mt-[2px] text-[11px] ${
                    isDown ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {t ? `${change.toFixed(2)}%` : "--"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketList;
