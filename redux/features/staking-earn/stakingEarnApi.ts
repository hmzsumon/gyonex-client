import { apiSlice } from "../api/apiSlice";

export type StakingPlan = {
  _id: string;
  termDays: number;
  totalProfitPercent: number;
  dailyProfitPercent?: number;
  minAmount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  userSharePercent?: number;
};

export type StakingSubscription = {
  _id: string;
  userId: string;
  customerId?: string;

  asset: string;
  symbol: string;
  iconUrl?: string;

  principalQty: number;
  termDays: number;

  totalProfitPercent: number;
  dailyProfitPercent: number;

  paidDays: number;
  totalProfitQty: number;

  status: "active" | "completed" | "cancelled";

  startedAt: string;
  endAt: string;

  // cancel history snapshot (optional)
  cancelledAt?: string;
  cancelBaseDailyPercent?: number;
  cancelPenaltyPercent?: number;
  cancelPenaltyQty?: number;
  principalReturnQty?: number;

  createdAt?: string;
  updatedAt?: string;
};

export type StakingSummary = {
  _id: string;
  userId: string;

  asset: string;
  symbol: string;
  iconUrl?: string;

  activePrincipalQty: number;
  activeCount: number;

  totalSubscribedQty: number;
  totalCompletedPrincipalQty: number;
  totalProfitQty: number;

  lastSubscribedAt?: string;
  lastProfitAt?: string;
  nextMaturityAt?: string;

  reconciledAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type StakingLog = {
  _id: string;
  type: "profit" | "cancel" | "principal_return";

  subscriptionId: string;
  userId: string;

  asset?: string;
  symbol: string;
  dayKey: string;

  profitQty?: number;

  grossProfitQty?: number;
  userSharePercent?: number;
  remainderQty?: number;
  parentsBonusQty?: number;
  systemQty?: number;

  principalQty?: number;
  paidDays?: number;

  fixedDailyPercent?: number;
  baseDailyPercent?: number;
  penaltyPercent?: number;
  penaltyQty?: number;
  principalReturnQty?: number;

  note?: string;

  createdAt?: string;
  updatedAt?: string;
};

type ApiListResponse<T> = { success: boolean; items: T[] };
type ApiItemResponse<T> = { success: boolean; item: T };

type SubscribePayload = {
  symbol: string;
  amount: number;
  termDays: number;
  iconUrl?: string;
};

type SubscribeResponse = {
  success: boolean;
  subscription: StakingSubscription;
};

type LogsQuery = { id: string; limit?: number };

export const stakingEarnApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET plans
    getStakingPlans: builder.query<ApiListResponse<StakingPlan>, void>({
      query: () => "/staking/plans",
      providesTags: ["StakingPlans"],
    }),

    // ✅ POST subscribe
    subscribeStaking: builder.mutation<SubscribeResponse, SubscribePayload>({
      query: (body) => ({
        url: "/staking/subscribe",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "StakingSubs", "StakingSummary", "StakingLogs"],
    }),

    // ✅ GET my subscriptions
    getMyStakingSubscriptions: builder.query<
      ApiListResponse<StakingSubscription>,
      void
    >({
      query: () => "/staking/me",
      providesTags: ["StakingSubs"],
    }),

    // ✅ GET my summary
    getMyStakingSummary: builder.query<ApiListResponse<StakingSummary>, void>({
      query: () => "/staking/summary",
      providesTags: ["StakingSummary"],
    }),

    // ✅ GET subscription by id
    getMyStakingSubscriptionById: builder.query<
      ApiItemResponse<StakingSubscription>,
      string
    >({
      query: (id) => `/staking/subscriptions/${id}`,
      providesTags: (_r, _e, id) => [{ type: "StakingSubs", id }],
    }),

    // ✅ GET logs
    getMyStakingProfitLogs: builder.query<
      ApiListResponse<StakingLog>,
      LogsQuery
    >({
      query: ({ id, limit = 50 }) =>
        `/staking/subscriptions/${id}/logs?limit=${limit}`,
      providesTags: (_r, _e, arg) => [{ type: "StakingLogs", id: arg.id }],
    }),

    // ✅ POST cancel
    cancelMyStakingSubscription: builder.mutation<
      { success: boolean; result: any },
      string
    >({
      query: (id) => ({
        url: `/staking/subscriptions/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        "User",
        "StakingSubs",
        "StakingSummary",
        { type: "StakingLogs", id },
      ],
    }),
  }),
});

export const {
  useGetStakingPlansQuery,
  useSubscribeStakingMutation,
  useGetMyStakingSubscriptionsQuery,
  useGetMyStakingSummaryQuery,

  useGetMyStakingSubscriptionByIdQuery,
  useGetMyStakingProfitLogsQuery,
  useCancelMyStakingSubscriptionMutation,
} = stakingEarnApi;
