// components/agent/MetricCardsRow.tsx
"use client";

import MetricCard from "./MetricCard";

const fmt2 = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

const MetricCardsRow: React.FC<{
  loading?: boolean;
  deposit: number;
  withdraw: number;
  netDeposit: number;
  aiTradeRoi: number;
  volume: number;
}> = ({
  loading = false,
  deposit,
  withdraw,
  netDeposit,
  aiTradeRoi,
  volume,
}) => {
  const V = (n: number, suffix = " USDT") =>
    loading ? "…" : `${fmt2(n)}${suffix}`;

  return (
    <section className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Deposit" amount={V(deposit)} />
        <MetricCard label="Withdrawal" amount={V(withdraw)} />
        <MetricCard label="Total Smart trade" amount={V(netDeposit)} />
        <MetricCard label="Smart trade ROI" amount={V(aiTradeRoi)} />
      </div>
    </section>
  );
};

export default MetricCardsRow;
