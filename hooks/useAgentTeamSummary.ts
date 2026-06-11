// hooks/useAgentTeamSummary.ts
"use client";

import { useGetMyTeamQuery } from "@/redux/features/auth/authApi";
import { useMemo } from "react";

/* ────────── Types ────────── */
export type TeamLevel = {
  title: string;
  users: string[]; // user ids
  deposit: number;
  activeDeposit: number;
  withdraw: number;
  aiTradeBalance: number;
  liveTradeBalance: number;
  inactiveUsers: string[];
  aiTradeCommission: number;
  liveTradeCommission: number;
  usersCount: number;
  activeUsers: number;
};

export type TeamSummary = {
  _id: string;
  userId: string;
  customerId: string;
  title: string;
  totalTeamMember: number;
  teamActiveMember: number;
  totalTeamDeposit: number;
  totalTeamWithdraw: number;
  totalTeamActiveDeposit: number;
  totalReferralBonus: number;
  todayTeamCommission: number;
  yesterdayTeamCommission: number;
  thisMonthCommission: number;
  thisMonthSales: number;
  lastMonthSales: number;
  teamTotalAiTradeBalance: number;
  teamTotalLiveTradeBalance: number;
  teamTotalAiTradeCommission: number;
  level_1: TeamLevel;
  level_2: TeamLevel;
  level_3: TeamLevel;
  level_4: TeamLevel;
  level_5: TeamLevel;
  level_6: TeamLevel;
  level_7: TeamLevel;
  level_8: TeamLevel;
  level_9: TeamLevel;
  level_10: TeamLevel;
};

export type Range = "yesterday" | "lastWeek" | "thisMonth" | "lastMonth";

/* ────────── Helpers ────────── */
const fmt = (n?: number) =>
  (Number.isFinite(n as number) ? (n as number) : 0).toFixed(2);

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/* ────────── Hook ────────── */
export function useAgentTeamSummary() {
  const { data, isLoading, isFetching, isError, error } = useGetMyTeamQuery({});
  const team = data?.team as TeamSummary | undefined;

  // Levels with meta (fixes TS error and helps UI)
  const levels = useMemo(() => {
    if (!team)
      return [] as Array<
        TeamLevel & { level: number; ordinalLabel: string; userCount: number }
      >;

    const arr = [
      team.level_1,
      team.level_2,
      team.level_3,
      team.level_4,
      team.level_5,
    ];

    return arr
      .map((lvl, idx) => {
        if (!lvl) return null;
        const level = idx + 1;
        return {
          ...lvl,
          level,
          ordinalLabel: ordinal(level), // "1st", "2nd", ...
          userCount: Array.isArray(lvl.users) ? lvl.users.length : 0,
        };
      })
      .filter(Boolean) as Array<
      TeamLevel & { level: number; ordinalLabel: string; userCount: number }
    >;
  }, [team]);

  // KPIs
  const kpis = useMemo(() => {
    return {
      countOfReferring: team?.totalTeamMember ?? 0,
      totalReferralIncome: team?.totalReferralBonus ?? 0,
      level1AiTradeBalance: team?.level_1?.aiTradeBalance ?? 0,
      level1LiveTradeBalance: team?.level_1?.liveTradeBalance ?? 0,
    };
  }, [team]);

  const getMetricsByRange = (range: Range) => {
    switch (range) {
      case "yesterday":
        return {
          deposit: team?.totalTeamDeposit ?? 0,
          withdraw: team?.totalTeamWithdraw ?? 0,
          netDeposit: team?.teamTotalAiTradeBalance ?? 0,
          aiTradeRoi: team?.teamTotalAiTradeCommission ?? 0,
          volume: team?.thisMonthSales ?? 0,
        };
      case "thisMonth":
        return {
          deposit: team?.totalTeamDeposit ?? 0,
          withdraw: team?.totalTeamWithdraw ?? 0,
          netDeposit:
            (team?.totalTeamDeposit ?? 0) - (team?.totalTeamWithdraw ?? 0),
          aiTradeRoi: team?.thisMonthCommission ?? 0,
          volume: team?.thisMonthSales ?? 0,
        };
      case "lastMonth":
        return {
          deposit: team?.totalTeamDeposit ?? 0,
          withdraw: team?.totalTeamWithdraw ?? 0,
          netDeposit:
            (team?.totalTeamDeposit ?? 0) - (team?.totalTeamWithdraw ?? 0),
          aiTradeRoi: 0,
          volume: team?.lastMonthSales ?? 0,
        };
      case "lastWeek":
      default:
        return {
          deposit: 0,
          withdraw: 0,
          netDeposit: 0,
          aiTradeRoi: 0,
          volume: 0,
        };
    }
  };

  const kpisText = {
    countOfReferring: String(kpis.countOfReferring),
    totalReferralIncome: fmt(kpis.totalReferralIncome),
    level1AiTradeBalance: fmt(kpis.level1AiTradeBalance),
    level1LiveTradeBalance: fmt(kpis.level1LiveTradeBalance),
    activeUsers: String(team?.totalTeamMember ?? 0),
  };

  return {
    team,
    levels, // now contains: level, ordinalLabel, userCount
    kpis,
    kpisText,
    getMetricsByRange,
    loading: isLoading || isFetching,
    isError,
    error,
  };
}
