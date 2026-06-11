/* ──────────────────────────────────────────────────────────────────────────
   DemoDeposit — amount field + Continue (Exness-like)
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useDemoTopUpMutation } from "@/redux/features/account/accountApi";
import { useState } from "react";

export default function DemoDeposit({
  accountId,
  currency,
  onSuccess,
  onBack,
}: {
  accountId: string;
  currency: "USD" | "BDT";
  onSuccess: (r: { amount: number; currency: string }) => void;
  onBack: () => void;
}) {
  const [amountStr, setAmountStr] = useState("0");
  const [demoTopUp, { isLoading }] = useDemoTopUpMutation();

  const amount = Number(amountStr.replace(/,/g, ""));
  const ok = !isNaN(amount) && amount > 0 && amount <= 1e10;

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-2xl leading-none">
          ‹
        </button>
        <h1 className="text-3xl font-bold">Deposit</h1>
      </div>

      <div className="mt-12 text-center text-neutral-400">
        Enter deposit amount
      </div>

      {/* Amount row */}
      <div className="mt-6">
        <div className="flex items-end justify-between text-2xl">
          <input
            inputMode="decimal"
            className="bg-transparent outline-none w-full text-5xl font-semibold tracking-wide"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
          />
          <div className="text-neutral-400 ml-2">{currency}</div>
        </div>
        <div className="mt-2 h-px bg-neutral-600" />
        <div className="mt-3 text-sm text-neutral-500">
          0.00 – 10,000,000,000.00 {currency}
        </div>
      </div>

      {/* Continue */}
      <div className="fixed left-0 right-0 bottom-6 max-w-md mx-auto px-4">
        <button
          disabled={!ok || isLoading}
          className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold disabled:opacity-50"
          onClick={async () => {
            const res = await demoTopUp({ id: accountId, amount }).unwrap();
            onSuccess({
              amount: res.receipt.amount,
              currency: res.receipt.currency,
            });
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
