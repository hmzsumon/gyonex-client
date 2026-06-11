/* ────────── comments ────────── */
/* Rank card taking live progress via props. */
/* ────────── comments ────────── */
"use client";

import { ProgressBar } from "@/components/ProgressBar";
import { type RankKey } from "@/types/rank";
import {
  BadgeCheck,
  Crown,
  Gem,
  Leaf,
  Medal,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

export type RankCardInput = {
  key: RankKey;
  title: string;
  directRefTarget: number;
  minInvestTarget: number;
  rewardUsd: number;
  blurb: string;
  color: string;
};

const RankIcon: Record<RankKey, LucideIcon> = {
  bronze: Medal,
  silver: BadgeCheck,
  gold: Trophy,
  platinum: Crown,
  diamond: Gem,
  emerald: Leaf,
  grandmaster: Star,
};

export function RankCard({
  rank,
  progress, // live numbers from API
}: {
  rank: RankCardInput;
  progress: { directRef: number; invested: number };
}) {
  const Icon = RankIcon[rank.key];

  const directPct = Math.min(1, progress.directRef / rank.directRefTarget);
  const investPct = Math.min(1, progress.invested / rank.minInvestTarget);
  const overall = Math.round((directPct * 0.5 + investPct * 0.5) * 100);

  return (
    <div className="relative rounded-2xl border border-white/12 bg-gradient-to-br from-[#0B0F19] to-[#0A0D16] p-5 shadow-[0_1px_10px_rgba(0,0,0,0.18)] transition-[box-shadow,transform,opacity] duration-200 ease-out hover:shadow-[0_4px_18px_rgba(0,0,0,0.22)] hover:translate-y-[-1px] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr ${rank.color}`}
        style={{ opacity: 0.08 }}
        aria-hidden
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr ${rank.color} text-white/95 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`}
            >
              <Icon size={18} />
            </div>
            <h3 className="text-base font-semibold text-white">{rank.title}</h3>
          </div>
          <span className="text-[11px] tracking-wide text-white/65">
            Reward ${rank.rewardUsd}
          </span>
        </div>

        <p className="mt-2 text-[13px] leading-5 text-white/75">{rank.blurb}</p>

        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-white/60">
              <span>Direct Referrals</span>
              <span>
                {progress.directRef}/{rank.directRefTarget}
              </span>
            </div>
            <ProgressBar
              value={progress.directRef}
              max={rank.directRefTarget}
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between text-[11px] text-white/60">
              <span>Minimum Investment</span>
              <span>
                ${progress.invested}/{rank.minInvestTarget}
              </span>
            </div>
            <ProgressBar value={progress.invested} max={rank.minInvestTarget} />
          </div>

          <div className="text-[11px] text-white/65">
            Overall Progress: <span className="text-white">{overall}%</span>
          </div>
        </div>

        <Link
          href={`/rank-reward/${rank.key}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] focus:outline-none focus:ring-2 focus:ring-blue-500/35"
        >
          Details
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="ml-1 fill-current"
          >
            <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
