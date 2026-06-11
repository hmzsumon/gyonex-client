// redux/features/lucky-time/luckyTimeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ── Types: ফলাফল/হিস্ট্রি ──────────────────────────────────────────────── */
export type ResultItem = {
  name: string;
  emoji: string;
  angle: number;
  multi: number;
  id: number; // segment id
};

export type CrazyLionBoardResult = {
  spinId: number;
  ts: number; // epoch ms
  item: ResultItem; // জেতা সেগমেন্ট
  betAmount: number; // সেই সেগমেন্টে মোট বেট
  winAmount: number; // bet * multi
};

// ── Win Pop টোস্ট স্টেট ─────────────────────────────────────────────────
export type WinToast = {
  open: boolean;
  item: ResultItem | null;
  winAmount: number;
  betAmount: number;
};

/* ── Types: বুস্ট (যদি Wheel এ থাকে) ──────────────────────────────────── */
export type Boost = {
  id: string;
  itemId: number;
  value: number; // 5,10,15,50,80...
  expiresAt: number;
};

/* ── State ────────────────────────────────────────────────────────────────
   - balance: ইউজার ব্যালান্স
   - selectedChip: বর্তমান চিপ ভ্যালু
   - bets: প্রতি সেগমেন্টে প্লেসড বেট (সময়ের আগেই ব্যালান্স থেকে কাটা)
   - totalBet: সব বেটের সমষ্টি
---------------------------------------------------------------------------*/
interface CrazyLionState {
  isOpen: boolean;
  isSpinning: boolean;

  balance: number;
  selectedChip: number | null;
  bets: Record<number, number>;
  totalBet: number;

  minBetAmount?: number;
  maxBetAmount?: number;

  crazyLionResults?: ResultItem[];
  winKey?: string;
  spinId: number;
  durationMs: number;
  forceIndex?: number | null;
  results: string[];
  last?: ResultItem | null;

  // Boosts (optional visual)
  activeBoosts: Boost[];

  // History (optional)
  history: CrazyLionBoardResult[];

  // Win pop
  winToast: WinToast;
}

/* ── Initial State ─────────────────────────────────────────────────────── */
const initialState: CrazyLionState = {
  isOpen: false,
  isSpinning: false,

  balance: 0, // demo starting balance
  selectedChip: null,
  bets: {},
  totalBet: 0,

  minBetAmount: 1,
  maxBetAmount: 1000,

  crazyLionResults: [],
  winKey: undefined,
  spinId: 0,
  durationMs: 6000,
  forceIndex: null,
  results: [],
  last: null,

  activeBoosts: [],
  history: [],

  // Win pop ইনিশিয়াল
  winToast: { open: false, item: null, winAmount: 0, betAmount: 0 },
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
const add = (a = 0, b = 0) => a + b;

/* ── Slice ──────────────────────────────────────────────────────────────── */
const crazyLionSlice = createSlice({
  name: "crazyLion",
  initialState,
  reducers: {
    /* ── UI open/close ─────────────────────────────────────────────────── */
    openCrazyLion: (s) => {
      s.isOpen = true;
    },
    closeCrazyLion: (s) => {
      s.isOpen = false;
    },

    /* ── Balance controls (optional) ───────────────────────────────────── */
    setBalance: (s, a: PayloadAction<number>) => {
      s.balance = Math.max(0, a.payload | 0);
    },
    deposit: (s, a: PayloadAction<number>) => {
      s.balance += Math.max(0, a.payload | 0);
    },
    withdraw: (s, a: PayloadAction<number>) => {
      s.balance = Math.max(0, s.balance - Math.max(0, a.payload | 0));
    },

    /* ── Chip select ───────────────────────────────────────────────────── */
    selectChip: (s, a: PayloadAction<number | null>) => {
      s.selectedChip = a.payload ?? null;
    },

    /* ── Place bet on a segment (deducts balance immediately) ────────────
       - spin চলাকালে বেট নেয় না; ব্যালান্স/লিমিট চেক
    --------------------------------------------------------------------- */
    placeBetOn: (s, a: PayloadAction<{ itemId: number; amount?: number }>) => {
      if (s.isSpinning) return; // চলতি স্পিনে ব্লক
      const amt = (a.payload.amount ?? s.selectedChip ?? 0) | 0;
      if (amt <= 0) return;
      if (s.minBetAmount && amt < s.minBetAmount) return;
      if (s.maxBetAmount && amt > s.maxBetAmount) return;
      if (s.balance < amt) return;

      s.balance -= amt; // ইমিডিয়েট ডেবিট
      s.bets[a.payload.itemId] = add(s.bets[a.payload.itemId], amt);
      s.totalBet += amt;
    },

    /* ── Clear all bets (refund) ──────────────────────────────────────── */
    clearBets: (s) => {
      if (s.totalBet > 0) s.balance += s.totalBet; // সব টাকা রিফান্ড
      s.bets = {};
      s.totalBet = 0;
    },

    /* ── Spin flow (compat + gating) ───────────────────────────────────── */
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
      if (s.totalBet > 0) s.isSpinning = true;
    },
    stopSpinning: (s) => {
      s.isSpinning = false;
    },

    /* ── Win-set (legacy) ─────────────────────────────────────────────── */
    setWinKey: (s, a: PayloadAction<string>) => {
      s.winKey = a.payload;
    },

    setCrazyLionResults: (s, a: PayloadAction<ResultItem[]>) => {
      s.crazyLionResults = a.payload;
    },

    /* ── Win Pop manual controls (optional) ────────────────────────────── */
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
    },

    /* ── Settle round: win/loss → balance update, history, clear bets ───
       - payload: ResultItem (final multi already includes boost if any)
    --------------------------------------------------------------------- */
    settleRound: (s, a: PayloadAction<ResultItem>) => {
      const res = a.payload;
      const stake = s.bets[res.id] || 0;
      const winAmount = Math.floor(stake * res.multi);

      // Update balance by winnings (stake already deducted during placeBet)
      if (winAmount > 0) s.balance += winAmount;

      // Save "last" & list used by UI badges
      s.last = res;
      s.crazyLionResults = [res];

      // History push
      s.history.unshift({
        spinId: s.spinId,
        ts: Date.now(),
        item: res,
        betAmount: stake,
        winAmount,
      });

      // ── Win Pop: জিতলে দেখাও, নাহলে বন্ধ ─────────────────────────────
      if (winAmount > 0) {
        s.winToast = {
          open: true,
          item: res,
          winAmount,
          betAmount: stake,
        };
      } else {
        s.winToast.open = false;
        s.winToast.item = null;
        s.winToast.winAmount = 0;
        s.winToast.betAmount = 0;
      }

      // Consume bets
      s.bets = {};
      s.totalBet = 0;

      // end spinning
      s.isSpinning = false;
    },

    /* ── Boosts for a spin (optional, visual in Board & payout in Wheel) ─ */
    setSpinBoosts: (s, a: PayloadAction<Boost[]>) => {
      s.activeBoosts = a.payload;
    },
    clearSpinBoosts: (s) => {
      s.activeBoosts = [];
    },
  },
});

export const {
  openCrazyLion,
  closeCrazyLion,
  setBalance,
  deposit,
  withdraw,
  selectChip,
  placeBetOn,
  clearBets,
  requestSpin,
  startSpinning,
  stopSpinning,
  setWinKey,
  setCrazyLionResults,
  // NEW:
  openWinPop,
  closeWinPop,
  settleRound,
  setSpinBoosts,
  clearSpinBoosts,
} = crazyLionSlice.actions;

export default crazyLionSlice.reducer;
