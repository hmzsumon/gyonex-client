// app/auth/positions/page.tsx
"use client";

import EmptyPositions from "@/components/positions/EmptyPositions";
import PositionsHeader from "@/components/positions/PositionsHeader";
import SymbolGroupCard from "@/components/positions/SymbolGroupCard";
import { useSelectedAccount } from "@/hooks/useSelectedAccount";
import { useListPositionsQuery } from "@/redux/features/trade/tradeApi";
import { num } from "@/utils/num";
import { useMemo } from "react";

export default function PositionsPage() {
  const { account } = useSelectedAccount();
  const accountId: string | undefined = account?._id;

  const { data, isLoading } = useListPositionsQuery(
    { accountId: accountId! },
    { skip: !accountId }
  );

  const items = useMemo(
    () =>
      (data?.items ?? []).map((p) => ({
        ...p,
        volume: num((p as any).volume ?? (p as any).lots ?? 0),
        entryPrice: num((p as any).entryPrice ?? (p as any).price ?? 0),
      })),
    [data]
  );

  const openItems = useMemo(
    () => items.filter((p) => p.status === "open"),
    [items]
  );

  const groups = useMemo(() => {
    const g: Record<string, typeof items> = {};
    for (const p of openItems) {
      const k = (p.symbol || "").toUpperCase();
      (g[k] ||= []).push(p);
    }
    return Object.entries(g)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([symbol, positions]) => ({ symbol, positions }));
  }, [openItems]);

  const totalPLFallback = useMemo(() => {
    let s = 0;
    for (const p of openItems) {
      const v = num((p as any).profit);
      if (Number.isFinite(v)) s += v;
    }
    return s;
  }, [openItems]);

  return (
    <div className="mx-auto max-w-3xl py-4 md:py-6">
      <div className="space-y-2">
        <PositionsHeader
          totalPL={totalPLFallback}
          loading={isLoading}
          positions={openItems as any}
        />
      </div>

      {!isLoading && groups.length === 0 && <EmptyPositions />}

      <div className="mt-3 space-y-2">
        {groups.map((g) => (
          <SymbolGroupCard
            key={g.symbol}
            symbol={g.symbol}
            positions={g.positions as any}
          />
        ))}
      </div>
    </div>
  );
}
