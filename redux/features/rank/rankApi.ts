/* ────────── comments ────────── */
/* Rank API endpoints using your apiSlice (RTK Query). */
/* ────────── comments ────────── */
import type { RankSummaryResponse } from "@/types/rank";
import { apiSlice } from "../api/apiSlice";

export const rankApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── get my rank summary ────────── */
    getMyRankSummary: builder.query<RankSummaryResponse, void>({
      query: () => ({
        url: "/my-rank-summary",
        method: "GET",
      }),
      transformResponse: (resp: {
        status: string;
        data: RankSummaryResponse;
      }) => resp.data,
    }),

    /* ────────── claim rank bonus ────────── */
    claimRank: builder.mutation<
      { status: string; message?: string; rewardUsd?: number },
      { key: string }
    >({
      query: ({ key }) => ({
        url: "/claim",
        method: "POST",
        body: { key },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetMyRankSummaryQuery, useClaimRankMutation } = rankApi;
