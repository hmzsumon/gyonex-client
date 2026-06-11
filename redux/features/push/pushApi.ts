// src/redux/features/push/pushApi.ts
import { apiSlice } from "../api/apiSlice";

/* ────────── push api endpoints ────────── */
export const pushApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    pushSubscribe: builder.mutation<
      { success: boolean },
      { subscription: PushSubscriptionJSON; deviceName?: string }
    >({
      query: ({ subscription, deviceName }) => ({
        url: "/save-subscription",
        method: "POST",
        body: { subscription, deviceName },
      }),
    }),

    pushUnsubscribe: builder.mutation<
      { success: boolean },
      { endpoint: string }
    >({
      query: ({ endpoint }) => ({
        url: "/api/push/unsubscribe",
        method: "POST",
        body: { endpoint },
      }),
    }),

    pushTest: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/api/push/send-test", method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  usePushSubscribeMutation,
  usePushUnsubscribeMutation,
  usePushTestMutation,
} = pushApi;
