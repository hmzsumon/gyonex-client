// hooks/useSymbolStripMetrics.ts
"use client";

import { useLiveBook } from "@/hooks/useLiveBook";
import { positionPnl } from "@/utils/tradeMath";
import { useMemo } from "react";

type Pos = {
  _id: string;
  symbol: string;
  status: "open" | "closed";
  side: "buy" | "sell";
  entryPrice: number | string;
  lots?: number | string;
  volume?: number | string;
};

export function useSymbolStripMetrics({
  symbol,
  positions,
}: {
  symbol: string;
  positions: Pos[];
}) {
  const { book } = useLiveBook(symbol);
  const bid = Number(book?.bid);
  const ask = Number(book?.ask);

  const openPositions = useMemo(
    () =>
      (positions || [])
        .filter(
          (p) =>
            p.status === "open" &&
            (p.symbol || "").toUpperCase() === symbol.toUpperCase()
        )
        .map((p) => ({
          ...p,
          lots: Number(p.lots ?? p.volume ?? 0),
          entryPrice: Number(p.entryPrice),
        })),
    [positions, symbol]
  );

  const pnl = useMemo(() => {
    if (!Number.isFinite(bid) || !Number.isFinite(ask)) return 0;
    let acc = 0;
    for (const p of openPositions) {
      const closePx = p.side === "buy" ? bid : ask;
      const v = positionPnl({
        side: p.side,
        entryPrice: p.entryPrice as number,
        closePrice: closePx,
        lots: p.lots as number,
      });
      if (Number.isFinite(v)) acc += v;
    }
    return acc;
  }, [openPositions, bid, ask]);

  const lastOpenId = useMemo(() => openPositions[0]?._id, [openPositions]);

  return {
    openCount: openPositions.length,
    pendingCount: 0,
    pnl,
    lastOpenId,
    closePxBid: bid,
    closePxAsk: ask,
  };
}
