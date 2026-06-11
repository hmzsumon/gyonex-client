"use client";

import type { Position } from "@/components/ai/positions/types";
import { useSelectedAiAccount } from "@/hooks/useSelectedAiAccount";
import { useGetClosedAiPositionsQuery } from "@/redux/features/ai-account/ai-accountApi";
import { useMemo } from "react";

/* ────────── map raw -> UI Position (with closedAt) ────────── */
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
    profit: Number(p.takeProfit ?? 0),
    closePrice: Number.isFinite(p.closePrice)
      ? Number(p.closePrice)
      : undefined,
    maniClosePrice: Number.isFinite(p.manipulateClosePrice)
      ? Number(p.manipulateClosePrice)
      : undefined,
    is_loss: p.is_loss,

    stopLoss: Number.isFinite(p.stopLoss) ? Number(p.stopLoss) : undefined,
    /* ⬇️ NEW: robust closedAt mapping (adjust if your API differs) */
    closedAt:
      p.closedAt ||
      p.closeTime ||
      p.closedTime ||
      p.closed_at ||
      p.updatedAt ||
      p.createdAt ||
      null,
  };
}

/** selected account-এর plan অনুযায়ী open items + count + loading */
export function useFilteredClosedPositions() {
  const { account, loading: accountLoading } = useSelectedAiAccount();
  const { data, isLoading, isFetching } = useGetClosedAiPositionsQuery();
  // console.log({ data });

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
