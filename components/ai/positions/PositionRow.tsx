/* ────────── fixed vs live display + closed details drawer ────────── */
"use client";

import LiveClosePrice from "@/components/ui/LiveClosePrice";
import { useState } from "react";
import AiLivePnlBadge from "../AiLivePnlBadge";
import AiPnlBadge from "../AiPnlBadge"; // fixed P/L
import ClosedDetailsDrawer from "./ClosedDetailsDrawer";
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
  /* treat as closed if prop says so OR status says so */
  const isClosed = closed || p.status === "closed";

  const sideClr =
    p.side === "buy"
      ? "text-emerald-400 border-emerald-500/30"
      : "text-red-400 border-red-500/30";

  const rawPnl = p.is_loss ? p.pnlUsd : p.profit;
  const fixedPnl = Number.isFinite(rawPnl as number) ? (rawPnl as number) : 0;

  const pnlTone = fixedPnl >= 0 ? "text-emerald-400" : "text-red-400";

  /* prefer explicit closePrice then lastPrice then entry */
  const fixedClose =
    (p as any).maniClosePrice ??
    (Number.isFinite(p.maniClosePrice) ? p.lastPrice : undefined) ??
    p.entryPrice;

  const lastPx = Number.isFinite(p.lastPrice)
    ? (p.lastPrice as number)
    : p.entryPrice;

  /* ────────── drawer state (only for closed) ────────── */
  const [open, setOpen] = useState(false);

  /* clickable wrapper for closed rows */
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    isClosed ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left"
        aria-label="View closed position details"
      >
        {children}
      </button>
    ) : (
      <>{children}</>
    );

  return (
    <>
      <Wrapper>
        <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 hover:bg-neutral-900/80">
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
            <div className={`text-sm font-semibold ${pnlTone}`}>
              {isClosed ? (
                <AiPnlBadge value={fixedPnl} loading={false} size="md" />
              ) : (
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
              )}
            </div>

            {/* right-side tiny quote: closed = fixed, open = live */}
            <div className="text-[11px] text-neutral-500">
              {isClosed ? (
                <div className="min-w-[72px] text-right">
                  {fmt2(fixedClose)}
                </div>
              ) : (
                <LiveClosePrice
                  symbol={p.symbol}
                  side={p.side}
                  fallback={lastPx}
                  className="min-w-[72px] text-right"
                />
              )}
            </div>
          </div>
        </div>
      </Wrapper>

      {/* ────────── details drawer (only for closed) ────────── */}
      {isClosed && (
        <ClosedDetailsDrawer open={open} onOpenChange={setOpen} position={p} />
      )}
    </>
  );
}
