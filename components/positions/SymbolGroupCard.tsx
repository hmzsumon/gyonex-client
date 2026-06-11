// components/positions/SymbolGroupCard.tsx
"use client";

import LiveGroupPnlBadge from "@/components/ui/LiveGroupPnlBadge";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import PositionRow from "./PositionRow";

type Row = {
  _id: string;
  symbol: string;
  side: "buy" | "sell";
  volume: number;
  entryPrice: number;
  status: "open" | "closed";
  profit?: number;
  lastPrice?: number;
};

export default function SymbolGroupCard({
  symbol,
  positions,
}: {
  symbol: string;
  positions: Row[];
}) {
  const [open, setOpen] = useState(false);
  const count = positions.length;

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 px-2 py-3"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 grid place-items-center rounded-full bg-neutral-800">
              <span className="text-sm font-bold">{symbol[0]}</span>
            </div>
            <div className="text-sm font-bold tracking-wide">
              {symbol.replace("USDT", "/USD")}
            </div>
            {count > 1 && (
              <span className="ml-2 rounded-full bg-neutral-800 px-2 py-0.5 text-xs">
                {count}
              </span>
            )}
          </div>
        </div>

        <LiveGroupPnlBadge symbol={symbol} positions={positions} size="sm" />

        <span
          className="ml-2 rounded-md border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300"
          aria-hidden
        >
          {open ? <EyeOff size={14} /> : <Eye size={14} />}
        </span>
      </button>

      {count === 1 && !open && (
        <div className="px-1 pb-3">
          <PositionRow p={positions[0]} />
        </div>
      )}

      {count > 1 && open && (
        <div className="px-1 pb-3 space-y-2">
          {positions.map((p) => (
            <PositionRow key={p._id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
