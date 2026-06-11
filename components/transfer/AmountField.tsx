/* ────────── AmountField (receive) ────────── */
"use client";
import { formatBalance } from "@/lib/functions";

export default function AmountField({
  value,
  onChange,
  onClear,
  disabled,
  fee,
  available,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  disabled?: boolean;
  fee: number;
  available: number;
  error?: string;
}) {
  const num = Number(value) || 0;

  return (
    <div>
      <div className="relative">
        <input
          type="number"
          className="w-full rounded-lg border border-blue-gray-800 bg-transparent px-2 py-2 text-sm placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter Amount"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {!!value && !disabled && (
          <button
            type="button"
            aria-label="Clear"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-red-700 px-2 py-0.5 text-xs text-red-400 hover:bg-red-900/30"
          >
            X
          </button>
        )}
      </div>

      <div className="mt-1 ml-1 flex flex-col gap-1">
        <div className="flex justify-between">
          <small className="text-xs text-green-500">
            {num > 0 ? (
              <span>5% fee: {formatBalance(fee)} USDT</span>
            ) : (
              <span>(5% fee will be charged.)</span>
            )}
          </small>
          <small className="text-xs text-green-500">
            Balance: {formatBalance(available)} USDT
          </small>
        </div>
        {!!error && <small className="font-bold text-red-500">{error}</small>}
      </div>
    </div>
  );
}
