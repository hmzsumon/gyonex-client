"use client";

import React from "react";

/* ── section header ───────────────────────────────────────── */
export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="px-4 text-lg font-semibold text-neutral-200">{title}</h2>
      <div className="mt-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
        {children}
      </div>
    </section>
  );
}
