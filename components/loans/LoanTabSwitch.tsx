"use client";

import { BadgeCheck, List, Plus } from "lucide-react";
import { cn } from "./loan.helpers";

/* ─────────────────────────────────────────────────────────────
   Apply / My Loans tab switch
────────────────────────────────────────────────────────────── */
export default function LoanTabSwitch({
  tab,
  setTab,
}: {
  tab: "apply" | "list";
  setTab: (tab: "apply" | "list") => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/[0.025] p-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("apply")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition sm:flex-none",
            tab === "apply"
              ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
              : "text-white/45 hover:bg-white/[0.05]",
          )}
        >
          <Plus className="h-4 w-4" /> Apply
        </button>
        <button
          type="button"
          onClick={() => setTab("list")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition sm:flex-none",
            tab === "list"
              ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
              : "text-white/45 hover:bg-white/[0.05]",
          )}
        >
          <List className="h-4 w-4" /> My Loans
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-400/10 px-3 py-2 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-400/20">
        <BadgeCheck className="h-3.5 w-3.5" />
        KYC verified users need no extra document
      </div>
    </div>
  );
}
