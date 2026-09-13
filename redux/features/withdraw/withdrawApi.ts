import { apiSlice } from "../api/apiSlice";

export type WithdrawSettings = {
  feePercent: number;
  minAmount: number;
  maxAmount: number;
  quickAmounts: number[];
  dailyLimitCount: number;
  networks: string[];
};

export const withdrawApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // create new withdraw request
    createWithdrawRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: `/new-withdraw-request`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Withdraws"],
    }),

    // get  my withdraw requests
    getMyWithdrawRequests: builder.query<any, any>({
      query: () => `/my-withdraws`,
      providesTags: ["Withdraws"],
    }),

    // get all agents
    getAllAgents: builder.query<any, any>({
      query: () => `/get-all-agents`,
    }),

    // admin-configured withdraw rules (fee/min/max/quick-amounts/limit/networks)
    getWithdrawSettings: builder.query<
      { success: boolean; settings: WithdrawSettings },
      void
    >({
      query: () => `/withdraw/settings`,
      providesTags: ["WithdrawSettings"],
    }),
  }),
});

export const {
  useCreateWithdrawRequestMutation,
  useGetMyWithdrawRequestsQuery,
  useGetAllAgentsQuery,
  useGetWithdrawSettingsQuery,
} = withdrawApi;
