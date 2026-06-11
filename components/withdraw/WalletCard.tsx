/* ── Component: WalletCard ─────────────────────────────────────────────── */
"use client";
import { WalletProvider } from "./WalletTabs";

export type BoundWallet = {
  id: string;
  provider: WalletProvider;
  accountNumber: string;
  holderName?: string;
  last4: string;
  createdAt: string;
  isDefault?: boolean;
};

const mask = (s: string, visible = 4) =>
  `${"•".repeat(Math.max(0, s.length - visible))}${s.slice(-visible)}`;

export default function WalletCard({
  w,
  selected,
  onSelect,
}: {
  w: BoundWallet;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-selected={!!selected}
      onClick={() => onSelect?.(w.id)}
      className={`relative h-28 w-full shrink-0 snap-center overflow-hidden rounded-sm p-2 text-slate-900 outline-none
        ring-offset-2 focus:ring-2
        ${selected ? "ring-2 ring-yellow-300" : "ring-0"}
      `}
      style={{
        background:
          "linear-gradient(135deg,#94f7e1 0%,#5ed0ff 50%,#5bc3ff 100%)",
      }}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-white/90 font-bold">
          {w.provider === "bkash" ? "Bk" : "Ng"}
        </div>
        <div className="font-semibold">
          {w.provider === "bkash" ? "bKash" : "Nagad"}
        </div>
      </div>

      <div className="mt-2 text-xs opacity-80">{w.holderName ?? "—"}</div>
      <div className="mt-1 font-mono text-lg tracking-widest">
        {mask(w.accountNumber)}
      </div>
      <div className="mt-1 text-[11px] opacity-70">Added: {w.createdAt}</div>

      {w.isDefault && (
        <span className="absolute right-2 top-2 rounded bg-black/50 px-2 text-xs text-white">
          Default
        </span>
      )}
    </button>
  );
}
