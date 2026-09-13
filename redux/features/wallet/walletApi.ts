// redux/features/wallet/walletApi.ts
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { apiSlice } from "@/redux/features/api/apiSlice"; // তোমার বেস apiSlice
import { setServerBalance } from "./walletSlice";

/* ── Endpoints ────────────────────────────────────────────────────────── */
export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query<{ balance: number }, void>({
      query: () => ({ url: "/wallet/me", method: "GET" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setServerBalance({ balance: Number(data?.balance) || 0 }));
        } catch {
          // ignore
        }
      },
    }),

    /* ── total trade income: AI + Live trade profit & commission, combined ── */
    getMyTradeIncome: builder.query<
      {
        success: boolean;
        totalTradeIncome: number;
        breakdown: {
          aiTradeProfit: number;
          aiTradeCommission: number;
          liveTradeProfit: number;
          liveTradeCommission: number;
        };
      },
      void
    >({
      query: () => ({ url: "/wallet/trade-income", method: "GET" }),
      providesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useLazyGetWalletQuery,
  useGetMyTradeIncomeQuery,
} = walletApi;
