"use client";

import { useGetDashboardQuery } from "@/redux/features/auth/authApi";
import type { Activity } from "@/types/dashboard";
import Link from "next/link";
import { RecentActivityItem } from "./RecentActivityItem";
import { SectionCard } from "./SectionCard";

/* ── tiny utils ──────────────────────────────────────────────────────────── */
const toAmt = (n: unknown) => {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? Number(v.toFixed(2)) : 0;
};

const Activities = () => {
  const { data, isLoading, isError } = useGetDashboardQuery(undefined);
  const wallet = data?.walletData ?? {};
  const {
    totalDeposit,
    totalWithdraw,
    totalAiTradeProfit,
    totalAiTradeCommission,
    totalLiveTradeProfit,
    totalLiveTradeCommission,
    totalTransferToTrade,
    totalTransferToWallet,
    totalReceive,
    totalSend,
    totalReferralBonus,
    rankEarning,
  } = wallet as Record<string, unknown>;

  /* ── activities from API ──────────────────────────────────────────────── */
  const aiActivities: Activity[] = [
    {
      id: "ai_profit",
      title: "Smart Trade Profit",
      amount: toAmt(totalAiTradeProfit),
      currency: "USDT",
    },
    {
      id: "ai_comm",
      title: "Smart Trade Roi",
      amount: toAmt(totalAiTradeCommission),
      currency: "USDT",
    },
  ];

  const liveTradeActivities: Activity[] = [
    {
      id: "lv_profit",
      title: "Live Trade Profit",
      amount: toAmt(totalLiveTradeProfit),
      currency: "USDT",
    },
    {
      id: "lv_comm",
      title: "Live Trade Roi",
      amount: toAmt(totalLiveTradeCommission),
      currency: "USDT",
    },
  ];

  const transferActivities: Activity[] = [
    {
      id: "t2trade",
      title: "Transfer to Trade",
      amount: toAmt(totalTransferToTrade),
      currency: "USDT",
    },
    {
      id: "t2wallet",
      title: "Transfer to Wallet",
      amount: toAmt(totalTransferToWallet),
      currency: "USDT",
    },
  ];

  const p2pActivities: Activity[] = [
    {
      id: "recv",
      title: "Total Received",
      amount: toAmt(totalReceive),
      currency: "USDT",
    },
    {
      id: "send",
      title: "Total Sent",
      amount: toAmt(totalSend),
      currency: "USDT",
    },
  ];

  const bonusActivities: Activity[] = [
    {
      id: "ref_bonus",
      title: "Referral Bonus",
      amount: toAmt(totalReferralBonus),
      currency: "USDT",
    },
    {
      id: "rank_reward",
      title: "Rank Reward",
      amount: toAmt(rankEarning),
      currency: "USDT",
    },
  ];
  return (
    <div>
      {/* ── Ai Trade activity ───────────────────────────────────────────── */}
      <SectionCard title="Smart Trade activity">
        <div className="space-y-3">
          {aiActivities.map((a) => (
            <RecentActivityItem key={a.id} activity={a} isLoading={isLoading} />
          ))}
        </div>
      </SectionCard>

      {/* ── Live Trade activity ─────────────────────────────────────────── */}
      <SectionCard title="Live Trade activity">
        <div className="space-y-3">
          {liveTradeActivities.map((a) => (
            <RecentActivityItem key={a.id} activity={a} isLoading={isLoading} />
          ))}
        </div>
      </SectionCard>

      {/* ── Transfer activity ───────────────────────────────────────────── */}
      <SectionCard title="Transfer activity">
        <div className="space-y-3">
          {transferActivities.map((a) => (
            <RecentActivityItem key={a.id} activity={a} isLoading={isLoading} />
          ))}
        </div>
      </SectionCard>

      {/* ── P2P activity ───────────────────────────────────────────────── */}
      <SectionCard title="P2P activity">
        <div className="space-y-3">
          {p2pActivities.map((a) => (
            <RecentActivityItem key={a.id} activity={a} isLoading={isLoading} />
          ))}
        </div>
      </SectionCard>

      {/* ── Bonus activity ──────────────────────────────────────────────── */}
      <SectionCard title="Bonus activity">
        <div className="space-y-3">
          {bonusActivities.map((a) => (
            <RecentActivityItem key={a.id} activity={a} isLoading={isLoading} />
          ))}
        </div>
        <Link href="/agent-zone/referral" className=" ">
          <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 py-3 text-center text-base font-semibold text-neutral-950 hover:opacity-90">
            Invite friends & Earn
          </button>
        </Link>
      </SectionCard>

      {isError ? (
        <p className="mt-6 text-center text-sm text-red-400">
          Failed to load dashboard data. Showing zeros.
        </p>
      ) : null}
    </div>
  );
};

export default Activities;
