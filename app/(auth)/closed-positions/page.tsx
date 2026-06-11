"use client";

import ClosedDayGroup from "@/components/positions/ClosedDayGroup";
import ClosedDetailDrawer from "@/components/positions/ClosedDetailDrawer";
import { useSelectedAccount } from "@/hooks/useSelectedAccount";
import {
  useGetClosePositionsQuery,
  useGetPositionQuery,
} from "@/redux/features/trade/tradeApi";
import { num } from "@/utils/num";
import { useMemo, useState } from "react";

export default function ClosedPositionsPage() {
  const { account } = useSelectedAccount();
  const accountId: string | undefined = account?._id;

  const { data, isLoading } = useGetClosePositionsQuery(
    { accountId: accountId!, status: "closed", limit: 500 },
    { skip: !accountId }
  );

  // normalize to UI shape (lots, openedAt/closedAt as Date, numbers safe)
  const items = useMemo(
    () =>
      (data?.items ?? []).map((p: any) => ({
        _id: String(p._id),
        symbol: String(p.symbol),
        side: p.side as "buy" | "sell",
        status: p.status as "closed" | "open",
        lots: num(p.lots ?? 0),
        entryPrice: num(p.entryPrice ?? 0),
        closePrice: num(p.closePrice ?? 0),
        openedAt: p.openedAt ? new Date(p.openedAt) : null,
        closedAt: p.closedAt ? new Date(p.closedAt) : null,
        pnl: num(p.pnl ?? 0),
        commissionClose: num(p.commissionClose ?? 0),
        takeProfit: num(p.takeProfit),
        stopLoss: num(p.stopLoss),
      })),
    [data]
  );

  // group by calendar day of closedAt (desc)
  const groups = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const p of items) {
      const key = p.closedAt
        ? new Date(p.closedAt.toDateString()).toISOString()
        : "unknown";
      (m.get(key) ?? m.set(key, []).get(key)!).push(p);
    }
    return Array.from(m.entries())
      .sort(([a], [b]) => (a > b ? -1 : 1))
      .map(([k, arr]) => ({ day: new Date(k), items: arr }));
  }, [items]);

  const [openId, setOpenId] = useState<string | null>(null);
  const detailQ = useGetPositionQuery({ id: openId! }, { skip: !openId });
  const detail = detailQ.data?.item;

  return (
    <div className="mx-auto max-w-3xl py-4 md:py-6">
      <h1 className="text-2xl font-extrabold mb-2">
        <span className="text-neutral-400">Closed</span> Positions
      </h1>

      {isLoading && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm">
          Loading…
        </div>
      )}

      {!isLoading && groups.length === 0 && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 text-center text-neutral-400">
          No closed positions
        </div>
      )}

      <div className="space-y-3">
        {groups.map((g) => (
          <div
            key={g.day.toISOString()}
            className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-3"
          >
            <ClosedDayGroup
              day={g.day}
              items={g.items}
              onPick={(id) => setOpenId(id)}
            />
          </div>
        ))}
      </div>

      <ClosedDetailDrawer
        open={!!openId && !!detail}
        onClose={() => setOpenId(null)}
        item={detail}
      />
    </div>
  );
}
