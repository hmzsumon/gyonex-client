// hooks/useLivePnl.ts
"use client";

import { useLiveClosePrice } from "@/hooks/useLivePrice";
import { num } from "@/utils/num";
import { positionPnl } from "@/utils/tradeMath";

export function useLivePnl(p: {
  symbol: string;
  side: "buy" | "sell";
  entryPrice: number;
  lots: number;
  fallbackClose?: number;
  fallbackProfit?: number;
}) {
  const liveClose = useLiveClosePrice(p.symbol, p.side, p.fallbackClose);
  const live = Number.isFinite(liveClose)
    ? positionPnl({
        side: p.side,
        entryPrice: p.entryPrice,
        closePrice: liveClose,
        lots: num(p.lots),
      })
    : num(p.fallbackProfit);
  return live;
}
