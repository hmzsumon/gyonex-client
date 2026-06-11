/* ──────────────────────────────────────────────────────────────────────────
   PlanCarousel — Standard / Pro card slider (simple pager)
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useState } from "react";

export default function PlanCarousel({
  value,
  onContinue,
}: {
  value: "standard" | "pro";
  onContinue: (type: "standard" | "pro") => void;
}) {
  const [idx, setIdx] = useState(value === "pro" ? 1 : 0);

  const cards = [
    {
      key: "standard" as const,
      title: "Standard",
      subtitle: "Smaller lots, lower risk. Great for practicing.",
      rows: [
        ["Min deposit", "200 USDT"],
        ["Min spread", "0.2 pips"],
        ["Max leverage", "1:Unlimited"],
        ["Commission", "No commission"],
      ],
    },
    {
      key: "pro" as const,
      title: "Pro",
      subtitle: "Instant or market execution with tighter spreads.",
      rows: [
        ["Min deposit", "500 USDT"],
        ["Min spread", "0.1 pips"],
        ["Max leverage", "1:Unlimited"],
        ["Commission", "No commission"],
      ],
    },
  ];

  const active = cards[idx];

  return (
    <div className="p-4">
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
        <div className="text-2xl font-bold">{active.title}</div>
        <div className="text-sm text-neutral-400 mt-1">{active.subtitle}</div>

        <div className="mt-4 space-y-2 text-sm">
          {active.rows.map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-neutral-800 py-1"
            >
              <div className="text-neutral-400">{k}</div>
              <div>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {[0, 1].map((i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === idx ? "bg-neutral-200" : "bg-neutral-700"
            }`}
            onClick={() => setIdx(i)}
            aria-label={`slide-${i}`}
          />
        ))}
      </div>

      <div className="p-2" />

      <button
        className="btn-gradient btn-flex-1 w-full font-semibold"
        onClick={() => onContinue(active.key)}
      >
        Continue
      </button>
    </div>
  );
}
