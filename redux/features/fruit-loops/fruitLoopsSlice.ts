/* ── Imports ───────────────────────────────────────────────────────────── */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ── Types ────────────────────────────────────────────────────────────── */
export type PotKey = string | number;

export type ResultItem = {
  id: number;
  name: string;
  emoji: string;
  angle: number;
  multi: number;
};

export type HistoryItem = {
  spinId: number;
  ts: number;
  winKey: string;
  potId: PotKey;
  betAmount: number;
  winAmount: number;
};

export type WinToast = {
  open: boolean;
  potId: PotKey | null;
  winAmount: number;
  betAmount: number;
};

/* ── State ────────────────────────────────────────────────────────────── */
type FruitLoopsState = {
  isOpen: boolean;
  isSpinning: boolean;

  // ⚠️ লোকাল balance আগে ছিল; এখন UI এ এটা ব্যাবহার করবেন না
  // চাইলে রেখে দিন, তবে UI-তে দেখাবেন না—wallet থেকে দেখাবেন
  balance: number;

  selectedChip: number | null;
  bets: Record<string, number>;
  lastBets: Record<string, number>;
  totalBet: number;

  minBetAmount?: number;
  maxBetAmount?: number;

  spinId: number;
  winKey?: string;
  history: HistoryItem[];
  winToast: WinToast;

  lastError?: string | null;

  fruitLoopResults?: ResultItem[];

  soundOn: boolean;
};

const initialState: FruitLoopsState = {
  isOpen: false,
  isSpinning: false,

  balance: 10_000, // ← থাকলেও UI তে ব্যবহার করবেন না
  selectedChip: null,

  bets: {},
  lastBets: {},
  totalBet: 0,

  minBetAmount: 1,
  maxBetAmount: undefined,

  fruitLoopResults: [],

  spinId: 0,
  winKey: undefined,
  history: [],
  winToast: { open: false, potId: null, winAmount: 0, betAmount: 0 },

  lastError: null,

  soundOn: true,
};

/* ── Helpers ──────────────────────────────────────────────────────────── */
const add = (a = 0, b = 0) => a + b;

/* ── Rule: limit to 2 distinct pots per round ─────────────────────────── */
const MAX_ACTIVE_POTS = 2;

/* ── Slice ────────────────────────────────────────────────────────────── */
const fruitLoopsSlice = createSlice({
  name: "fruitLoops",
  initialState,
  reducers: {
    /* ── UI open/close ─────────────────────────────────────────────────── */
    openFruitLoopGame: (s) => {
      s.isOpen = true;
    },
    closeFruitLoopGame: (s) => {
      s.isOpen = false;
    },

    /* ── Chip select ─────────────────────────────────────────────────── */
    selectChip: (s, a: PayloadAction<number | null>) => {
      s.selectedChip = a.payload ?? null;
    },

    /* ── Place Bet (2-pot limit; ❌ লোকাল balance-চেক কাটা) ──────────── */
    placeBetOn: (s, a: PayloadAction<{ itemId: number; amount?: number }>) => {
      if (s.isSpinning) return;

      const amt = (a.payload.amount ?? s.selectedChip ?? 0) | 0;
      if (amt <= 0) return;
      if (s.minBetAmount && amt < s.minBetAmount) return;
      if (typeof s.maxBetAmount === "number" && amt > s.maxBetAmount) return;

      const id = a.payload.itemId;

      // ACTIVE pots
      const activeIds = Object.keys(s.bets).filter(
        (k) => (s.bets as any)[k] > 0
      );
      const alreadyActive = (s.bets as any)[id] > 0;

      // 2-pot rule
      if (!alreadyActive && activeIds.length >= 2) return;

      // ✅ শুধু bets/totalBet আপডেট, লোকাল balance না
      s.bets[id] = (s.bets[id] ?? 0) + amt;
      s.totalBet += amt;
    },

    /* ── Clear Bets (refund UI-reserve only) ─────────────────────────── */
    clearBets: (s) => {
      s.bets = {};
      s.totalBet = 0;
      s.lastError = null;
    },

    /* ── Rebet (respect 2-pot limit) ─────────────────────────────────── */
    rebet: (s) => {
      if (s.isSpinning) return;
      const entries = Object.entries(s.lastBets || {}).filter(
        ([, amt]) => Number(amt) > 0
      );
      if (!entries.length) return;

      let used = 0;
      for (const [id, amtRaw] of entries) {
        if (used >= MAX_ACTIVE_POTS) break;
        const amt = Number(amtRaw) | 0;
        if (amt <= 0) continue;

        const hadHere = (s.bets[id] ?? 0) > 0;
        if (!hadHere) used += 1;

        s.bets[id] = add(s.bets[id], amt);
        s.totalBet += amt;
      }
      s.lastError = null;
    },

    /* ── Spin lifecycle ──────────────────────────────────────────────── */
    requestSpin: (s) => {
      s.spinId += 1;
      s.lastError = null;
    },
    startSpinning: (s) => {
      if (s.totalBet > 0) {
        s.lastBets = { ...s.bets };
        s.isSpinning = true;
      }
    },
    stopSpinning: (s) => {
      s.isSpinning = false;
    },

    /* ── Legacy/Display ───────────────────────────────────────────────── */
    setWinKey: (s, a: PayloadAction<string>) => {
      s.winKey = a.payload;
    },

    /* ── Settle (UI) ─────────────────────────────────────────────────── */
    settleRound: (s, a: PayloadAction<{ potId: PotKey; multi: number }>) => {
      const { potId, multi } = a.payload;
      const id = String(potId);

      const stake = s.bets[id] || 0;
      const winAmount = Math.floor(stake * (multi || 0));

      const winKey = `${s.spinId}-${Date.now()}`;
      s.winKey = winKey;

      s.history.unshift({
        spinId: s.spinId,
        ts: Date.now(),
        winKey,
        potId: id,
        betAmount: stake,
        winAmount,
      });

      s.winToast =
        winAmount > 0
          ? { open: true, potId: id, winAmount, betAmount: stake }
          : { open: false, potId: null, winAmount: 0, betAmount: 0 };

      s.bets = {};
      s.totalBet = 0;
      s.isSpinning = false;
    },

    /* ── Win toast ───────────────────────────────────────────────────── */
    closeWinPop: (s) => {
      s.winToast.open = false;
    },

    /* ── Results ─────────────────────────────────────────────────────── */
    setFruitLoopsResults: (s, a: PayloadAction<ResultItem[]>) => {
      s.fruitLoopResults = a.payload;
    },

    /* ── Sound toggle ─────────────────────────────────────────────────── */
    toggleSound: (s) => {
      s.soundOn = !s.soundOn;
    },
    setSound: (s, a: PayloadAction<boolean>) => {
      s.soundOn = !!a.payload;
    },
  },
});

export const {
  selectChip,
  placeBetOn,
  clearBets,
  rebet,
  requestSpin,
  startSpinning,
  stopSpinning,
  settleRound,
  closeWinPop,
  setWinKey,
  setFruitLoopsResults,
  toggleSound,
  setSound,
} = fruitLoopsSlice.actions;

export default fruitLoopsSlice.reducer;
