// components/trade/parts/PositionsStrip.tsx
/* ───────────────────────────────────────────
   symbol strip with counts and live pnl
─────────────────────────────────────────── */

"use client";

import LiveGroupPnlBadge from "@/components/ui/LiveGroupPnlBadge";
import { useSymbolStripMetrics } from "@/hooks/useSymbolStripMetrics";
import { useListPositionsQuery } from "@/redux/features/trade/tradeApi";
import Link from "next/link";

type Props = {
  accountId?: string;
  symbol: string;
  onOpenList: () => void;
  onCloseClick: (posId?: string) => void;
};

export default function PositionsStrip({
  accountId,
  symbol,
  onOpenList,
  onCloseClick,
}: Props) {
  const { data } = useListPositionsQuery(
    { accountId: accountId! },
    { skip: !accountId }
  );

  const items = data?.items ?? [];
  const { openCount, pendingCount, pnl, lastOpenId } = useSymbolStripMetrics({
    symbol,
    positions: items,
  });

  return (
    <div className="text-xs">
      <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/accounts" className="font-medium">
              <button className="py-1.5 rounded-lg px-2 bg-neutral-800 text-xs">
                Open <b className="ml-1">{openCount}</b>
              </button>
            </Link>
            <button className="px-2 py-1.5 rounded-lg bg-neutral-800 text-xs opacity-80">
              Closed <b className="ml-1">{pendingCount}</b>
            </button>
          </div>

          <LiveGroupPnlBadge
            symbol={symbol}
            positions={items as any}
            className=""
            size="sm"
          />

          <button
            onClick={() => onCloseClick(lastOpenId)}
            className="px-1.5 py-1 rounded bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700 ml-2"
            title="Close position"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
