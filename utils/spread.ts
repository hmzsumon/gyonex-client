// utils/spread.ts
// ───────────────────────────────────────────────────────────
// Fixed spread utilities (per-mille ভিত্তিক) + target USD helper
// ───────────────────────────────────────────────────────────

/** নির্দিষ্ট টিক সাইজে রাউন্ড */
export function roundToTick(n: number, tick = 0.01) {
  if (!Number.isFinite(n) || !Number.isFinite(tick) || tick <= 0) return n;
  return Math.round(n / tick) * tick;
}

/** mid + per-mille (‰) → bid/ask তৈরি (symmetry রাখি: ±spread/2) */
export function applyFixedSpread(
  mid: number,
  opts: { perMille: number; tick?: number }
) {
  const { perMille, tick = 0.01 } = opts;
  if (!Number.isFinite(mid) || mid <= 0 || !Number.isFinite(perMille))
    return { bid: NaN, ask: NaN, spreadAbs: NaN, spreadPm: perMille || 0 };

  const s = (mid * perMille) / 1000; // absolute spread in price
  const half = s / 2;
  const bid = roundToTick(mid - half, tick);
  const ask = roundToTick(mid + half, tick);
  return { bid, ask, spreadAbs: ask - bid, spreadPm: perMille };
}

/** target USD spread → per-mille (ceil করে যাতে সবসময় ≥ target থাকে) */
export function perMilleFromTargetUsd(
  mid: number,
  targetUsd: number,
  stepPm = 0.01
) {
  if (!Number.isFinite(mid) || mid <= 0) return 0;
  const raw = (targetUsd / mid) * 1000; // per-mille
  // step অনুযায়ী সিল, যাতে স্প্রেড target–এর ওপরে থাকে
  return Math.ceil(raw / stepPm) * stepPm;
}
