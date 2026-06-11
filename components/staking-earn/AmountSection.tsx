"use client";

type Props = {
  amount: string;
  onAmountChange: (v: string) => void;

  assetSymbol: string;

  balance: number; // ✅ max
  minAmount?: number; // ✅ min (default 1)

  minText?: string;
  availableText?: string;

  onMax?: () => void;
};

const MAX_DECIMALS = 8;

// ✅ typing-friendly sanitize (NO clamp here)
const sanitizeDecimal = (raw: string) => {
  let s = String(raw ?? "");

  // comma -> dot
  s = s.replace(/,/g, ".");

  // keep digits and dot only
  s = s.replace(/[^\d.]/g, "");

  // if starts with dot => "0."
  if (s.startsWith(".")) s = "0" + s;

  // keep only first dot
  const dot = s.indexOf(".");
  if (dot !== -1) {
    const before = s.slice(0, dot + 1);
    const after = s.slice(dot + 1).replace(/\./g, "");
    s = before + after;

    // limit decimals
    const [i, d = ""] = s.split(".");
    s = `${i}.${d.slice(0, MAX_DECIMALS)}`;
  }

  return s;
};

const AmountSection = ({
  amount,
  onAmountChange,
  assetSymbol,
  balance,
  minAmount = 1,
  minText,
  availableText,
  onMax,
}: Props) => {
  // ✅ onChange: only sanitize; allow "", "0", "0.", "0.0" while typing
  const onChangeValue = (v: string) => {
    onAmountChange(sanitizeDecimal(v));
  };

  // ✅ onBlur: clamp to min/max when user finishes typing
  const onBlurClamp = () => {
    if (amount.trim() === "") return;

    const num = Number(amount);
    if (!Number.isFinite(num)) return;

    let next = num;

    // min clamp (only if >0)
    if (next > 0 && next < minAmount) next = minAmount;

    // max clamp
    if (next > balance) next = balance;

    // keep max decimals
    const fixed = Number(next.toFixed(MAX_DECIMALS));
    onAmountChange(String(fixed));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-sm">Amount</div>
      </div>

      <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center justify-between">
        <input
          type="text" // ✅ important for backspace/typing states
          inputMode="decimal"
          value={amount}
          onChange={(e) => onChangeValue(e.target.value)}
          onBlur={onBlurClamp}
          placeholder={minText ?? "Minimum 1"}
          className="bg-transparent outline-none w-full text-base placeholder:text-white/25"
          autoComplete="off"
        />

        <div className="flex items-center gap-3 ml-4 shrink-0">
          <div className="text-sm text-white/70">{assetSymbol}</div>
          <button
            type="button"
            onClick={onMax}
            className="text-sm font-semibold text-[#f0c34d] hover:opacity-90"
          >
            Max
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="text-white/60">
          {availableText ?? `Available: ${balance} ${assetSymbol}`}
        </div>
        <div className="text-[11px] text-white/35">
          Min {minAmount} • Max {balance}
        </div>
      </div>
    </div>
  );
};

export default AmountSection;
