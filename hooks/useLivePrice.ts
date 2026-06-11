// hooks/useLivePrice.ts
"use client";

import { useLiveBook } from "@/hooks/useLiveBook";
import { num } from "@/utils/num";

export function useLiveClosePrice(
  symbol: string,
  side: "buy" | "sell",
  fallback?: number
) {
  const { book } = useLiveBook(symbol);
  const px = side === "buy" ? book?.bid ?? fallback : book?.ask ?? fallback;
  return num(px);
}
