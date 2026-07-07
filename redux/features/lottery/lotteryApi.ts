/* ────────── client lottery RTK Query imports ────────── */
import { apiSlice } from "../api/apiSlice";
import type {
  LotteryEvent,
  LotteryTicket,
  LotteryWinner,
} from "./lotteryTypes";

/* ────────── client lottery API endpoints ────────── */
export const lotteryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLotteryEvents: builder.query<
      { success: boolean; data: LotteryEvent[] },
      void
    >({
      query: () => "/lottery/events",
      providesTags: ["Lottery", "LotteryTickets"],
    }),

    getActiveLottery: builder.query<any, void>({
      query: () => "/lottery/active",
      providesTags: ["Lottery", "LotteryTickets"],
    }),

    getMyLotteryTickets: builder.query<
      { success: boolean; data: LotteryTicket[] },
      void
    >({
      query: () => "/lottery/my-tickets",
      providesTags: ["LotteryTickets"],
    }),

    getLotteryWinners: builder.query<
      {
        success: boolean;
        data: {
          winners: LotteryWinner[];
          total: number;
          page: number;
          pages: number;
        };
      },
      number | void
    >({
      query: (page = 1) => `/lottery/winners?page=${page}&limit=10`,
      providesTags: ["LotteryWinners"],
    }),

    buyLotteryTickets: builder.mutation<
      any,
      { lotteryId: string; quantity: number }
    >({
      query: ({ lotteryId, quantity }) => ({
        url: `/lottery/events/${lotteryId}/buy`,
        method: "POST",
        body: { quantity },
      }),
      invalidatesTags: ["Lottery", "LotteryTickets", "Wallets", "Wallet"],
    }),
  }),
});

/* ────────── client lottery generated hooks ────────── */
export const {
  useGetLotteryEventsQuery,
  useGetActiveLotteryQuery,
  useGetMyLotteryTicketsQuery,
  useGetLotteryWinnersQuery,
  useBuyLotteryTicketsMutation,
} = lotteryApi;
