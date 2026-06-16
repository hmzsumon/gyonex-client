import { apiSlice } from "../api/apiSlice";

/* ─────────────────────────────────────────────────────────────────────────
   Lottery API - RTK Query
   Lottery page এখন Redux apiSlice ব্যবহার করবে।
   services/api এবং React Query বাদ দেওয়া হয়েছে।
───────────────────────────────────────────────────────────────────────── */
export const lotteryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── USER: active lottery ────────── */
    getActiveLottery: builder.query<any, void>({
      query: () => "/lottery/active",
      providesTags: ["Lottery", "LotteryTickets"],
    }),

    /* ────────── USER: my lottery tickets ────────── */
    getMyLotteryTickets: builder.query<any, void>({
      query: () => "/lottery/my-tickets",
      providesTags: ["LotteryTickets"],
    }),

    /* ────────── USER: winners list ────────── */
    getLotteryWinners: builder.query<any, number | void>({
      query: (page = 1) => `/lottery/winners?page=${page}&limit=10`,
      providesTags: ["LotteryWinners"],
    }),

    /* ────────── USER: buy lottery tickets ────────── */
    buyLotteryTickets: builder.mutation<
      any,
      { lotteryId: string; quantity: number }
    >({
      query: ({ lotteryId, quantity }) => ({
        url: `/lottery/${lotteryId}/buy`,
        method: "POST",
        body: { quantity },
      }),
      invalidatesTags: ["Lottery", "LotteryTickets", "Wallets", "Wallet"],
    }),
  }),
});

export const {
  useGetActiveLotteryQuery,
  useGetMyLotteryTicketsQuery,
  useGetLotteryWinnersQuery,
  useBuyLotteryTicketsMutation,
} = lotteryApi;
