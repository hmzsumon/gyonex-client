import { apiSlice } from "../api/apiSlice";

/* ─────────────────────────────────────────────────────────────────────────
   Loan API - RTK Query
   এই ফাইলের সব endpoint Redux apiSlice দিয়ে চলবে।
   তাই Loans page-এ আর services/api বা React Query লাগবে না।
───────────────────────────────────────────────────────────────────────── */
export const loanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── USER: loan packages ────────── */
    getLoanPackages: builder.query<any, void>({
      query: () => "/loans/packages",
      providesTags: ["Loans"],
    }),

    /* ────────── USER: my loans ────────── */
    getMyLoans: builder.query<any, void>({
      query: () => "/loans/my",
      providesTags: ["Loans"],
    }),

    /* ────────── USER: loan countdown ────────── */
    getMyLoanCountdown: builder.query<any, void>({
      query: () => "/loans/my/countdown",
      providesTags: ["Loans"],
    }),

    /* ────────── USER: wallets for eligibility balance ────────── */
    getWalletsForLoan: builder.query<any, void>({
      query: () => "/wallets",
      providesTags: ["Wallets", "Wallet"],
    }),

    /* ────────── USER: apply for loan ──────────
       File upload নেই, তাই normal JSON body পাঠানো হবে।
    ───────────────────────────────────────────────────────────── */
    applyForLoan: builder.mutation<
      any,
      { loanType: string; requestedAmount: number; repaymentPeriodDays: number }
    >({
      query: (body) => ({
        url: "/loans/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loans", "Wallets", "Wallet"],
    }),

    /* ────────── USER: repay loan ────────── */
    repayLoan: builder.mutation<any, { loanId: string; amount: number }>({
      query: ({ loanId, amount }) => ({
        url: `/loans/${loanId}/repay`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Loans", "Wallets", "Wallet"],
    }),
  }),
});

export const {
  useGetLoanPackagesQuery,
  useGetMyLoansQuery,
  useGetMyLoanCountdownQuery,
  useGetWalletsForLoanQuery,
  useApplyForLoanMutation,
  useRepayLoanMutation,
} = loanApi;
