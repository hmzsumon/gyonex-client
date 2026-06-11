/* ──────────────────────────────────────────────────────────────────────────
   DemoDepositStatus — Accepted screen (green dot + amount)
────────────────────────────────────────────────────────────────────────── */
"use client";

export default function DemoDepositStatus({
  amount,
  currency,
  onClose,
}: {
  amount: number;
  currency: string;
  onClose: () => void;
}) {
  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="text-2xl leading-none">
          ✕
        </button>
        <h1 className="text-3xl font-bold mx-auto -translate-x-3">
          Deposit Status
        </h1>
        <div />
      </div>

      <div className="mt-8 text-center">
        <div className="text-2xl font-semibold">
          Deposit is in Your Account!
        </div>
        <div className="text-neutral-400 mt-2">
          Your deposit is accepted. You can start trading now.
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
        <div className="flex items-center justify-between py-2">
          <div className="text-neutral-400">Status</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            <span className="text-green-400">Accepted</span>
          </div>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-neutral-800">
          <div className="text-neutral-400">Transaction amount</div>
          <div className="font-semibold">
            {amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {currency}
          </div>
        </div>
      </div>
    </div>
  );
}
