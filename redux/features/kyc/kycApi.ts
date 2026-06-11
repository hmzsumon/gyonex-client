import { apiSlice } from '../api/apiSlice';

export const kycApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// create verify step 01
		createVerifyStep01: builder.mutation<any, any>({
			query: (body) => ({
				url: '/verify-step-01',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// create verify step 02
		createVerifyStep02: builder.mutation<any, any>({
			query: (body) => ({
				url: '/verify-step-02',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// create verify step 03
		createVerifyStep03: builder.mutation<any, any>({
			query: (body) => ({
				url: '/verify-step-03',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['User'],
		}),
	}),
});

export const {
	useCreateVerifyStep01Mutation,
	useCreateVerifyStep02Mutation,
	useCreateVerifyStep03Mutation,
} = kycApi;
