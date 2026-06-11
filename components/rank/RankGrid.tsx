/* ────────── comments ────────── */
/* Grid that consumes live RankSummaryResponse and renders cards. */
/* ────────── comments ────────── */
"use client";

import type { RankSummaryItem } from "@/types/rank";
import { RankCard, type RankCardInput } from "./RankCard";

function rankColor(key: string) {
  switch (key) {
    case "bronze":
      return "from-orange-500 to-amber-600";
    case "silver":
      return "from-slate-400 to-slate-500";
    case "gold":
      return "from-yellow-500 to-amber-500";
    case "platinum":
      return "from-indigo-500 to-purple-600";
    case "diamond":
      return "from-cyan-500 to-blue-600";
    case "emerald":
      return "from-emerald-500 to-teal-600";
    case "grandmaster":
      return "from-fuchsia-500 to-violet-600";
    default:
      return "from-blue-600 to-indigo-600";
  }
}

export function RankGrid({ items }: { items: RankSummaryItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((r) => {
        const rank: RankCardInput = {
          key: r.key,
          title: r.title,
          directRefTarget: r.directRefTarget,
          minInvestTarget: r.minInvestTarget,
          rewardUsd: r.rewardUsd,
          blurb: r.qualified
            ? "Qualified — claim your reward."
            : "Keep progressing to unlock this tier.",
          color: rankColor(r.key),
        };
        return (
          <RankCard
            key={r.key}
            rank={rank}
            progress={{
              directRef: r.progress.directRef,
              invested: r.progress.invested,
            }}
          />
        );
      })}
    </div>
  );
}
