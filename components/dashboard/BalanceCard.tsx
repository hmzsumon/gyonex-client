/* ── BalanceCard (with inline loading spinner) ───────────────────────────── */

import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  balance: string | number;
  linkTitle: string;
  url: string;
  isLoading?: boolean;
};

/* ── tiny inline gradient spinner ───────────────────────────────────────── */
const InlineSpinner: React.FC = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center align-middle">
    <span className="relative block h-4 w-4">
      <span className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-emerald-400 via-cyan-500 to-emerald-400" />
      <span className="absolute inset-[2px] rounded-full bg-neutral-950" />
    </span>
  </span>
);

export const BalanceCard: React.FC<Props> = ({
  title,
  balance,
  linkTitle,
  url,
  isLoading,
}) => {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-400">{title}</p>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
            {isLoading ? (
              <InlineSpinner />
            ) : (
              <span>
                {typeof balance === "number" ? balance.toFixed(2) : balance}
              </span>
            )}
            {!isLoading && (
              <span className="ml-1 text-sm text-neutral-400">USDT</span>
            )}
          </div>
        </div>

        <Link
          href={url}
          className="rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:opacity-90"
        >
          {linkTitle}
        </Link>
      </div>
    </div>
  );
};
