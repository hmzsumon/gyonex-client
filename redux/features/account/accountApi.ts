/* ──────────────────────────────────────────────────────────────────────────
   accountApi — create/list/update/default/transfer/close
────────────────────────────────────────────────────────────────────────── */
import { apiSlice } from "../api/apiSlice";

export type TAccountType = "standard" | "pro";
export interface IAccount {
  _id: string;
  accountNumber: number;
  type: TAccountType;
  name?: string;
  currency: "USD" | "BDT";
  leverage: number;
  balance: number;
  isDefault: boolean;
  status: "active" | "closed";
  mode: "real" | "demo";
  plan: string;
  equity: number;
}

export const accountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation<
      { success: true; account: IAccount },
      {
        type: TAccountType;
        leverage?: number;
        name?: string;
        currency?: "USD" | "BDT";
      }
    >({
      query: (body) => ({ url: "/accounts", method: "POST", body }),
      invalidatesTags: ["Accounts"],
    }),
    getMyAccounts: builder.query<{ success: true; items: IAccount[] }, void>({
      query: () => ({ url: "/accounts/mine" }),
      providesTags: ["Accounts"],
    }),
    updateAccount: builder.mutation<
      { success: true; account: IAccount },
      { id: string; name?: string; leverage?: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/accounts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    setDefaultAccount: builder.mutation<
      { success: true; account: IAccount },
      { id: string }
    >({
      query: ({ id }) => ({ url: `/accounts/${id}/default`, method: "PATCH" }),
      invalidatesTags: ["Accounts"],
    }),
    transferInternal: builder.mutation<
      { success: true; account: IAccount },
      { id: string; direction: "fund" | "defund"; amount: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/accounts/${id}/transfer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    closeAccount: builder.mutation<{ success: true }, { id: string }>({
      query: ({ id }) => ({ url: `/accounts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Accounts"],
    }),
    /* ────────── demoTopUp mutation ────────── */
    demoTopUp: builder.mutation<
      {
        success: true;
        account: IAccount;
        receipt: { status: "accepted"; amount: number; currency: string };
      },
      { id: string; amount: number }
    >({
      query: ({ id, amount }) => ({
        url: `/accounts/${id}/demo-deposit`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useGetMyAccountsQuery,
  useUpdateAccountMutation,
  useSetDefaultAccountMutation,
  useTransferInternalMutation,
  useCloseAccountMutation,
  useDemoTopUpMutation,
} = accountApi;
