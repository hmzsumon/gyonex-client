// hooks/usePriceFlashMap.ts
"use client";

import { useEffect, useRef, useState } from "react";

export type PriceDir = "up" | "down" | "flat";

export function usePriceFlashMap(
  prices: Record<string, number>,
  flashMs = 700
) {
  const prevRef = useRef<Record<string, number>>({});
  const timersRef = useRef<Record<string, any>>({});

  const [dirMap, setDirMap] = useState<Record<string, PriceDir>>({});
  const [flashMap, setFlashMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const prev = prevRef.current;
    const keys = Object.keys(prices);

    if (!keys.length) return;

    setDirMap((dprev) => {
      const next = { ...dprev };
      for (const k of keys) {
        const p = prev[k];
        const c = prices[k];
        if (!Number.isFinite(c)) continue;

        if (p == null) next[k] = "flat";
        else if (c > p) next[k] = "up";
        else if (c < p) next[k] = "down";
        else next[k] = next[k] ?? "flat";
      }
      return next;
    });

    setFlashMap((fprev) => {
      const next = { ...fprev };
      for (const k of keys) {
        const p = prev[k];
        const c = prices[k];
        if (p == null) continue; // first time, flash না
        if (c === p) continue;

        next[k] = true;

        if (timersRef.current[k]) clearTimeout(timersRef.current[k]);
        timersRef.current[k] = setTimeout(() => {
          setFlashMap((fp) => ({ ...fp, [k]: false }));
        }, flashMs);
      }
      return next;
    });

    prevRef.current = { ...prev, ...prices };
  }, [prices, flashMs]);

  return { dirMap, flashMap };
}
