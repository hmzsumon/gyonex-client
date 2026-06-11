// components/positions/utils.ts
/* ── tiny numeric helpers for UI ─────────────────────────── */
export const num = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};
export const fmt = (v: number, d = 2) =>
  Number.isFinite(v) ? v.toFixed(d) : "–";
