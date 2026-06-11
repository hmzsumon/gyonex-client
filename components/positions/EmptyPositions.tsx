// components/positions/EmptyPositions.tsx
"use client";

import NoOpenCard from "../ai/positions/NoOpenCard";

/* ── empty-state card ────────────────────────────────────── */

export default function EmptyPositions() {
  return (
    <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 text-center">
      <div className="text-neutral-300 mb-2 font-medium">No open positions</div>
      <NoOpenCard />
    </div>
  );
}
