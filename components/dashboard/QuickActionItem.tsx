// FILE: components/dashboard/QuickActionItem.tsx
"use client";
import type { QuickPair } from "@/types/dashboard";
import { TrendingUp } from "lucide-react";
export function QuickActionItem({ pair }: { pair: QuickPair }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{pair.symbol}</div>
          <div className="text-[11px] text-white/50">Quick actions</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-emerald-400">
          {pair.price}
        </div>
        <div className="text-[11px] text-emerald-500">{pair.change}</div>
      </div>
    </div>
  );
}
