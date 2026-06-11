/* ──────────────────────────────────────────────────────────────────────────
   aiAccountApi — ai plan / ai account / ai position
────────────────────────────────────────────────────────────────────────── */
import { apiSlice } from "../api/apiSlice";

export interface IAiPlanRow {
  label: string;
  value: string;
}

export interface IAiPlan {
  _id: string;
  key: string;
  title: string;
  subtitle: string;
  amount: number;
  rows: IAiPlanRow[];
  isActive: boolean;
  sortOrder: number;
}

export interface IAccount {
  _id: string;
  accountNumber: number;
  currency: "USD" | "BDT";
  balance: number;
  isDefault: boolean;
  status: "active" | "closed" | "inactive";
  mode: "ai";
  plan: string;
  equity: number;
  planPrice: number;
}

export interface Position {
  _id: string;
  accountId: string;
  symbol: string;
  side: "buy" | "sell";
  lots: number;
  entryPrice: number;
  status: "open" | "closed";
  openedAt: string;
  closedAt?: string;
  profit?: number;
  lastPrice?: number;
  plan: string;
  takeProfit: number;
  manipulateClosePrice: number;
}

export const aiAccountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── get ai plans ────────── */
    getAiPlans: builder.query<{ success: true; items: IAiPlan[] }, void>({
      query: () => ({ url: "/ai-plans" }),
      providesTags: ["Accounts"],
    }),

    /* ────────── create ai account ────────── */
    createAiAccount: builder.mutation<
      { success: true; account: IAccount; message: string },
      {
        plan: string;
        amount: number;
      }
    >({
      query: (body) => ({ url: "/create-ai-accounts", method: "POST", body }),
      invalidatesTags: ["Accounts", "User"],
    }),

    /* ────────── my ai accounts ────────── */
    getMyAiAccounts: builder.query<{ success: true; items: IAccount[] }, void>({
      query: () => ({ url: "/my-ai-accounts" }),
      providesTags: ["Accounts"],
    }),

    /* ────────── get all active ai positions ────────── */
    getAllAiPositions: builder.query<
      { success: true; items: IAccount[] },
      void
    >({
      query: () => ({ url: "/get-active-ai-positions-for-user" }),
      providesTags: ["Positions"],
    }),

    /* ────────── get all closed ai positions ────────── */
    getClosedAiPositions: builder.query<
      { success: true; items: IAccount[] },
      void
    >({
      query: () => ({ url: "/get-closed-ai-positions-for-user" }),
      providesTags: ["Positions"],
    }),

    /* ────────── get open ai positions by plan ────────── */
    getOpenAiPositionsByPlan: builder.query<Position[], { plan: string }>({
      query: ({ plan }) => ({
        url: `/get-active-ai-positions-by-plan-for-user?plan=${plan}`,
      }),
      providesTags: ["Positions"],
    }),

    /* ────────── add fund to ai account ────────── */
    addFundToAiAccount: builder.mutation<
      { success: boolean; message: string },
      { id: string; amount: number }
    >({
      query: ({ id, amount }) => ({
        url: "/add-fund-to-ai-account",
        method: "POST",
        body: { accountId: id, amount },
      }),
      invalidatesTags: ["Accounts", "User"],
    }),

    /* ── cancel ai account ── */
    cancelAiAccount: builder.mutation<
      {
        success: boolean;
        message: string;
        refund: number;
        fee: number;
        planPrice: number;
      },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/cancel-ai-account/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Accounts", "User", "Transactions"],
    }),

    /* ── get single ai account details ── */
    getAiAccountDetails: builder.query<
      { success: boolean; account: IAccount; totalProfit: number },
      { id: string }
    >({
      query: ({ id }) => ({ url: `/my-ai-account/${id}` }),
      providesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetAiPlansQuery,
  useCreateAiAccountMutation,
  useGetMyAiAccountsQuery,
  useGetAllAiPositionsQuery,
  useGetClosedAiPositionsQuery,
  useGetOpenAiPositionsByPlanQuery,
  useAddFundToAiAccountMutation,
  useCancelAiAccountMutation,
} = aiAccountApi;
