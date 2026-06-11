/* ── Agent Info Header ────────────────────────────────────────────────────── */

"use client";

import { ChevronDown } from "lucide-react";

type Props = {
  platform: "MT4" | "MT5";
  accountId: string | number;
  currency: string;
  balance: string; // "0.00"
};

const AgentInfoHeader: React.FC<Props> = ({
  platform,
  accountId,
  currency,
  balance,
}) => {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* ── Agent account ── */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Agent account:</span>
          <span className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-200">
            {platform}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-200"
          >
            {accountId}
            <ChevronDown size={14} className="text-neutral-400" />
          </button>
        </div>

        {/* ── Currency ── */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Account currency:</span>
          <span className="font-medium text-neutral-100">{currency}</span>
        </div>

        {/* ── Balance ── */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Account balance:</span>
          <span className="font-semibold text-neutral-100">{balance}</span>
        </div>
      </div>
    </section>
  );
};

export default AgentInfoHeader;
