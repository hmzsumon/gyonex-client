// redux/features/lucky-time/luckyTimeSlice.ts

/* ── Imports ─────────────────────────────────────────────────────────────── */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ── Types ──────────────────────────────────────────────────────────────── */
export type ResultItem = {
  id: number;
  name: string;
  emoji: string;
  angle: number;
  multi: number;
};
export type LuckyTimeResult = {
  spinId: number;
  ts: number;
  item: ResultItem;
  betAmount: number;
  winAmount: number;
};
export type WinToast = {
  open: boolean;
  item: ResultItem | null;
  winAmount: number;
  betAmount: number;
};
export type Boost = {
  id: string;
  itemId: number;
  value: number;
  expiresAt: number;
};

/* ── State Shape ────────────────────────────────────────────────────────── */
interface LuckyTimeState {
  isOpen: boolean;
  isSpinning: boolean;

  balance: number;
  selectedChip: number | null;

  bets: Record<number, number>;
  totalBet: number;
  lastBets: Record<number, number>;

  minBetAmount?: number;
  maxBetAmount?: number;

  luckyTimeResults?: ResultItem[];
  winKey?: string;
  spinId: number;
  durationMs: number;
  forceIndex?: number | null;
  results: string[];
  last?: ResultItem | null;

  activeBoosts: Boost[];
  history: LuckyTimeResult[];
  winToast: WinToast;
}

