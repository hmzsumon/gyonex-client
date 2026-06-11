import { apiSlice } from "../api/apiSlice";

export const sendApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    send: builder.mutation({
      query: (body) => ({
        url: "/send-usdt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Transactions"],
    }),

    /* ────────── find user by customer id ────────── */
    findUserByCustomerId: builder.mutation<any, any>({
      query: (userId) => ({
        url: `get-user-by-customer-id/${userId}`,
        method: "PUT",
      }),
    }),

    // get my all transfer
    getMyTransfer: builder.query<any, any>({
      query: () => ({
        url: `/my-transfers`,
        method: "GET",
      }),
      providesTags: ["Transfer"],
    }),
  }),
});

export const {
  useSendMutation,
  useFindUserByCustomerIdMutation,
  useGetMyTransferQuery,
} = sendApi;
