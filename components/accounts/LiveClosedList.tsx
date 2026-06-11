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
import { Position } from "./types";

function groupClosedByDay(list: Position[]) {
  const map = new Map<string, Position[]>();
  for (const p of list) {
    const key = p.closedAt ? new Date(p.closedAt).toDateString() : "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries()).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
}

export default function ClosedList() {
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
    <div className="space-y-3">
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
