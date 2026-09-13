/* ────────── client lucky card RTK Query ────────── */
import { apiSlice } from "../api/apiSlice";
import type {
  LuckyCardRow,
  LuckyPurchaseRow,
  LuckyShopCardType,
} from "./luckyCardTypes";

export const luckyCardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLuckyShop: builder.query<{ success: boolean; shop: LuckyShopCardType[] }, void>({
      query: () => "/lucky/shop",
      providesTags: ["LuckyCard"],
    }),

    buyLuckyPackage: builder.mutation<
      {
        success: boolean;
        balance: number;
        purchase: any;
        cards: LuckyCardRow[];
      },
      { packageId: string }
    >({
      query: (body) => ({ url: "/lucky/buy", method: "POST", body }),
      invalidatesTags: ["LuckyCard", "LuckyCards", "Wallet", "Wallets"],
    }),

    getMyLuckyCards: builder.query<
      { success: boolean; cards: LuckyCardRow[] },
      "unopened" | "opened" | void
    >({
      query: (status) => ({
        url: "/lucky/cards",
        params: status ? { status } : undefined,
      }),
      providesTags: ["LuckyCards"],
    }),

    getMyLuckyPurchases: builder.query<
      { success: boolean; purchases: LuckyPurchaseRow[] },
      void
    >({
      query: () => "/lucky/purchases",
      providesTags: ["LuckyCards"],
    }),

    openLuckyCard: builder.mutation<
      { success: boolean; balance: number; card: LuckyCardRow },
      string
    >({
      query: (id) => ({ url: `/lucky/cards/${id}/open`, method: "POST" }),
      invalidatesTags: ["LuckyCards", "Wallet", "Wallets"],
    }),

    verifyLuckyCard: builder.query<any, string>({
      query: (shortCode) => `/lucky/verify/${shortCode}`,
    }),
  }),
});

export const {
  useGetLuckyShopQuery,
  useBuyLuckyPackageMutation,
  useGetMyLuckyCardsQuery,
  useGetMyLuckyPurchasesQuery,
  useOpenLuckyCardMutation,
  useLazyVerifyLuckyCardQuery,
} = luckyCardApi;
