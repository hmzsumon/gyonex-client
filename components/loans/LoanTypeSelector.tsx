"use client";

import { motion } from "framer-motion";
import { LOAN_TYPES, type LoanTypeConfig } from "./loan.constants";
import { cn } from "./loan.helpers";

/* ─────────────────────────────────────────────────────────────
   Loan type selector
────────────────────────────────────────────────────────────── */
export default function LoanTypeSelector({
  selectedType,
  onSelect,
}: {
  selectedType: LoanTypeConfig;
  onSelect: (type: LoanTypeConfig) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {LOAN_TYPES.map((type) => {
        const Icon = type.icon;
        const active = selectedType.key === type.key;

        return (
          <motion.button
            type="button"
            key={type.key}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(type)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border p-4 text-left transition hover:-translate-y-0.5",
              active
                ? "border-white/20 bg-white/[0.07] shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                : "border-white/10 bg-white/[0.025] hover:bg-white/[0.045]",
            )}
            style={{ boxShadow: active ? `0 18px 70px ${type.color}18` : "" }}
          >
            <div
              className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl"
              style={{ background: `${type.color}20` }}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl ring-1"
                style={{
                  background: `${type.color}18`,
                  color: type.color,
                  borderColor: `${type.color}30`,
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              {active && (
                <div className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-black text-emerald-300 ring-1 ring-emerald-400/20">
                  Selected
                </div>
              )}
            </div>
            <div className="relative mt-4">
              <p className="text-sm font-black text-white">{type.label}</p>
              <p className="mt-1 text-[11px] text-white/45">{type.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white/65 ring-1 ring-white/10">
                  {type.rate}
                </span>
                <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white/65 ring-1 ring-white/10">
                  max {type.maxDays} days
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
