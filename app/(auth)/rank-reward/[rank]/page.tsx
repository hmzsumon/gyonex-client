"use client";

import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState, ErrorState, InlineLoader } from "@/components/ui/States";
import {
  useClaimRankMutation,
  useGetMyRankSummaryQuery,
} from "@/redux/features/rank/rankApi";
import type { RankKey } from "@/types/rank";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function RankDetails({ params }: { params: { rank: RankKey } }) {
  const { data, isLoading, isError, refetch } = useGetMyRankSummaryQuery();
  const [claim, { isLoading: claiming }] = useClaimRankMutation();
  const [msg, setMsg] = useState<string | null>(null);

  const item = useMemo(
    () => data?.ranks.find((r) => r.key === params.rank),
    [data, params.rank]
  );
  useEffect(() => setMsg(null), [params.rank]);

  if (isLoading) return <InlineLoader label="Loading rank details…" />;
  if (isError)
    return (
      <ErrorState
        title="Failed to load"
        subtitle="Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  if (!data)
    return (
      <ErrorState
        title="Missing data"
        subtitle="No response received from server."
        onRetry={() => refetch()}
      />
    );
  if (!item)
    return (
      <EmptyState
        title="Rank not found"
        subtitle="The requested rank does not exist."
      />
    );

  const directLeft = Math.max(
    0,
    item.directRefTarget - item.progress.directRef
  );
  const investLeft = Math.max(0, item.minInvestTarget - item.progress.invested);

  async function onClaim() {
    setMsg(null);
    if (!item) {
      setMsg("Rank not found");
      return;
    }
    try {
      const res = await claim({ key: item.key }).unwrap();
      setMsg(res.message ?? `Reward $${item.rewardUsd} claimed`);
      await refetch();
    } catch (e: any) {
      setMsg(e?.data?.message ?? "Failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
        <Link
          href="/rank-reward"
          className="text-sm text-blue-400 hover:underline"
        >
          ← Back to all ranks
        </Link>

        <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0C1222] to-[#0B0F1A] p-6">
          <h1 className="text-2xl font-bold capitalize">{item.title} Rank</h1>
          <p className="mt-1 text-white/70">
            {item.qualified
              ? item.claimed
                ? "Already claimed."
                : "You are qualified — claim your reward."
              : "Keep going to qualify for this rank."}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex justify-between text-xs text-white/60">
                <span>Direct Referrals</span>
                <span>
                  {item.progress.directRef}/{item.directRefTarget}
                </span>
              </div>
              <ProgressBar
                value={item.progress.directRef}
                max={item.directRefTarget}
              />
              <p className="mt-2 text-xs text-white/60">
                {directLeft === 0
                  ? "Target met 🎉"
                  : `${directLeft} more referrals needed`}
              </p>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs text-white/60">
                <span>Minimum Investment</span>
                <span>
                  ${item.progress.invested}/{item.minInvestTarget}
                </span>
              </div>
              <ProgressBar
                value={item.progress.invested}
                max={item.minInvestTarget}
              />
              <p className="mt-2 text-xs text-white/60">
                {investLeft === 0
                  ? "Target met 🎉"
                  : `$${investLeft} more to invest`}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/70">
              Reward on completion:{" "}
              <span className="font-semibold text-white">
                ${item.rewardUsd}
              </span>
            </div>

            <button
              onClick={onClaim}
              disabled={!item.qualified || item.claimed || claiming}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r
                         from-blue-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claiming
                ? "Processing…"
                : item.claimed
                ? "Claimed"
                : item.qualified
                ? "Get Reward"
                : "Not Qualified"}
            </button>
          </div>

          {msg && <p className="mt-3 text-sm text-white/80">{msg}</p>}
          {item.claimedAt && (
            <p className="mt-1 text-xs text-white/60">
              Claimed at: {new Date(item.claimedAt).toLocaleString()}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
