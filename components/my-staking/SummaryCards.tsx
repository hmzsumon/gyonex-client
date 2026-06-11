// SummaryCards.tsx
"use client";

import React from "react";

export type SummaryTone = "up" | "down" | "flat";

export type SummaryCardItem = {
  title: string;
  value: string;
  icon: React.ReactNode;

  tone?: SummaryTone; // up/down/flat
  flash?: boolean; // true হলে bg flash হবে
};

export default function SummaryCards({
  items,
  loading,
}: {
  items: SummaryCardItem[];
  loading?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((c) => {
        const tone = c.tone ?? "flat";
        const flash = !!c.flash && !loading;

        // bg only while flashing
        const flashBg =
          tone === "up"
            ? "bg-emerald-500/10 border-emerald-500/25"
            : tone === "down"
            ? "bg-red-500/10 border-red-500/25"
            : "bg-white/5 border-white/10";

        // text color always (so you see up/down)
        const valueColor =
          tone === "up"
            ? "text-emerald-300"
            : tone === "down"
            ? "text-red-300"
            : "text-white";

        return (
          <div
            key={c.title}
            className={[
              "rounded-2xl border p-4 transition-colors duration-300",
              flash ? flashBg : "border-white/10 bg-white/5",
            ].join(" ")}
          >
            <div className="flex items-center justify-between text-white/70">
              <span className="text-xs">{c.title}</span>
              <span className="opacity-80">{c.icon}</span>
            </div>

            <div
              className={["mt-2 text-lg font-semibold", valueColor].join(" ")}
            >
              {loading ? (
                <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
              ) : (
                c.value
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
