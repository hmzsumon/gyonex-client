// redux/features/crypto/cryptoApi.ts
import { apiSlice } from "@/redux/features/api/apiSlice";

type MostRow = {
  symbol: string; // BTCUSDT
  display: string; // BTC/USD
  last: number;
  change: number; // %
  quoteVolume: number;
};

type SymbolRow = {
  symbol: string; // BTCUSDT
  base: string; // BTC
  display: string; // BTC/USD
};

export const cryptoApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    // GET /crypto/most   -> backend proxy to Binance 24hr (60s cache)
    getMostCrypto: b.query<{ mostTraded: MostRow[] }, void>({
      query: () => ({ url: "/crypto/most" }),
      providesTags: ["Trades"], // optional
    }),
    // GET /crypto/symbols -> backend proxy to Binance exchangeInfo (1h cache)
    getCryptoSymbols: b.query<{ symbols: SymbolRow[] }, void>({
      query: () => ({ url: "/crypto/symbols" }),
    }),
  }),
});

export const { useGetMostCryptoQuery, useGetCryptoSymbolsQuery } = cryptoApi;
