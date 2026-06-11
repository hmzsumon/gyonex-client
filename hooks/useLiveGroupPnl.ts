// hooks/useLiveGroupPnl.ts
"use client";

import { useLiveBook } from "@/hooks/useLiveBook";
import { symbolPnlSumFromBook } from "@/utils/tradeMath";

type Row = {
  _id: string;
  symbol: string;
  status: "open" | "closed";
  side: "buy" | "sell";
  entryPrice: number | string;
  lots?: number | string;
  volume?: number | string;
};

export function useLiveGroupPnl(symbol: string, positions: Row[]) {
  const { book } = useLiveBook(symbol);
  const bid = Number(book?.bid);
  const ask = Number(book?.ask);
  return symbolPnlSumFromBook(symbol, positions, bid, ask);
}
