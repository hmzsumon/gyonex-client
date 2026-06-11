// components/ui/LivePnlBadge.tsx
/* ───────────────────────────────────────────
   Live PnL badge for a single position
   - computes live pnl and renders PnlBadge
─────────────────────────────────────────── */

"use client";

import PnlBadge from "@/components/ui/PnlBadge";
import { useLivePnl } from "@/hooks/useLivePnl";

export default function LivePnlBadge({
  position,
  onClose,
  size = "md",
  className = "",
}: {
  position: {
    _id: string;
    symbol: string;
    side: "buy" | "sell";
    entryPrice: number;
    lots: number;
    volume?: number;
    profit?: number;
    lastPrice?: number;
    status?: "open" | "closed";
  };
  onClose?: (id: string) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const value = useLivePnl({
    symbol: position.symbol,
    side: position.side,
    entryPrice: position.entryPrice,
    lots: position.lots ?? position.volume ?? 0,
    fallbackClose: position.lastPrice,
    fallbackProfit: position.profit,
  });

  const loading = !Number.isFinite(value);

  return (
    <PnlBadge
      value={Number.isFinite(value) ? (value as number) : 0}
      loading={loading}
      size={size}
      className={className}
      onClose={
        !loading && onClose && position.status === "open"
          ? () => onClose(position._id)
          : undefined
      }
    />
  );
}
