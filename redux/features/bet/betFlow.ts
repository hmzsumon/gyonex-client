// redux/features/bet/betFlow.ts
/* ── Imports ───────────────────────────────────────────────────────────── */
import { AppDispatch, RootState } from "../../store"; // আপনার স্টোর পাথ
import { wheelGameApi } from "../game/wheelGameApi"; // আপনার বিদ্যমান RTK Query API
import {
  applyPending,
  confirmPending,
  revertPending,
  selectDisplayBalance,
} from "../wallet/walletSlice";

/* ── Types ─────────────────────────────────────────────────────────────── */
export type BetItem = { segmentId: number; amount: number };

export type PlaceBetArgs = {
  gameKey: string;
  bets: BetItem[];
  totalStake: number;
};

export type PlaceBetResult = {
  roundId: string;
  stakeTxId: string;
  totalStake: number;
};

/** ✅ জেনেরিক place-bet: অপ্টিমিস্টিক ডেবিট + API + কনফার্ম/রিভার্ট */
export const placeBetAndHold = (args: PlaceBetArgs) => {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<PlaceBetResult> => {
    const { gameKey, bets, totalStake } = args;

    // পর্যাপ্ত টাকা আছে কিনা—UI-ডিসপ্লে ব্যালান্স দিয়ে চেক (pending-aware)
    const displayBal = selectDisplayBalance(getState());
    if (displayBal < totalStake) {
      throw new Error("Insufficient balance");
    }

    const stakeTxId = `stake-${gameKey}-${Date.now()}`;

    // 1) অপ্টিমিস্টিক ডেবিট (pending)
    dispatch(
      applyPending({
        id: stakeTxId,
        amount: -Math.abs(totalStake),
        reason: "stake",
      })
    );

    try {
      // 2) API: place-bet
      const res = await dispatch(
        wheelGameApi.endpoints.placeLucBet.initiate({
          gameKey,
          bets,
        })
      ).unwrap();

      const roundId = res?.roundId;
      if (!roundId) {
        // ব্যর্থ: রিভার্ট
        dispatch(revertPending({ id: stakeTxId }));
        throw new Error("Failed to open round");
      }

      // 3) সফল: স্টেক কনফার্ম (pending থেকে বাদ)
      dispatch(confirmPending({ id: stakeTxId }));

      return { roundId, stakeTxId, totalStake };
    } catch (err) {
      // নেটওয়ার্ক/সার্ভার এরর → রিভার্ট
      dispatch(revertPending({ id: stakeTxId }));
      throw err;
    }
  };
};

export type SettleArgs = {
  gameKey: string;
  roundId: string;
  winningSegmentId: number;
  finalMulti?: number;
};

/** ✅ জেনেরিক settle: API + (server payout) → অপ্টিমিস্টিক ক্রেডিট */
export const settleAndPayout = (args: SettleArgs) => {
  return async (dispatch: AppDispatch): Promise<{ payout: number }> => {
    const { gameKey, ...rest } = args;

    const res = await dispatch(
      wheelGameApi.endpoints.settleLucBet.initiate({
        gameKey,
        ...rest,
      })
    ).unwrap();

    const payout = Math.max(0, Number(res?.payout || 0));

    if (payout > 0) {
      const payoutTxId = `payout-${gameKey}-${Date.now()}`;
      dispatch(
        applyPending({
          id: payoutTxId,
          amount: payout,
          reason: "payout",
        })
      );
      // সার্ভার যেহেতু authoritative payout দিল, আমরা সাথে সাথেই confirm করতে পারি
      dispatch(confirmPending({ id: payoutTxId }));
    }

    return { payout };
  };
};
