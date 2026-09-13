"use client";

/* ──────────────────────────────────────────────────────────────────────────
   TotalTradeIncomeCard — Smart Trade profit + commission (AI + Live), combined
────────────────────────────────────────────────────────────────────────── */
import { useGetMyTradeIncomeQuery } from "@/redux/features/wallet/walletApi";
import { TrendingUp } from "lucide-react";

const usd = (n?: number) =>
  `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function TotalTradeIncomeCard() {
  const { data, isLoading } = useGetMyTradeIncomeQuery();
  const total = data?.totalTradeIncome ?? 0;
  const b = data?.breakdown;

  return (
    <div className="mt-4 rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/40 to-neutral-950 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          Total Trade Income
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          All-time
        </span>
      </div>

      <p className="mt-2 text-2xl font-black text-emerald-400">
        {isLoading ? "…" : usd(total)}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Row label="Smart Trade profit" value={usd(b?.aiTradeProfit)} />
        <Row label="Smart Trade commission" value={usd(b?.aiTradeCommission)} />
        <Row label="Live trade profit" value={usd(b?.liveTradeProfit)} />
        <Row label="Live trade commission" value={usd(b?.liveTradeCommission)} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2">
      <p className="text-[10px] text-neutral-500">{label}</p>
      <p className="mt-0.5 font-bold text-neutral-100">{value}</p>
    </div>
  );
}
