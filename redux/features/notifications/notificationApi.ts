// frontend/redux/api/notificationApi.ts  (RTK Query with tags)
import { apiSlice } from "../api/apiSlice";

/* ──────────  notification api slice  ────────── */
export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ──────────  my unread list  ────────── */
    getMyUnreadNotifications: builder.query<any, void>({
      query: () => "/my-unread-notifications",
      providesTags: ["MyUnreadNotifications"],
    }),

    /* ──────────  my unread count  ────────── */
    getMyUnreadNotificationsCount: builder.query<{ dataCount: number }, void>({
      query: () => "/my-unread-notifications-count",
      providesTags: ["MyUnreadNotificationsCount"],
    }),

    /* ──────────  mark one notification read  ────────── */
    updateNotification: builder.mutation<any, string>({
      query: (id) => ({
        url: `/update-notification/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["MyUnreadNotifications", "MyUnreadNotificationsCount"],
    }),

    /* ──────────  admin list  ────────── */
    getAdminNotifications: builder.query<any, void>({
      query: () => "/admin-notifications",
      providesTags: ["AdminNotifications"],
    }),

    /* ──────────  admin mark read  ────────── */
    updateAdminNotificationIsRead: builder.mutation<
      any,
      { notificationIds: string[] }
    >({
      query: (body) => ({
        url: "/update-admin-notification",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminNotifications"],
    }),
  }),
});

export const {
  useGetMyUnreadNotificationsQuery,
  useGetMyUnreadNotificationsCountQuery,
  useUpdateNotificationMutation,
  useGetAdminNotificationsQuery,
  useUpdateAdminNotificationIsReadMutation,
} = notificationApi;
