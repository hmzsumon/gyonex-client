// redux/features/wallet/walletSlice.ts
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

/* ── Types ─────────────────────────────────────────────────────────────── */
export type WalletTx = {
  id: string;
  amount: number; // debit = negative, credit = positive
  reason?: string;
  status: "pending" | "confirmed" | "reverted";
  ts: number;
};

type WalletState = {
  serverBalance: number; // authoritative balance from backend
  pending: Record<string, WalletTx>;
  lastSyncAt?: number;
};

const initialState: WalletState = {
  serverBalance: 0,
  pending: {},
};

/* ── Helpers ──────────────────────────────────────────────────────────── */
export const sumPending = (pending: Record<string, WalletTx>) =>
  Object.values(pending)
    .filter((t) => t.status === "pending")
    .reduce((a, t) => a + t.amount, 0);

/* ── Slice ────────────────────────────────────────────────────────────── */
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    /* সার্ভার থেকে ব্যালান্স রিফ্রেশ */
    setServerBalance: (
      s,
      a: PayloadAction<{ balance: number; at?: number }>
    ) => {
      s.serverBalance = Math.max(0, Number(a.payload.balance) || 0);
      s.lastSyncAt = a.payload.at ?? Date.now();
    },

    /* optimistic apply (stake debit / win credit) */
    applyPending: (
      s,
      a: PayloadAction<{ id?: string; amount: number; reason?: string }>
    ) => {
      const id = a.payload.id ?? nanoid();
      s.pending[id] = {
        id,
        amount: Number(a.payload.amount) || 0,
        reason: a.payload.reason,
        status: "pending",
        ts: Date.now(),
      };
    },

    /* confirm (API success) */
    confirmPending: (s, a: PayloadAction<{ id: string }>) => {
      const t = s.pending[a.payload.id];
      if (t && t.status === "pending") {
        t.status = "confirmed";
        // confirmed হলে serverBalance-এ মুভ করে দাও
        s.serverBalance = Math.max(0, s.serverBalance + t.amount);
        delete s.pending[a.payload.id];
      }
    },

    /* revert (API fail) */
    revertPending: (s, a: PayloadAction<{ id: string }>) => {
      const t = s.pending[a.payload.id];
      if (t && t.status === "pending") {
        t.status = "reverted";
        delete s.pending[a.payload.id];
      }
    },

    /* সব pending ক্লিয়ার (edge-case) */
    clearAllPending: (s) => {
      s.pending = {};
    },
  },
});

export const {
  setServerBalance,
  applyPending,
  confirmPending,
  revertPending,
  clearAllPending,
} = walletSlice.actions;

export default walletSlice.reducer;

/* ── Selectors ────────────────────────────────────────────────────────── */
export const selectWallet = (s: any) => s.wallet as WalletState;
export const selectDisplayBalance = (s: any) => {
  const w = s.wallet as WalletState;
  return Math.max(0, w.serverBalance + sumPending(w.pending));
};
