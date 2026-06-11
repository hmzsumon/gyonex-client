"use client";

import { ProgressBar } from "@/components/ProgressBar";
import { RankGrid } from "@/components/rank/RankGrid";
import RankGridSkeleton from "@/components/skeletons/RankGridSkeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useGetMyRankSummaryQuery } from "@/redux/features/rank/rankApi";

export default function RankRewardPage() {
  const { data, isLoading, isError, refetch } = useGetMyRankSummaryQuery();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#070A12] text-white">
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10">
          <RankGridSkeleton />
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#070A12] text-white">
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10">
          <ErrorState
            title="Failed to load"
            subtitle="We couldn’t fetch your rank and reward data."
            retryLabel="Reload"
            onRetry={() => refetch()}
          />
        </section>
      </main>
    );
  }

  if (!data || data.ranks.length === 0) {
    return (
      <main className="min-h-screen bg-[#070A12] text-white">
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10">
          <EmptyState
            title="No ranks yet"
            subtitle="Start inviting and investing to unlock your first rank."
            actionLabel="Go to Dashboard"
            onAction={() => (window.location.href = "/dashboard")}
          />
        </section>
      </main>
    );
  }

  const overall = data.overall;

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Rank &amp; Reward
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Incentive-based program—grow referrals and investment to unlock
              rewards.
            </p>
          </div>

          <div className="w-full sm:w-80">
            <div className="mb-2 flex justify-between text-xs text-white/60">
              <span>Your overall progress</span>
              <span>
                {overall.directRef} refs • ${overall.invested} invested
              </span>
            </div>
            <ProgressBar
              value={overall.directRef + overall.invested}
              max={100 + 10000}
            />
          </div>
        </header>

        <div className="mt-6">
          <RankGrid items={data.ranks} />
        </div>
      </section>
    </main>
  );
}
