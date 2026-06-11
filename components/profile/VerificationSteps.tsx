// components/profile/VerificationSteps.tsx
"use client";

/* ── accordion style step list (mobile-friendly) ──────────── */
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
  openByDefault?: boolean;
  done?: boolean;
};

export default function VerificationSteps({
  sections,
}: {
  sections: Section[];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.id, !!s.openByDefault]))
  );

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-2xl font-bold text-white">Verification steps</h2>

      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        {sections.map((s, idx) => {
          const isOpen = !!open[s.id];
          return (
            <div
              key={s.id}
              className="border-b last:border-0 border-neutral-800"
            >
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
                className="flex w-full items-center justify-between px-4 py-4"
              >
                <span className="flex items-center gap-3 text-left">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-neutral-200">
                    {idx + 1}
                  </span>
                  <span className="text-base font-medium text-neutral-100">
                    {s.title}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  {s.done ? (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                      Done
                    </span>
                  ) : null}
                  <ChevronDown
                    className={`h-5 w-5 text-neutral-400 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 pt-2 bg-neutral-950/60">
                  {s.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
