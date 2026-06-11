/* ────────── comments ────────── */
/* Calmer progress bar: thinner track, softer fill, smoother rounding. */
/* ────────── comments ────────── */

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="w-full rounded-full bg-white/7 h-[6px]"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
    >
      <div
        className="h-[6px] rounded-full bg-gradient-to-r from-blue-500/85 to-indigo-500/85"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
