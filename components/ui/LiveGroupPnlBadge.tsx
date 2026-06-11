// components/ui/LiveGroupPnlBadge.tsx
"use client";

import PnlBadge from "@/components/ui/PnlBadge";
import { useLiveBook } from "@/hooks/useLiveBook";

type Row = {
  _id: string;
  symbol: string;
  status: "open" | "closed";
  side: "buy" | "sell";
  entryPrice: number | string;
  lots?: number | string;
  volume?: number | string;
};

function positionPnl(
  side: "buy" | "sell",
  entry: number,
  close: number,
  lots: number
) {
  const diff = side === "buy" ? close - entry : entry - close;
  return diff * lots;
}

export default function LiveGroupPnlBadge({
  symbol,
  positions,
  size = "sm",
  className = "",
}: {
  symbol: string;
  positions: Row[];
  size?: "sm" | "md";
  className?: string;
}) {
  const { book } = useLiveBook(symbol);
  const bid = Number(book?.bid);
  const ask = Number(book?.ask);

  const loading = !Number.isFinite(bid) || !Number.isFinite(ask);

  let value = 0;
  if (!loading) {
    for (const p of positions) {
      if (p.status !== "open") continue;
      const lots = Number(p.lots ?? p.volume ?? 0);
      const entry = Number(p.entryPrice);
      if (!Number.isFinite(lots) || !Number.isFinite(entry)) continue;
      const close = p.side === "buy" ? bid : ask;
      const v = positionPnl(p.side, entry, close, lots);
      if (Number.isFinite(v)) value += v;
    }
  }

  return (
    <PnlBadge
      value={value}
      loading={loading}
      size={size}
      className={className}
    />
  );
}