/* ── Initial State ─────────────────────────────────────────────────────── */
const initialState: LuckyTimeState = {
  isOpen: false,
  isSpinning: false,

  balance: 10_000,
  selectedChip: null,

  bets: {},
  totalBet: 0,
  lastBets: {},

  minBetAmount: 1,
  maxBetAmount: undefined, // undefined => no hard upper limit

  luckyTimeResults: [],
  winKey: undefined,
  spinId: 0,
  durationMs: 6000,
  forceIndex: null,
  results: [],
  last: null,

  activeBoosts: [],
  history: [],
  winToast: { open: false, item: null, winAmount: 0, betAmount: 0 },
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
const add = (a = 0, b = 0) => a + b;

/* ── Slice ──────────────────────────────────────────────────────────────── */
const luckyTimeSlice = createSlice({
  name: "luckyTime",
  initialState,
  reducers: {
    /* ── UI open/close ─────────────────────────────────────────────────── */
    openLuckyTime: (s) => {
      s.isOpen = true;
    },
    closeLuckyTime: (s) => {
      s.isOpen = false;
    },

    /* ── Balance Controls ──────────────────────────────────────────────── */
    setBalance: (s, a: PayloadAction<number>) => {
      s.balance = Math.max(0, a.payload | 0);
    },
    deposit: (s, a: PayloadAction<number>) => {
      s.balance += Math.max(0, a.payload | 0);
    },
    withdraw: (s, a: PayloadAction<number>) => {
      s.balance = Math.max(0, s.balance - Math.max(0, a.payload | 0));
    },

    /* ── Chip Selection ────────────────────────────────────────────────── */
    selectChip: (s, a: PayloadAction<number | null>) => {
      s.selectedChip = a.payload ?? null;
    },

    /* ── Betting ───────────────────────────────────────────────────────── */
    placeBetOn: (s, a: PayloadAction<{ itemId: number; amount?: number }>) => {
      if (s.isSpinning) return;
      const amt = (a.payload.amount ?? s.selectedChip ?? 0) | 0;
      if (amt <= 0) return;
      if (typeof s.maxBetAmount === "number" && amt > s.maxBetAmount) return;
      if (s.minBetAmount && amt < s.minBetAmount) return;
      if (s.balance < amt) return;

      s.balance -= amt;
      s.bets[a.payload.itemId] = add(s.bets[a.payload.itemId], amt);
      s.totalBet += amt;
    },

    /* ── Rebet (repeat last snapshot) ──────────────────────────────────── */
    rebet: (s) => {
      if (s.isSpinning) return;
      const entries = Object.entries(s.lastBets || {});
      if (!entries.length) return;

      for (const [idStr, amt] of entries) {
        const id = Number(idStr);
        if (amt <= 0) continue;
        if (typeof s.maxBetAmount === "number" && amt > s.maxBetAmount)
          continue;
        if (s.balance < amt) continue;

        s.balance -= amt;
        s.bets[id] = add(s.bets[id], amt);
        s.totalBet += amt;
      }
    },

    /* ── Spin Lifecycle ────────────────────────────────────────────────── */
    requestSpin: (
      s,
      a: PayloadAction<
        { durationMs?: number; forceIndex?: number | null } | undefined
      >
    ) => {
      s.spinId += 1;
      if (a?.payload?.durationMs) s.durationMs = a.payload.durationMs;
      s.forceIndex =
        typeof a?.payload?.forceIndex === "number"
          ? a.payload.forceIndex
          : null;
    },
    startSpinning: (s) => {
      if (s.totalBet > 0) {
        s.lastBets = { ...s.bets }; // snapshot for REBET
        s.isSpinning = true;
      }
    },
    stopSpinning: (s) => {
      s.isSpinning = false;
    },

    /* ── Legacy/Display ────────────────────────────────────────────────── */
    setWinKey: (s, a: PayloadAction<string>) => {
      s.winKey = a.payload;
    },
    setLuckyTimeResults: (s, a: PayloadAction<ResultItem[]>) => {
      s.luckyTimeResults = a.payload;
    },

    /* ── Clear All Bets (refund) ───────────────────────────────────────── */
    clearBets: (s) => {
      if (s.totalBet > 0) s.balance += s.totalBet;
      s.bets = {};
      s.totalBet = 0;
      // keep lastBets for REBET
    },

    /* ── Win Pop manual controls ───────────────────────────────────────── */
    openWinPop: (
      s,
      a: PayloadAction<{
        item: ResultItem;
        winAmount: number;
        betAmount: number;
      }>
    ) => {
      s.winToast = { open: true, ...a.payload };
    },
    closeWinPop: (s) => {
      s.winToast.open = false;
      s.winToast.item = null;
      s.winToast.winAmount = 0;
      s.winToast.betAmount = 0;
    },

    /* ── Settle Round ─────────────────────────────────────────────────── */
    settleRound: (s, a: PayloadAction<ResultItem>) => {
      const res = a.payload;
      const stake = s.bets[res.id] || 0;
      const winAmount = Math.floor(stake * res.multi);

      if (winAmount > 0) s.balance += winAmount;

      s.last = res;
      s.luckyTimeResults = [res];
      s.history.unshift({
        spinId: s.spinId,
        ts: Date.now(),
        item: res,
        betAmount: stake,
        winAmount,
      });

      s.winToast =
        winAmount > 0
          ? { open: true, item: res, winAmount, betAmount: stake }
          : { open: false, item: null, winAmount: 0, betAmount: 0 };

      s.bets = {};
      s.totalBet = 0;
      s.isSpinning = false;
    },

    /* ── Boosts (optional visuals) ─────────────────────────────────────── */
    setSpinBoosts: (s, a: PayloadAction<Boost[]>) => {
      s.activeBoosts = a.payload;
    },
    clearSpinBoosts: (s) => {
      s.activeBoosts = [];
    },
  },
});

/* ── Exports ────────────────────────────────────────────────────────────── */
export const {
  openLuckyTime,
  closeLuckyTime,
  setBalance,
  deposit,
  withdraw,
  selectChip,
  placeBetOn,
  rebet,
  clearBets,
  requestSpin,
  startSpinning,
  stopSpinning,
  setWinKey,
  setLuckyTimeResults,
  openWinPop, // ⬅️ added
  closeWinPop, // ⬅️ added
  settleRound,
  setSpinBoosts,
  clearSpinBoosts,
} = luckyTimeSlice.actions;

export default luckyTimeSlice.reducer;
