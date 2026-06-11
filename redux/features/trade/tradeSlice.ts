/* ────────────────────────────────────────────────────────────
   tradeSlice — selected symbol, timeframe, chartType
──────────────────────────────────────────────────────────── */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Timeframe = "1m" | "3m" | "5m" | "10m" | "15m" | "1h" | "2h";
export type ChartType = "line" | "bars" | "candles" | "hollow";

export type Quote = {
  symbol: string;
  bid: number;
  ask: number;
  ts: number;
};

export type Instrument = {
  symbol: string; // "XAUUSD"
  name: string; // "Gold vs US Dollar"
  category:
    | "Majors"
    | "Metals"
    | "Crypto"
    | "Indices"
    | "Stocks"
    | "Most"
    | "Favorites";
  decimals: number;
  minVol: number;
  stepVol: number;
  pipValue: number;
};

type TradeState = {
  symbol: string;
  tf: Timeframe;
  chartType: ChartType; // 👈 নতুন
  quote?: Quote;
  drawerOpen: boolean;
  ticketOpen: boolean;
  volume: number;
};

const initial: TradeState = {
  symbol: "XAUUSD",
  tf: "5m",
  chartType: "candles", // 👈 ডিফল্ট
  drawerOpen: false,
  ticketOpen: false,
  volume: 0.01,
};

const tradeSlice = createSlice({
  name: "trade",
  initialState: initial,
  reducers: {
    setSymbol(s, a: PayloadAction<string>) {
      s.symbol = a.payload;
    },
    setTimeframe(s, a: PayloadAction<Timeframe>) {
      s.tf = a.payload;
    },
    setChartType(s, a: PayloadAction<ChartType>) {
      // 👈 নতুন অ্যাকশন
      s.chartType = a.payload;
    },
    setQuote(s, a: PayloadAction<Quote>) {
      if (a.payload.symbol === s.symbol) s.quote = a.payload;
    },
    setDrawerOpen(s, a: PayloadAction<boolean>) {
      s.drawerOpen = a.payload;
    },
    setTicketOpen(s, a: PayloadAction<boolean>) {
      s.ticketOpen = a.payload;
    },
    setVolume(s, a: PayloadAction<number>) {
      s.volume = a.payload;
    },
  },
});

export const {
  setSymbol,
  setTimeframe,
  setChartType, // 👈 এটা এক্সপোর্ট করো
  setQuote,
  setDrawerOpen,
  setTicketOpen,
  setVolume,
} = tradeSlice.actions;

export default tradeSlice.reducer;
