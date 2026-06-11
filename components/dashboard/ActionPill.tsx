// FILE: components/dashboard/ActionPill.tsx
"use client";
import { ReactNode } from "react";
export function ActionPill({ children }: { children: ReactNode }) {
  return (
    <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 backdrop-blur hover:bg-white/10">
      {children}
    </button>
  );
}
