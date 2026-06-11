import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://api.binance.com/api/v3';

export const tradApi = createApi({
	reducerPath: 'tradApi',
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	endpoints: (builder) => ({
		getBitData: builder.query<any, void>({
			query: () => `/ticker/price?symbol=BTCUSDT`,
			keepUnusedDataFor: 1,
		}),
	}),
});

export const { useGetBitDataQuery } = tradApi;
