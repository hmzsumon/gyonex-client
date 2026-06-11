import { apiSlice } from "../api/apiSlice";

export type LiteAccount = {
  id: string;
  title: string;
  accountNumber: number;
  type: string;
  currency: string;
  balance: number;
  equity: number;
  marginRatio: number;
};

export const transferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Send Money ────────── */
    sendMoney: builder.mutation<any, any>({
      query: (body) => ({
        url: "/send-money",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── List Accounts ────────── */
    listMyAccountsLite: builder.query<{ items: LiteAccount[] }, void>({
      query: () => ({ url: "/transfer/accounts", method: "GET" }),
      providesTags: ["Accounts", "User"],
    }),

    /* ────────── create transfer ────────── */
    createTransfer: builder.mutation<
      any,
      { fromId: string; toId: string; amount: number }
    >({
      query: (body) => ({ url: "/transfer", method: "POST", body }),
      invalidatesTags: ["Accounts", "User"],
    }),
  }),
});

export const {
  useSendMoneyMutation,
  useListMyAccountsLiteQuery,
  useCreateTransferMutation,
} = transferApi;
