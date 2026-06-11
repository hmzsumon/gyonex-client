/* ── Component: TurnoverNotice ──────────────────────────────────────────── */
"use client";

export default function TurnoverNotice({
  remaining,
  onOk,
}: {
  remaining: number;
  onOk: () => void;
}) {
  if (remaining <= 0) return null;
  return (
    <div className="mt-6 rounded-xl border border-[#00493B] bg-[#031A15] p-4">
      <p className="text-center text-yellow-300">
        Withdrawal turnover requirements
      </p>
      <p className="mt-1 text-center text-red-400">
        Please complete the required turnover for withdrawal.
      </p>
      <div className="mt-3 overflow-hidden rounded border border-[#00493B]">
        <div className="grid grid-cols-2 bg-[#08251F] text-sm">
          <div className="border-r border-[#00493B] px-3 py-2">Game type</div>
          <div className="px-3 py-2">Remaining turnover</div>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <div className="border-r border-[#00493B] px-3 py-2">General</div>
          <div className="px-3 py-2 text-red-400">{remaining.toFixed(2)}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onOk}
        className="mt-4 w-full rounded-lg bg-red-600 py-3 font-medium hover:bg-red-700"
      >
        OK
      </button>
    </div>
  );
}
