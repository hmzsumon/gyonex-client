"use client";

import { fmt } from "@/utils/num";

export default function AiClosedPnlBadge({
  value,
  loading = false,
  onClose,
  size = "md",
  className = "",
}: {
  value: number;
  loading?: boolean;
  onClose?: () => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const pos = Number.isFinite(value) && value >= 0;
  const base = "flex items-center gap-3 rounded-lg";
  const pad = size === "sm" ? "px-1 py-1" : "px-3 py-1.5";
  const tone = pos
    ? "bg-green-600/15 text-green-400"
    : "bg-red-600/15 text-red-400";

  return (
    <div className={[base, pad, tone, className].join(" ")}>
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span className="text-xs opacity-80">live</span>
        </span>
      ) : (
        <span className="text-xs font-semibold">
          {(pos ? "+" : "") + fmt(value, 2)} USD
        </span>
      )}

      {onClose && !loading && (
        <button
          onClick={onClose}
          className="px-1.5 py-1 rounded bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700"
          title="Close position"
        >
          ✕
        </button>
      )}
    </div>
  );
}
