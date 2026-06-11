// redux/features/trade/positionsApi.ts
import { apiSlice } from "../api/apiSlice";

export interface PositionRow {
  _id: string;
  symbol: string;
  status: "open" | "closed";
  side: "buy" | "sell";
  entryPrice: number;
  lots?: number;
  volume?: number;
}

export const positionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOpenPositionsByAccount: builder.query<PositionRow[], string>({
      // GET /api/positions?accountId=...&status=open
      query: (accountId) =>
        `/positions?accountId=${encodeURIComponent(accountId)}&status=open`,
      // keep only fields we need if server returns extra
      transformResponse: (rows: any[]) =>
        (rows ?? []).map((r) => ({
          _id: r._id,
          symbol: r.symbol,
          status: r.status,
          side: r.side,
          entryPrice: Number(r.entryPrice),
          lots: Number(r.lots ?? r.volume ?? 0),
          volume: Number(r.volume ?? r.lots ?? 0),
        })),
      providesTags: (_r, _e, id) => [{ type: "Positions", id }],
    }),
  }),
});

export const { useGetOpenPositionsByAccountQuery } = positionsApi;
