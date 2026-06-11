import { apiSlice } from '../api/apiSlice';

export const packageApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get all packages
		getAllPackages: builder.query<any, any>({
			query: () => ({
				url: '/packages',
				method: 'GET',
			}),
			providesTags: ['Package'],
		}),
		// get my packages
		getMyPackages: builder.query<any, any>({
			query: () => '/my-package',
			providesTags: ['Package'],
		}),

		// create package
		createPackage: builder.mutation<any, any>({
			query: (data) => ({
				url: '/create-user-package',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Package', 'User'],
		}),

		// get package by id
		getPackageById: builder.query<any, string>({
			query: (id) => `/package/${id}`,
		}),

		// get logged in user userPackages
		getUserPackages: builder.query<any, any>({
			query: () => ({
				url: '/user-packages',
				method: 'GET',
			}),
		}),
	}),
});

export const {
	useGetAllPackagesQuery,
	useGetMyPackagesQuery,
	useCreatePackageMutation,
	useGetPackageByIdQuery,
	useGetUserPackagesQuery,
} = packageApi;
