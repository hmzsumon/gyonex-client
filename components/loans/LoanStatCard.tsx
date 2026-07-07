"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "./loan.helpers";

/* ─────────────────────────────────────────────────────────────
   Reusable stat card
────────────────────────────────────────────────────────────── */
export default function LoanStatCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  onClick,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "yellow" | "red";
  onClick?: () => void;
}) {
  const toneMap = {
    blue: "from-blue-500/20 to-cyan-500/10 border-blue-400/20 text-blue-300",
    green:
      "from-emerald-500/20 to-green-500/10 border-emerald-400/20 text-emerald-300",
    yellow:
      "from-amber-500/20 to-yellow-500/10 border-amber-400/20 text-amber-300",
    red: "from-red-500/20 to-rose-500/10 border-red-400/20 text-red-300",
  }[tone];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5",
        toneMap,
      )}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-white/45">{label}</p>
          <p className="mt-1 text-lg font-black font-num text-white">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-black/25 ring-1 ring-white/10">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.button>
  );
}
