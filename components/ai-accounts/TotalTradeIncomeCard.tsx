"use client";

/* ──────────────────────────────────────────────────────────────────────────
   TotalTradeIncomeCard — Smart Trade profit + commission (AI + Live), combined
────────────────────────────────────────────────────────────────────────── */
import { useGetMyTradeIncomeQuery } from "@/redux/features/wallet/walletApi";
import { useSelectedAiAccount } from "@/hooks/useSelectedAiAccount";
import { TrendingUp } from "lucide-react";

const usd = (n?: number) =>
  `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function TotalTradeIncomeCard() {
  const { data, isLoading } = useGetMyTradeIncomeQuery();
  const { account, loading: accountLoading } = useSelectedAiAccount();
  const total = data?.totalTradeIncome ?? 0;
  const b = data?.breakdown;
  const earned = Math.max(0, Number(account?.earnedProfit || 0));
  const multiplier = account?.profitMultiplier || (Number(account?.planPrice || 0) <= 10000 ? 2.5 : 3.5);
  const target = Number(account?.profitCap || Number(account?.planPrice || 0) * multiplier);
  const progress = target > 0 ? Math.min(100, earned / target * 100) : 0;
  const expired = account?.status === "expired";
  const amount = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

      {accountLoading ? (
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-white/[0.03]" aria-label="Loading profit progress" />
      ) : account && target > 0 ? (
        <section className="mt-4 rounded-xl border border-emerald-500/15 bg-black/20 p-3.5 sm:p-4" aria-label="Selected Smart Trade account profit progress">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-neutral-100">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${expired ? "bg-amber-400" : "bg-emerald-400"}`} />
                Profit progress
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">ST #{account.accountNumber} · {multiplier}× target</p>
            </div>
            <div className="shrink-0 text-right">
              <p className={`text-lg font-bold tabular-nums ${expired ? "text-amber-300" : "text-emerald-300"}`}>{progress.toFixed(2)}%</p>
              {expired && <p className="text-[10px] font-medium uppercase tracking-wide text-amber-400/80">Expired</p>}
            </div>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/5" role="progressbar" aria-label={`ST ${account.accountNumber} profit target`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(progress.toFixed(2))} aria-valuetext={`${amount(earned)} of ${amount(target)} USDT earned`}>
            <div className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-500 motion-reduce:transition-none ${expired ? "from-amber-500 to-amber-200" : "from-emerald-600 via-emerald-400 to-teal-200"}`} style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
            <p className="tabular-nums"><span className="font-semibold text-neutral-100">{amount(earned)}</span><span className="text-neutral-500"> / {amount(target)} USDT</span></p>
            <p className="text-[11px] text-neutral-500">Your 60% profit share</p>
          </div>
          <p className={`mt-2 text-[11px] ${expired ? "text-amber-300/80" : "text-emerald-300/70"}`}>
            {expired ? "Target reached · Open a new Smart Trade account to renew." : `${amount(Math.max(0, target - earned))} USDT remaining to target`}
          </p>
        </section>
      ) : null}
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
