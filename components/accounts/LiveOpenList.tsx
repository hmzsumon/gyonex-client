"use client";

import { useSelectedAccount } from "@/hooks/useSelectedAccount";
import { useListPositionsQuery } from "@/redux/features/trade/tradeApi";
import { num } from "@/utils/num";
import { useMemo } from "react";
import NoOpenCard from "../ai/positions/NoOpenCard";
import LiveTotalPnlBadge from "../ui/LiveTotalPnlBadge";
import LivePositionRow from "./LivePositionRow";

const fmt2 = (n?: number) =>
  Number.isFinite(n as number) ? (n as number).toFixed(2) : "—";

export default function OpenList() {
  const { account } = useSelectedAccount();
  const accountId: string | undefined = account?._id;

  const { data, isLoading } = useListPositionsQuery(
    { accountId: accountId! },
    { skip: !accountId }
  );

  // normalize
  const items = useMemo(
    () =>
      (data?.items ?? []).map((p: any) => ({
        ...p,
        volume: num(p.volume ?? p.lots ?? 0),
        entryPrice: num(p.entryPrice ?? p.price ?? 0),
        status: p.status ?? "open",
      })),
    [data]
  );

  // only OPEN positions
  const openItems = useMemo(
    () => items.filter((p: any) => p.status === "open"),
    [items]
  );

  // optional: total P/L over OPEN only (fallback if server sends profit)
  const total = useMemo(() => {
    let s = 0;
    for (const p of openItems) {
      const v = num((p as any).profit);
      if (Number.isFinite(v)) s += v;
    }
    return s;
  }, [openItems]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-8 rounded-lg bg-neutral-800 animate-pulse" />
        <div className="h-16 rounded-lg bg-neutral-800 animate-pulse" />
        <div className="h-16 rounded-lg bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (openItems.length === 0) {
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
          <LiveTotalPnlBadge positions={items} size="md" />
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

      {openItems.map((p: any) => (
        <LivePositionRow key={p._id} p={p} />
      ))}
    </div>
  );
}
