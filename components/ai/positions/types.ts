export type Side = "buy" | "sell";

export type Position = {
  id: string;
  symbol: string; // e.g. "BTC"
  side: Side; // "buy"|"sell"
  lots: number; // e.g. 1.00
  entryPrice: number; // e.g. 122435.86
  lastPrice?: number; // (open tab right-side tiny quote)
  closePrice?: number; // (closed tab right-side tiny quote)
  pnlUsd: number; // +/- in USD
  tag?: "TP" | "SL" | null;
  closedAt?: string; // ISO date (grouping for Closed)
  s: string;
  status: "open" | "closed";
  profit: number;
  maniClosePrice?: number;
  is_loss: boolean;
  stopLoss?: number;
};
