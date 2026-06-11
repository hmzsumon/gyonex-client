"use client";

import React from "react";

const InlineSpinner: React.FC = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center align-middle">
    <span className="relative block h-4 w-4">
      <span className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-emerald-400 via-cyan-500 to-emerald-400" />
      <span className="absolute inset-[2px] rounded-full bg-neutral-950" />
    </span>
  </span>
);

type Props = {
  label?: string;
  total: number;
  loading: boolean;
  currency?: string;
  decimals?: number;
};

export default function PortfolioBalanceHeader({
  label = "Total balance",
  total,
  loading,
  currency = "USDT",
  decimals = 4,
}: Props) {
  return (
    <div className="space-y-2 rounded-lg p-0 transition-colors">
      <p className="text-sm text-neutral-400">{label}</p>

      <div className="mt-1 text-2xl font-semibold tracking-tight text-white transition-colors">
        {loading ? (
          <InlineSpinner />
        ) : (
          <span>{Number(total ?? 0).toFixed(decimals)}</span>
        )}

        {!loading && (
          <span className="ml-1 text-sm text-neutral-400">{currency}</span>
        )}
      </div>
    </div>
  );
}
