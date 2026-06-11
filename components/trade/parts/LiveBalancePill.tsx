// components/trade/parts/LiveBalancePill.tsx
/* ───────────────────────────────────────────
   live equity pill
   - equity = base balance + live total P/L
   - uses per-symbol probes (no hooks-in-loop)
─────────────────────────────────────────── */

"use client";

import LiveGroupPnlProbe from "@/components/ui/LiveGroupPnlProbe";
import { fmt, num } from "@/utils/num";
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

export default function LiveBalancePill({
  account,
  positions,
}: {
  account?: { mode?: "demo" | "real" | string; balance?: number };
  positions: Row[];
}) {
  const label = (account?.mode === "demo" ? "Demo" : "Real") as string;
  const baseBalance = num(account?.balance ?? 0);

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

  const [pnlMap, setPnlMap] = useState<Record<string, number>>({});

  const onProbe = (symbol: string, value: number) => {
    setPnlMap((m) => (m[symbol] === value ? m : { ...m, [symbol]: value }));
  };

  useEffect(() => {
    const seeded: Record<string, number> = {};
    for (const s of symbols) seeded[s] = pnlMap[s] ?? NaN;
    setPnlMap(seeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join("|")]);

  const loading = useMemo(
    () =>
      symbols.length > 0 && symbols.some((s) => !Number.isFinite(pnlMap[s])),
    [symbols, pnlMap]
  );

  const totalLivePnl = useMemo(
    () =>
      Object.values(pnlMap).reduce(
        (acc, v) => acc + (Number.isFinite(v) ? v : 0),
        0
      ),
    [pnlMap]
  );

  const equity = baseBalance + totalLivePnl;

  return (
    <>
      {symbols.map((s) => (
        <LiveGroupPnlProbe
          key={s}
          symbol={s}
          positions={bySymbol[s]}
          onChange={onProbe}
        />
      ))}

      <div className="flex items-center justify-between gap-2 px-4 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 shadow-md">
        <span className="px-2 py-0.5 rounded-full bg-green-700/40 text-green-300 text-xs">
          {label}
        </span>

        {loading ? (
          <span className="flex items-center gap-2 text-neutral-300">
            <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span className="font-medium opacity-80">live</span>
          </span>
        ) : (
          <span className="font-semibold">{fmt(equity, 2)} USDT</span>
        )}
      </div>
    </>
  );
}
