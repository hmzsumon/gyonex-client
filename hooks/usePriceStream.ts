// hooks/usePriceStream.ts
/* ────────────────────────────────────────────────────────────
   usePriceStream — WS first; if it fails, smooth fallback tick
────────────────────────────────────────────────────────────── */
"use client";

import { useEffect, useRef, useState } from "react";

type Tick = { bid: number; ask: number; mid: number };

export function usePriceStream(symbol: string) {
  const [price, setPrice] = useState<Tick | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const fbTimer = useRef<any>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    stopFallback();
    wsRef.current?.close();

    const sym = normalize(symbol);

    // start fallback if WS doesn't open within X ms
    const openGuard = setTimeout(() => startFallback(sym), 1500);

    const url = `${
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000"
    }/ws/prices?symbol=${sym}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;
    openedRef.current = false;

    ws.onopen = () => {
      openedRef.current = true;
      clearTimeout(openGuard);
      stopFallback();
    };

    ws.onmessage = (ev) => {
      try {
        const t = JSON.parse(ev.data) as Partial<Tick>;
        if (typeof t.bid === "number" && typeof t.ask === "number") {
          const mid = (t.bid + t.ask) / 2;
          setPrice({ bid: t.bid, ask: t.ask, mid });
        }
      } catch {
        /* ignore bad frames */
      }
    };

    ws.onerror = () => {
      // if WS errors, move to fallback
      startFallback(sym);
    };
    ws.onclose = () => {
      // if it closes later, keep fallback running
      startFallback(sym);
    };

    return () => {
      clearTimeout(openGuard);
      ws.close();
      stopFallback();
    };
  }, [symbol]);

  return { price };

  // ── helpers ───────────────────────────────────────────────
  function startFallback(sym: string) {
    if (fbTimer.current) return; // already running
    let p = seedPrice(sym);

    fbTimer.current = setInterval(() => {
      // small percentage drift (crypto-friendly)
      const drift = p * (Math.random() - 0.5) * 0.0004; // ±0.04%
      p = Math.max(0.0001, p + drift);
      setPrice({ mid: p, bid: p - spread(sym), ask: p + spread(sym) });
    }, 800);
  }

  function stopFallback() {
    if (fbTimer.current) {
      clearInterval(fbTimer.current);
      fbTimer.current = null;
    }
  }
}

/** Normalize symbols so both BTCUSD / BTCUSDT / BTC/USD map consistently */
function normalize(sym: string) {
  let s = (sym || "").toUpperCase().replace("/", "");
  // if it's USDT-quoted, keep it; server can handle either BTCUSDT or BTCUSD
  // but we normalize for seeding
  if (s.endsWith("USDT")) s = s.replace("USDT", "USD");
  return s;
}

/** Reasonable seed prices so fallback never returns ~100 for BTC */
function seedPrice(sym: string) {
  const s = normalize(sym);
  if (s === "XAUUSD") return 2350;
  if (s === "EURUSD") return 1.1;
  if (s === "BTCUSD") return 109000; // << main fix
  if (s === "ETHUSD") return 2600;
  return 100; // generic
}

/** Symbol-specific half-spread for fallback ticks */
function spread(sym: string) {
  const s = normalize(sym);
  if (s.endsWith("USD")) {
    if (s.startsWith("BTC")) return 0.5;
    if (s.startsWith("ETH")) return 0.2;
    if (s === "XAUUSD") return 0.05;
  }
  return 0.05;
}
