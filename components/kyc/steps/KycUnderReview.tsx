/* ── 08: Under Review screen ───────────────────────────────── */
"use client";

import { resetKyc } from "@/redux/features/kyc/kycSlice";
import { useDispatch } from "react-redux";

export default function KycUnderReview() {
  const d = useDispatch();
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-yellow-400/10 text-yellow-400">
        <svg viewBox="0 0 24 24" className="h-8 w-8">
          <path
            d="M12 7v5l3 3"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold">Your documents are under review</h1>
      <p className="text-neutral-400">
        This process usually takes from 3 to 7 minutes but might last up to 24
        hours in special cases. In the meantime you are allowed to deposit,
        trade and withdraw your profit.
      </p>

      <button
        onClick={() => d(resetKyc())}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500"
      >
        Deposit
      </button>
    </div>
  );
}
