/* ================================================
   FILE: app/components/steps/PlanCarousel.tsx
   DESC: Multi-card slider (Step 1)
================================================= */
"use client";

import type { IAiPlan } from "@/redux/features/ai-account/ai-accountApi";
import { useEffect, useMemo, useState } from "react";

export default function PlanCarousel({
  value,
  onContinue,
  cards,
}: {
  value: string;
  onContinue: (plan: IAiPlan) => void;
  cards: IAiPlan[];
}) {
  const startIndex = useMemo(() => {
    const i = cards.findIndex((c) => c.key === value);
    return i >= 0 ? i : 0;
  }, [cards, value]);

  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    setIdx(startIndex);
  }, [startIndex]);

  const active = cards[idx];

  const goTo = (i: number) =>
    setIdx(((i % cards.length) + cards.length) % cards.length);

  const next = () => goTo(idx + 1);
  const prev = () => goTo(idx - 1);

  if (!active) return null;

  return (
    <div className="p-4">
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-bold">{active.title}</div>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2">
            <button
              className="h-9 w-9 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
              onClick={prev}
              aria-label="previous"
            >
              ‹
            </button>
            <button
              className="h-9 w-9 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
              onClick={next}
              aria-label="next"
            >
              ›
            </button>
          </div>
        </div>

        <div className="text-xs text-neutral-400 mt-2">{active.subtitle}</div>

        <div className="mt-4 space-y-2 text-sm">
          {active.rows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              className="flex justify-between border-b border-neutral-800 py-1"
            >
              <div className="text-neutral-400">{row.label}</div>
              <div>{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {cards.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === idx ? "bg-neutral-200" : "bg-neutral-700"
            }`}
            onClick={() => goTo(i)}
            aria-current={i === idx}
            aria-label={`slide-${i + 1}`}
          />
        ))}
      </div>

      <div className="p-2" />

      <button
        className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold"
        onClick={() => onContinue(active)}
      >
        Continue
      </button>
    </div>
  );
}
