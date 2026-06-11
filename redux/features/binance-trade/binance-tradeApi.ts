// redux/features/binance-trade/binance-tradeApi.ts
import type { Side } from "@/components/binance-trade/TradeLayout";
import { apiSlice } from "../api/apiSlice";

export interface PlaceBinanceOrderRequest {
  symbol: string;
  side: Side;
  orderType: "market" | "limit";
  quantity: number;
  price?: number;
}

export interface PlaceBinanceOrderResponse {
  success: boolean;
  order: {
    _id: string;
    symbol: string;
    side: Side;
    type: string;
    price: number;
    quantity: number;
    notional: number;
    createdAt: string;
  };
}

// Spot wallet ব্যালেন্স টাইপ
export interface SpotWallet {
  _id: string;
  asset: string;
  symbol: string;
  qty: number;
  avgPrice: number;
  iconUrl?: string;
}

// ✅ TradingPair টাইপ (backend model অনুযায়ী)
export interface TradingPair {
  _id: string;
  serialNo?: number;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  enabled: boolean;
  rank: number;

  coingeckoId?: string;
  iconUrl?: string;

  isPinned?: boolean;
  isFeatured?: boolean;
  isMostPopular?: boolean;
  isPopular?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isNewListing?: boolean;

  tags?: string[];
  popularityScore?: number;
  volume24h?: number;
  lastPrice?: number;
}

export type TradingPairsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;

  popular?: boolean;
  mostPopular?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  newListing?: boolean;
  featured?: boolean;
  pinned?: boolean;

  sort?: "serialNo" | "rank" | "popularityScore" | "volume24h";
  order?: "asc" | "desc";
};

type TradingPairsResponse = {
  success: boolean;
  items: TradingPair[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
  };
};

export const binanceTradeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 👉 Order place mutation
    placeBinanceOrder: builder.mutation<
      PlaceBinanceOrderResponse,
      PlaceBinanceOrderRequest
    >({
      query: (body) => ({
        url: "/binance-trade/order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User","SpotWallets"],
    }),


    // 👉 Spot balances query
    getSpotBalances: builder.query<SpotWallet[], void>({
      query: () => "/binance-trade/balances",
      transformResponse: (res: { success: boolean; items: SpotWallet[] }) =>
        res.items,

      providesTags: ["SpotWallets"],
    }),

    // ✅ Trading pairs list (DB থেকে)
    getTradingPairs: builder.query<
      TradingPairsResponse,
      TradingPairsQuery | void
    >({
      query: (params) => {
        const p = params ?? {};
        const qs = new URLSearchParams();

        Object.entries(p).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "") return;
          qs.set(k, String(v));
        });

        const url = qs.toString() ? `/trading-pairs?${qs}` : "/trading-pairs";
        return url;
      },
    }),
  }),
});

export const {
  usePlaceBinanceOrderMutation,
  useGetSpotBalancesQuery,
  useGetTradingPairsQuery,
} = binanceTradeApi;
