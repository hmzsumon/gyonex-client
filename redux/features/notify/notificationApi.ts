import { apiSlice } from '../api/apiSlice';

export const notificationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query({
			query: () => '/notifications',
			providesTags: ['Notification', 'Notifications'],
		}),

		// updateNotification
		updateNotification: builder.mutation({
			query: ({ id }) => ({
				url: `/notification/${id}`,
				method: 'PUT',
			}),
			invalidatesTags: ['Notification', 'Notifications'],
		}),

		// logged in user notifications
		getMyNotifications: builder.query({
			query: () => '/my-notifications',
			providesTags: ['Notification'],
		}),

		// update notification is_read status
		updateNotificationStatus: builder.mutation({
			query: () => ({
				url: `/update-all-notifications`,
				method: 'PUT',
			}),
			invalidatesTags: ['Notification'],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useGetMyNotificationsQuery,
	useUpdateNotificationMutation,
	useUpdateNotificationStatusMutation,
} = notificationApi;
