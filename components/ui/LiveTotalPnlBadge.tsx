// components/ui/LiveTotalPnlBadge.tsx
/* ───────────────────────────────────────────
   total live P/L across all open positions
   - groups by symbol
   - uses LiveGroupPnlProbe per symbol
   - renders a unified PnlBadge
─────────────────────────────────────────── */


"use client";

import LiveGroupPnlProbe from "@/components/ui/LiveGroupPnlProbe";
import PnlBadge from "@/components/ui/PnlBadge";
import { useEffect, useMemo, useState } from "react";

type Row = {
  _id: string;
  symbol: string;
  status: "open" | "closed";
  side: "buy" | "sell";
  entryPrice: number | string;
  lots?: number | string;
  volume?: number | string;
};

export default function LiveTotalPnlBadge({
  positions,
  className = "",
  size = "md",
}: {
  positions: Row[];
  className?: string;
  size?: "sm" | "md";
}) {
  const open = useMemo(
    () => positions.filter((p) => p.status === "open"),
    [positions]
  );

  const bySymbol = useMemo(() => {
    const g: Record<string, Row[]> = {};
    for (const p of open) {
      const k = (p.symbol || "").toUpperCase();
      (g[k] ||= []).push(p);
    }
    return g;
  }, [open]);

  const symbols = useMemo(() => Object.keys(bySymbol).sort(), [bySymbol]);

  const [map, setMap] = useState<Record<string, number>>({});

  const handleChange = (symbol: string, value: number) => {
    setMap((m) => (m[symbol] === value ? m : { ...m, [symbol]: value }));
  };

  useEffect(() => {
    const next: Record<string, number> = {};
    for (const s of symbols) next[s] = map[s] ?? NaN; // start as loading
    setMap(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join("|")]);

  const loading = useMemo(
    () => symbols.length > 0 && symbols.some((s) => !Number.isFinite(map[s])),
    [symbols, map]
  );

  const total = useMemo(
    () =>
      Object.values(map).reduce(
        (a, b) => a + (Number.isFinite(b) ? (b as number) : 0),
        0
      ),
    [map]
  );

  return (
    <>
      {symbols.map((s) => (
        <LiveGroupPnlProbe
          key={s}
          symbol={s}
          positions={bySymbol[s]}
          onChange={handleChange}
        />
      ))}
      <PnlBadge
        value={total}
        loading={loading}
        size={size}
        className={className}
      />
    </>
  );
}
