// utils/num.ts
/* ───────────────────────────────────────────
   small numeric helpers
   - num: safe Number()
   - fmt: fixed decimals or "–"
─────────────────────────────────────────── */

export const num = (v: any): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

export const fmt = (v: any, d = 2): string => {
  const n = num(v);
  return Number.isFinite(n) ? n.toFixed(d) : "–";
};
