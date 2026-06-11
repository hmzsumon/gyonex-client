"use client";

import type { Position } from "@/components/ai/positions/types";
import { useSelectedAiAccount } from "@/hooks/useSelectedAiAccount";
import { useGetAllAiPositionsQuery } from "@/redux/features/ai-account/ai-accountApi";
import { useMemo } from "react";

function toUiPosition(p: any): Position {
  const sym = String(p.symbol || "")
    .toUpperCase()
    .replace(/USDT$/, "")
    .replace(/USD$/, "");
  return {
    id: String(p._id),
    s: sym || "--",
    symbol: p.symbol,
    side: (p.side || "buy") as "buy" | "sell",
    lots: Number(p.lots ?? 0),
    entryPrice: Number(p.entryPrice ?? NaN),
    lastPrice: Number.isFinite(p.lastPrice) ? Number(p.lastPrice) : undefined,
    pnlUsd: Number(p.unrealizedPnl ?? p.pnl ?? 0),
    tag: p.takeProfit ? "TP" : null,
    status: p.status || "open",
    profit: Number(p.profit ?? 0),
    is_loss: p.is_loss,
  };
}

/** selected account-এর plan অনুযায়ী open items + count + loading */
export function useFilteredOpenPositions() {
  const { account, loading: accountLoading } = useSelectedAiAccount();
  const { data, isLoading, isFetching } = useGetAllAiPositionsQuery();

  const items: Position[] = useMemo(() => {
    if (!account) return [];
    const raw: any[] = (data?.items ?? []) as any[];
    const plan = String(account.plan || "").toLowerCase();
    return raw
      .filter((p) => String(p.plan || "").toLowerCase() === plan)
      .map(toUiPosition);
  }, [data?.items, account]);

  const loading = accountLoading || isLoading || isFetching;
  return { items, count: items.length, loading };
}
