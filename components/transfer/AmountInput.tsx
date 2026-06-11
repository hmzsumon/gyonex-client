"use client";

import { useEffect, useMemo, useState } from "react";

export default function AmountInput({
  currency = "USD",
  value,
  onChange,
  max,
  min,
}: {
  currency?: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  min?: number;
}) {
  const [txt, setTxt] = useState(String(value || ""));

  useEffect(() => setTxt(String(value || "")), [value]);

  const n = Number(txt);
  const decimalsInvalid = txt.includes(".") && txt.split(".")[1].length > 2;

  const errorMsg = useMemo(() => {
    if (!txt) return "Amount required";
    if (!Number.isFinite(n)) return "Enter a valid number";
    if (n <= 0) return "Amount must be greater than 0";
    if (typeof min === "number" && n < min)
      return `Minimum amount is ${currency} ${min.toFixed(2)}`;
    if (typeof max === "number" && n > max)
      return `Exceeds available balance (${currency} ${max.toFixed(2)})`;
    if (decimalsInvalid) return "Keep up to 2 decimals";
    return null;
  }, [txt, n, min, max, currency, decimalsInvalid]);

  const invalid = Boolean(errorMsg);

  return (
    <div>
      <div className="mb-1 text-sm text-neutral-300">Transfer amount</div>
      <div
        className={[
          "flex rounded-lg bg-neutral-900 border overflow-hidden",
          invalid ? "border-red-500" : "border-neutral-800",
        ].join(" ")}
      >
        <span className="px-3 py-2 text-neutral-400 text-sm">{currency}</span>
        <input
          inputMode="decimal"
          value={txt}
          onChange={(e) => setTxt(e.target.value.replace(/[^0-9.]/g, ""))}
          onBlur={() => onChange(Number(Number(txt).toFixed(2)) || 0)}
          placeholder="Keep up to 2 decimal"
          className="flex-1 bg-transparent px-3 py-2 outline-none"
          aria-invalid={invalid}
          aria-describedby={invalid ? "amount-error" : undefined}
        />
      </div>

      {/* ✅ নির্দিষ্ট কারণ-ভিত্তিক এরর মেসেজ */}
      {invalid && (
        <div id="amount-error" className="mt-1 text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      {/* ℹ️ সহায়ক হিন্ট (valid থাকলেও দেখাতে পারেন) */}
      {(typeof min === "number" || typeof max === "number") && !invalid && (
        <div className="mt-1 text-xs text-neutral-500">
          {typeof min === "number" && typeof max === "number"
            ? `Allowed range: ${currency} ${min.toFixed(
                2
              )} – ${currency} ${max.toFixed(2)}`
            : typeof min === "number"
            ? `Minimum: ${currency} ${min.toFixed(2)}`
            : `Maximum: ${currency} ${max!.toFixed(2)}`}
        </div>
      )}
    </div>
  );
}
