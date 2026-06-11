// hooks/useMiniTickerMap.ts
"use client";

import { useEffect, useMemo, useState } from "react";

type CombinedMiniTickerMsg = {
  stream: string;
  data: { s: string; c: string };
};

export function useMiniTickerMap(symbols: string[]): Record<string, number> {
  const [prices, setPrices] = useState<Record<string, number>>({});

  const wantedList = useMemo(() => {
    const set = new Set(
      (symbols || [])
        .map((s) =>
          String(s || "")
            .toUpperCase()
            .trim()
        )
        .filter(Boolean)
    );
    return Array.from(set).sort(); // stable
  }, [symbols]);

  useEffect(() => {
    if (!wantedList.length) return;

    const streams = wantedList
      .map((s) => `${s.toLowerCase()}@miniTicker`)
      .join("/");
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    const ws = new WebSocket(url);

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as CombinedMiniTickerMsg;
        const sym = String(msg?.data?.s || "").toUpperCase();
        const last = Number(msg?.data?.c);

        if (!sym || !Number.isFinite(last)) return;

        setPrices((prev) => {
          if (prev[sym] === last) return prev;
          return { ...prev, [sym]: last };
        });
      } catch (e) {
        console.error("miniTicker parse error", e);
      }
    };

    ws.onerror = (e) => {
      console.error("miniTicker ws error", e);
      try {
        ws.close();
      } catch {}
    };

    return () => {
      try {
        ws.close();
      } catch {}
    };
  }, [wantedList.join(",")]);

  return prices;
}
