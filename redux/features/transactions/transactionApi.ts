import { apiSlice } from "../api/apiSlice";

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: () => "/my-transactions",
      providesTags: ["Transaction", "Transactions"],
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionApi;
