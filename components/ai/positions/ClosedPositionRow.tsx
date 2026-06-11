"use client";

import LiveClosePrice from "@/components/ui/LiveClosePrice";
import AiLivePnlBadge from "../AiLivePnlBadge";
import { Position } from "./types";

function fmt2(n?: number) {
  return Number.isFinite(n as number) ? (n as number).toFixed(2) : "—";
}

export default function PositionRow({
  p,
  closed,
}: {
  p: Position;
  closed?: boolean;
}) {
  const sideClr =
    p.side === "buy"
      ? "text-emerald-400 border-emerald-500/30"
      : "text-red-400 border-red-500/30";
  const pnlClr = p.pnlUsd >= 0 ? "text-emerald-400" : "text-red-400";

  const lastPx = Number.isFinite(p.lastPrice)
    ? (p.lastPrice as number)
    : p.entryPrice;

  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-200">
            <span>{p.s}</span>
            {p.tag ? (
              <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300 border border-neutral-700">
                {p.tag}
              </span>
            ) : null}
          </div>

          <div className="text-xs text-neutral-400">
            <span
              className={`mr-1 rounded px-1.5 py-0.5 text-[10px] border ${sideClr}`}
            >
              {p.side.toUpperCase()}
            </span>{" "}
            {p.lots.toFixed(2)} lot at {fmt2(p.entryPrice)}
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className={`text-sm font-semibold ${pnlClr}`}>
          <AiLivePnlBadge
            position={{
              _id: p.id,
              symbol: p.symbol,
              side: p.side,
              entryPrice: p.entryPrice,
              lots: p.lots,
              profit: p.profit,
              lastPrice: p.lastPrice,
              status: p.status,
            }}
            size="md"
          />
        </div>

        {/* 👉 Right-side tiny quote: open = lastPrice, closed = closePrice */}
        <div className="text-[11px] text-neutral-500">
          {/* live close price small gray */}
          <LiveClosePrice
            symbol={p.symbol}
            side={p.side}
            fallback={lastPx}
            className="min-w-[72px] text-right"
          />
        </div>
      </div>
    </div>
  );
}
