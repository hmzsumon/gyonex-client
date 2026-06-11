import { apiSlice } from "../api/apiSlice";

export const luckyTimeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeLucBet: builder.mutation({
      query: (betData) => ({
        url: "/wheel/place-bet",
        method: "POST",
        body: betData,
      }),
      invalidatesTags: (_res, _err) => [{ type: "User", id: "ME" }],
    }),
    // /wheel/settle
    settleLucBet: builder.mutation({
      query: (settleData) => ({
        url: "/wheel/settle",
        method: "POST",
        body: settleData,
      }),
      invalidatesTags: (_res, _err) => [{ type: "User", id: "ME" }],
    }),
  }),
});

export const { usePlaceLucBetMutation, useSettleLucBetMutation } = luckyTimeApi;
