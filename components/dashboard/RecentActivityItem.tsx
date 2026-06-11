/* ── RecentActivityItem (amount inline spinner) ──────────────────────────── */

import type { Activity } from "@/types/dashboard";
import React from "react";

/* ── inline spinner ─────────────────────────────────────────────────────── */
const InlineSpinner: React.FC = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center align-middle">
    <span className="relative block h-4 w-4">
      <span className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-emerald-400 via-cyan-500 to-emerald-400" />
      <span className="absolute inset-[2px] rounded-full bg-neutral-900" />
    </span>
  </span>
);

type Props = {
  activity: Activity;
  isLoading?: boolean;
};

export const RecentActivityItem: React.FC<Props> = ({
  activity,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3">
      <div className="text-sm text-neutral-200">{activity.title}</div>
      <div className="text-sm font-semibold text-white">
        {isLoading ? (
          <InlineSpinner />
        ) : (
          <>
            {activity.amount.toFixed(2)}{" "}
            <span className="text-neutral-400">{activity.currency}</span>
          </>
        )}
      </div>
    </div>
  );
};
