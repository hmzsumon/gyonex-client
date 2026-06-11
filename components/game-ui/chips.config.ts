// components/lucky-time/chips.config.ts

/* ── Types ──────────────────────────────────────────────────────────────── */
export type ChipDef = {
  key: string;
  amount: number; // denomination (10/50/100/500/1000/…)
  size?: number;
  baseColor: string;
  faceColor: string;
  stripeColor: string;
  textColor: string;
};

/* ── Default Chip Set ──────────────────────────────────────────────────── */
export const CHIPS: ChipDef[] = [
  {
    key: "black",
    amount: 10,
    size: 50,
    baseColor: "#191919",
    faceColor: "#111827",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    key: "blue",
    amount: 50,
    size: 50,
    baseColor: "#2563EB",
    faceColor: "#1D4ED8",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    key: "red",
    amount: 100,
    size: 50,
    baseColor: "#EF4444",
    faceColor: "#DC2626",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    key: "green",
    amount: 500,
    size: 50,
    baseColor: "#22C55E",
    faceColor: "#16A34A",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    key: "purple",
    amount: 1000,
    size: 50,
    baseColor: "#7C3AED",
    faceColor: "#6D28D9",
    stripeColor: "#ffffff",
    textColor: "#ffffff",
  },
];

/* ── Derived Maps ──────────────────────────────────────────────────────── */
export const CHIP_STYLE: Record<number, { color: string; stripe: string }> =
  Object.fromEntries(
    CHIPS.map((c) => [c.amount, { color: c.baseColor, stripe: c.stripeColor }])
  );

export const DENOMS_DESC: number[] = Array.from(
  new Set(CHIPS.map((c) => c.amount))
).sort((a, b) => b - a); // high → low
