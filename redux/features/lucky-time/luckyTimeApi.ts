// redux/features/lucky-time/luckyTimeApi.ts

/* ── Imports ─────────────────────────────────────────────────────────────── */
import { apiSlice } from "../api/apiSlice";

/* ── Types ──────────────────────────────────────────────────────────────── */
type PlaceBetItem = { segmentId: number; amount: number };
type PlaceBetReq = { gameKey: string; bets: PlaceBetItem[] };
type PlaceBetResp = { success: boolean; roundId: string; totalStake: number };

type SettleReq = {
  gameKey: string;
  roundId: string;
  winningSegmentId: number;
  finalMulti?: number;
};
type SettleResp = {
  success: boolean;
  roundId: string;
  payout: number;
  net: number;
  status: string;
};

/* ── Endpoints ──────────────────────────────────────────────────────────── */
export const luckyTimeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeLucBet: builder.mutation<PlaceBetResp, PlaceBetReq>({
      query: ({ gameKey, bets }) => ({
        url: `/games/wheel/place-bet`,
        method: "POST",
        body: { bets, gameKey },
      }),
    }),

    settleLucBet: builder.mutation<SettleResp, SettleReq>({
      query: ({ gameKey, ...rest }) => ({
        url: `/games/wheel/settle`,
        method: "POST",
        body: { gameKey, ...rest },
      }),
    }),
  }),
});

/* ── Exports ───────────────────────────────────────────────────────────── */
export const { usePlaceLucBetMutation, useSettleLucBetMutation } = luckyTimeApi;
