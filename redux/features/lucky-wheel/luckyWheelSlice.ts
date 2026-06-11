import { createSlice } from "@reduxjs/toolkit";

interface LuckyWheelState {
  isOpen: boolean;
  isSpinning: boolean;
  betAmount: number;
  minBetAmount?: number;
  maxBetAmount?: number;
}

const initialState: LuckyWheelState = {
  isOpen: false,
  isSpinning: false,
  betAmount: 0,
  minBetAmount: 5, // Example minimum bet amount
  maxBetAmount: 1000, // Example maximum bet amount
};

const luckyWheelSlice = createSlice({
  name: "luckyWheel",
  initialState,
  reducers: {
    openLuckyWheel: (state) => {
      state.isOpen = true;
    },
    closeLuckyWheel: (state) => {
      state.isOpen = false;
    },
    startSpinning: (state) => {
      state.isSpinning = true;
    },
    stopSpinning: (state) => {
      state.isSpinning = false;
    },
    setBetAmount: (state, action) => {
      state.betAmount = action.payload;
    },
  },
});

export const {
  openLuckyWheel,
  closeLuckyWheel,
  startSpinning,
  stopSpinning,
  setBetAmount,
} = luckyWheelSlice.actions;
export default luckyWheelSlice.reducer;
