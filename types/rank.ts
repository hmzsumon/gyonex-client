/* ────────── comments ────────── */
/* Matches backend RankSummaryResponse from your service/controller. */
/* ────────── comments ────────── */
export type RankKey =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "emerald"
  | "grandmaster";

export interface RankProgress {
  directRef: number;
  invested: number;
  directPct: number;
  investPct: number;
  overall: number;
}

export interface RankSummaryItem {
  key: RankKey;
  title: string;
  directRefTarget: number;
  minInvestTarget: number;
  rewardUsd: number;
  progress: RankProgress;
  qualified: boolean;
  claimed: boolean;
  achievedAt?: string;
  claimedAt?: string;
}

export interface RankSummaryResponse {
  overall: { directRef: number; invested: number };
  ranks: RankSummaryItem[];
}
