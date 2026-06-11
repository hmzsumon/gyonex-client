/* ────────── comments ────────── */
/* Reusable UI states: Empty, Error, and InlineLoader */
/* ────────── comments ────────── */
"use client";

import { AlertTriangle, RefreshCw, Search } from "lucide-react";

export function EmptyState({
  title = "Nothing to show",
  subtitle = "No data was found for this section.",
  actionLabel,
  onAction,
}: {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0C111C] p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
        <Search className="h-6 w-6 text-white/70" />
      </div>
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-white/60 text-sm">{subtitle}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Failed to load",
  subtitle = "Something went wrong while fetching data.",
  retryLabel = "Try again",
  onRetry,
}: {
  title?: string;
  subtitle?: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-[#160D10] p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-white/70 text-sm">{subtitle}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function InlineLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0C111C] p-8 text-center">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      <p className="text-white/80 text-sm">{label}</p>
    </div>
  );
}
