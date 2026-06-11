import { apiSlice } from "../api/apiSlice";

export const depositApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // create deposit request
    createDepositRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: "/create-new-deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deposits"],
    }),

    // get my deposits or logged in user deposits
    getMyDeposits: builder.query<any, any>({
      query: () => "/my-deposits",
      providesTags: ["Deposits"],
    }),

    // get single deposit
    getDeposit: builder.query<any, any>({
      query: (id) => `/deposit/${id}`,
      providesTags: ["Deposits"],
    }),

    // get active deposit method
    getActiveDepositMethod: builder.query<any, any>({
      query: () => "/deposit-method/active",
    }),

    // deposit with binance
    depositWithBinance: builder.mutation<any, any>({
      query: (body) => ({
        url: "/binance-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── Get Payment Methods ────────── */
    getPaymentMethods: builder.query<any, any>({
      query: () => "/payment-methods",
    }),

    /* ────────── Create new Deposit with BDT ────────── */
    createDepositWithBDT: builder.mutation<any, any>({
      query: (body) => ({
        url: "/create-new-deposit-bdt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deposits"],
    }),
    /* ────────── Get Single Payment Method By Name ────────── */
    getPaymentMethodByName: builder.query<any, string>({
      query: (methodName) => `/payment-methods/${methodName}`,
    }),
  }),
});

export const {
  useCreateDepositRequestMutation,
  useGetMyDepositsQuery,
  useGetDepositQuery,
  useGetActiveDepositMethodQuery,
  useDepositWithBinanceMutation,
  useGetPaymentMethodsQuery,
  useCreateDepositWithBDTMutation,
  useGetPaymentMethodByNameQuery,
} = depositApi;
