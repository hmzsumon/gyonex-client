/* ── API: fruit loops wheel ───────────────────────────────────────────── */
import { apiSlice } from "../api/apiSlice";

/* ── Types ────────────────────────────────────────────────────────────── */
export type BetInput = { segmentId: number; amount: number };

export const fruitLoopsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ── POST /games/:gameKey/wheel/place-bet ─────────────────────────── */
    placeFruitBet: builder.mutation<
      { roundId: string; totalStake: number },
      { gameKey: string; bets: BetInput[] }
    >({
      query: ({ gameKey, bets }) => ({
        url: `/games/${gameKey}/wheel/place-bet`,
        method: "POST",
        body: { bets },
      }),
    }),

    /* ── POST /games/:gameKey/wheel/settle ────────────────────────────── */
    settleFruitBet: builder.mutation<
      {
        success: boolean;
        roundId: string;
        outcome: { segmentId: number; finalMulti: number; angle: number };
        payout: number;
        net: number;
        status: string;
      },
      {
        gameKey: string;
        roundId: string;
        winningSegmentId: number;
        finalMulti?: number;
      }
    >({
      query: ({ gameKey, roundId, winningSegmentId, finalMulti }) => ({
        url: `/games/${gameKey}/wheel/settle`,
        method: "POST",
        body: { roundId, winningSegmentId, finalMulti },
      }),
    }),
  }),
});

export const { usePlaceFruitBetMutation, useSettleFruitBetMutation } =
  fruitLoopsApi;
