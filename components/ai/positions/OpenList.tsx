"use client";

import LiveTotalPnlBadge from "@/components/ui/LiveTotalPnlBadge";
import { useFilteredOpenPositions } from "@/hooks/ai/useFilteredOpenPositions";
import { useMemo } from "react";
import NoOpenCard from "./NoOpenCard";
import PositionRow from "./PositionRow";

const fmt2 = (n?: number) =>
  Number.isFinite(n as number) ? (n as number).toFixed(2) : "—";

export default function OpenList() {
  const { items, loading } = useFilteredOpenPositions();

  const probePositions = useMemo(
    () =>
      items.map((p) => ({
        _id: p.id,
        symbol: p.symbol,
        status: p.status,
        side: p.side,
        entryPrice: p.entryPrice,
        lots: p.lots,
        volume: p.lots,
      })),
    [items]
  );

  <LiveTotalPnlBadge positions={probePositions} size="md" />;

  const total = useMemo(
    () =>
      items.reduce((s, p) => s + (Number.isFinite(p.pnlUsd) ? p.pnlUsd : 0), 0),
    [items]
  );

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-8 rounded-lg bg-neutral-800 animate-pulse" />
        <div className="h-16 rounded-lg bg-neutral-800 animate-pulse" />
        <div className="h-16 rounded-lg bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-2">
        <div className="text-center text-sm text-neutral-400">
          No open positions
        </div>
        <NoOpenCard />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 pb-1 text-sm">
        <div className="text-neutral-400">Total P/L</div>
        {items && items.length > 0 ? (
          <LiveTotalPnlBadge positions={probePositions} size="md" />
        ) : (
          <div
            className={`font-semibold ${
              total >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {(total >= 0 ? "+" : "") + fmt2(total)} USDT
          </div>
        )}
      </div>

      {items.map((p) => (
        <PositionRow key={p.id} p={p} />
      ))}
    </div>
  );
}
