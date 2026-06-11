import { IAccount } from "../account/accountApi";
import { apiSlice } from "../api/apiSlice";

export interface Position {
  _id: string;
  accountId: string;
  symbol: string;
  side: "buy" | "sell";
  volume: number;
  entryPrice: number;
  status: "open" | "closed";
  openedAt: string;
  closedAt?: string;
  profit?: number;
  lastPrice?: number;
}

export const tradeApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    listPositions: b.query<{ items: Position[] }, { accountId: string }>({
      query: ({ accountId }) => ({
        url: `/positions?accountId=${accountId}`,
      }),
      providesTags: ["Positions"],
    }),
    openDemoOrder: b.mutation<
      { position: Position; account: IAccount },
      {
        accountId: string;
        symbol: string;
        side: "buy" | "sell";
        volume: number;
        price: number;
      }
    >({
      query: (body) => ({ url: "/demo/orders", method: "POST", body }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
    closeDemoPosition: b.mutation<
      { position: Position; account: IAccount },
      { id: string; price: number }
    >({
      query: ({ id, price }) => ({
        url: `/demo/positions/${id}`,
        method: "DELETE",
        body: { price },
      }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
    /* ────────── placeMarketOrder ────────── */
    placeMarketOrder: b.mutation<
      { success: true; position: any },
      {
        accountId: string;
        symbol: string;
        side: "buy" | "sell";
        lots: number;
        price: number;
      }
    >({
      query: (body) => ({ url: "/trade/market", method: "POST", body }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
    /* ────────── close MarketOrder ────────── */
    closePosition: b.mutation<
      { success: true; position: any },
      { id: string; price: number }
    >({
      query: (body) => ({
        url: `/trade/${body.id}/close`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
    /* ────────── get close positions ────────── */
    getClosePositions: b.query<
      any,
      { accountId: string; status?: "open" | "closed"; limit?: number }
    >({
      query: () => ({ url: "/closed-positions" }),
      providesTags: ["Positions"],
    }),

    /* ────────── get  position by id ────────── */
    getPosition: b.query<{ item: any }, { id: string }>({
      query: ({ id }) => `/positions/${id}`,
    }),

    /* ────────── get  open positions by id ────────── */
    getOpenPositionsByAccount: b.query<
      Position[],
      { accountId: string; status?: "open" | "closed"; limit?: number }
    >({
      query: ({ accountId }) =>
        `/open-positions?accountId=${accountId}&status=open`,
      providesTags: ["Positions"],
    }),
  }),
});

export const {
  useListPositionsQuery,
  useOpenDemoOrderMutation,
  useCloseDemoPositionMutation,
  usePlaceMarketOrderMutation,
  useClosePositionMutation,
  useGetClosePositionsQuery,
  useGetPositionQuery,
  useGetOpenPositionsByAccountQuery,
} = tradeApi;
