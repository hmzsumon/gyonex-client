// utils/tradeMath.ts
/* ───────────────────────────────────────────
   trading math
   - positionPnl
   - symbol aggregators
─────────────────────────────────────────── */

import { num } from "./num";

export function contractSizeFor(): 1 {
  return 1;
}

export function positionPnl(params: {
  side: "buy" | "sell";
  entryPrice: number;
  closePrice: number;
  lots: number;
}): number {
  const open = num(params.entryPrice);
  const close = num(params.closePrice);
  const vol = num(params.lots);
  if (
    !Number.isFinite(open) ||
    !Number.isFinite(close) ||
    !Number.isFinite(vol)
  )
    return NaN;
  const diff = params.side === "buy" ? close - open : open - close;
  return diff * vol; // × contract size (1 for crypto)
}

export function symbolPnlSumFromBook(
  symbol: string,
  positions: Array<{
    symbol: string;
    status: "open" | "closed" | string;
    side: "buy" | "sell";
    entryPrice: number | string;
    lots?: number | string;
    volume?: number | string;
  }>,
  bid: number,
  ask: number
): number {
  if (!Number.isFinite(bid) || !Number.isFinite(ask)) return 0;
  const sym = (symbol || "").toUpperCase();
  let sum = 0;
  for (const p of positions || []) {
    if (p.status !== "open") continue;
    if ((p.symbol || "").toUpperCase() !== sym) continue;
    const lots = num(p.lots ?? p.volume ?? 0);
    const entry = num(p.entryPrice);
    const closePx = p.side === "buy" ? bid : ask;
    const v = positionPnl({
      side: p.side,
      entryPrice: entry,
      closePrice: closePx,
      lots,
    });
    if (Number.isFinite(v)) sum += v;
  }
  return sum;
}

export function symbolPnlSumWithSingleClose(
  symbol: string,
  positions: Array<{
    symbol: string;
    status: "open" | "closed" | string;
    side: "buy" | "sell";
    entryPrice: number | string;
    lots?: number | string;
    volume?: number | string;
  }>,
  closePrice: number
): number {
  if (!Number.isFinite(closePrice)) return 0;
  const sym = (symbol || "").toUpperCase();
  let sum = 0;
  for (const p of positions || []) {
    if (p.status !== "open") continue;
    if ((p.symbol || "").toUpperCase() !== sym) continue;
    const lots = num(p.lots ?? p.volume ?? 0);
    const entry = num(p.entryPrice);
    const v = positionPnl({
      side: p.side,
      entryPrice: entry,
      closePrice,
      lots,
    });
    if (Number.isFinite(v)) sum += v;
  }
  return sum;
}
