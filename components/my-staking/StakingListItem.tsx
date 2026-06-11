"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type StakingItem = {
  id: string;
  symbol: string; // BTC
  fullSymbol: string; // BTCUSDT
  iconSrc?: string;

  principalQty: number;
  totalProfitPercent: number;
  dailyPercent: number;

  earnedQty: number;

  status: "active" | "completed" | "cancelled";
  startedAt: string;
  endAt: string;

  paidDays: number;
  totalDays: number;
  progress: number; // 0..1
};

const fmt = (n: number, max = 8) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: max });

export default function StakingListItem({ item }: { item: StakingItem }) {
  const router = useRouter();

  const statusClass =
    item.status === "active"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
      : item.status === "cancelled"
      ? "bg-red-500/10 text-red-300 border-red-500/20"
      : "bg-white/10 text-white/70 border-white/10";

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden">
      {/* ✅ Hover CTA: left -> center */}
      <button
        type="button"
        onClick={() => router.push(`/my-staking/${item.id}`)}
        className={[
          "absolute top-1/2 -translate-y-1/2 z-10",
          "rounded-xl px-4 py-2 text-sm font-semibold",
          "bg-[#f0c34d] text-black shadow-lg",
          "flex items-center gap-2",
          // animation
          "opacity-0 pointer-events-none",
          "left-0 -translate-x-full",
          "transition-all duration-300 ease-out",
          "group-hover:opacity-100 group-hover:pointer-events-auto",
          "group-hover:left-1/2 group-hover:-translate-x-1/2",
        ].join(" ")}
      >
        View Details <ArrowRight size={16} />
      </button>

      {/* Dim bg on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
              {item.iconSrc ? (
                <Image
                  src={item.iconSrc}
                  alt={item.symbol}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {item.symbol?.[0] ?? "S"}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">{item.symbol}</div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${statusClass}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-1 text-xs text-white/55">
                {new Date(item.startedAt).toLocaleDateString()} →{" "}
                {new Date(item.endAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold">
              {fmt(item.principalQty)} {item.symbol}
            </div>
            <div className="mt-1 text-xs text-white/55">
              {item.dailyPercent.toFixed(4).replace(/\.?0+$/, "")}% /day
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-white/55">
            <span>
              Progress: {item.paidDays}/{item.totalDays} days
            </span>
            {/* ✅ unit fix: earned = same asset */}
            <span className="text-emerald-300">
              Earned: {fmt(item.earnedQty)} {item.symbol}
            </span>
          </div>

          <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#f0c34d] rounded-full"
              style={{ width: `${Math.round((item.progress || 0) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
