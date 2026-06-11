// hooks/useLiveBook.ts
"use client";
import { useServerQuote } from "@/hooks/useServerQuote";

export function useLiveBook(symbol: string) {
  const { bid, ask, mid, spreadAbs, ts } = useServerQuote(symbol);
  return { book: { bid, ask, mid, spreadAbs, ts } };
}
