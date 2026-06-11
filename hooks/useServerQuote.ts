"use client";

import { useSocket } from "@/context/SocketContext";
import { useEffect, useMemo, useRef, useState } from "react";

type Quote = { symbol: string; bid: number; ask: number; ts: number };

export function useServerQuote(symbol: string) {
  const { socket, isSocketConnected } = useSocket();
  const [q, setQ] = useState<Quote | null>(null);

  const sym = (symbol || "").toUpperCase();
  const symRef = useRef(sym);
  const subscribedRef = useRef(false);

  useEffect(() => {
    symRef.current = sym;
  }, [sym]);

  useEffect(() => {
    if (!socket || !isSocketConnected || !sym) return;

    // console.log("useServerQuote", socket, isSocketConnected, sym);

    const subscribe = () => {
      if (!socket || !isSocketConnected || !symRef.current) return;
      socket.emit("subscribe", { symbol: symRef.current });
      subscribedRef.current = true;
    };

    const unsubscribe = () => {
      if (!socket || !subscribedRef.current) return;
      socket.emit("unsubscribe", { symbol: symRef.current });
      subscribedRef.current = false;
    };

    const ev = `quote:${sym}`;

    const onDirectQuote = (msg: any) => {
      // সিম্বল মিলছে কিনা চেক (সেফটির জন্য)
      if ((msg?.symbol || "").toUpperCase() !== symRef.current) return;

      const bid = Number(msg.bid);
      const ask = Number(msg.ask);
      const ts = Number(msg.ts);

      if (Number.isFinite(bid) && Number.isFinite(ask) && ask > bid) {
        setQ({ symbol: symRef.current, bid, ask, ts });
      }
    };

    // listener attach
    socket.on(ev, onDirectQuote);

    // subscribe now
    subscribe();

    // reconnect হলে আবার subscribe
    const onReconnect = () => subscribe();
    socket.on("connect", onReconnect);

    return () => {
      socket.off(ev, onDirectQuote);
      socket.off("connect", onReconnect);
      unsubscribe();
    };
  }, [socket, isSocketConnected, sym]);

  const computed = useMemo(() => {
    const bid = Number(q?.bid);
    const ask = Number(q?.ask);
    const mid =
      Number.isFinite(bid) && Number.isFinite(ask) ? (bid + ask) / 2 : NaN;
    const spreadAbs =
      Number.isFinite(bid) && Number.isFinite(ask) ? ask - bid : NaN;
    const spreadBps =
      Number.isFinite(mid) && Number.isFinite(spreadAbs)
        ? (spreadAbs / mid) * 10_000
        : NaN;

    return { bid, ask, mid, spreadAbs, spreadBps, ts: q?.ts ?? 0 };
  }, [q]);

  return { quote: q, ...computed };
}
