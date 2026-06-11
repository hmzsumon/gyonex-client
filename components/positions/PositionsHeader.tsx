// components/positions/PositionsHeader.tsx
"use client";

import LiveTotalPnlBadge from "@/components/ui/LiveTotalPnlBadge";
import { fmt } from "@/utils/num";

type Row = {
  _id: string;
  symbol: string;
  status: "open" | "closed";
  side: "buy" | "sell";
  entryPrice: number | string;
  lots?: number | string;
  volume?: number | string;
  profit?: number;
};

export default function PositionsHeader({
  totalPL,
  loading,
  positions,
}: {
  totalPL: number;
  loading?: boolean;
  positions?: Row[];
}) {
  return (
    <div className="mb-2">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-extrabold">
          <span className="text-neutral-400">Positions</span>
        </h1>

        <div className="rounded-lg border border-neutral-800">
          {positions && positions.length > 0 ? (
            <LiveTotalPnlBadge positions={positions} size="md" />
          ) : (
            <div
              className={[
                "px-3 py-1.5 text-sm font-semibold rounded-lg",
                totalPL >= 0
                  ? "bg-green-600/15 text-green-400"
                  : "bg-red-600/15 text-red-400",
              ].join(" ")}
              title="Total P/L (open)"
            >
              {loading
                ? "…"
                : (totalPL >= 0 ? "+" : "") + fmt(totalPL, 2) + " USD"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
