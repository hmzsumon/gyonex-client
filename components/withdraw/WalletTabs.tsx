/* ── Component: WalletTabs ─────────────────────────────────────────────── */
"use client";
import Image from "next/image";

export type WalletProvider = "bkash" | "nagad";

export default function WalletTabs({
  value,
  onChange,
  counts,
}: {
  value: WalletProvider;
  onChange: (v: WalletProvider) => void;
  counts?: Partial<Record<WalletProvider, number>>;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-[#00493B]">
      {(["bkash", "nagad"] as WalletProvider[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`relative -mb-px flex items-center gap-2 rounded-t-md px-3 py-2
            ${
              value === p
                ? "border-b-2 border-yellow-400 bg-[#012E25]"
                : "opacity-80 hover:opacity-100"
            }`}
        >
          <Image
            src={
              p === "bkash"
                ? "/images/deposit/bkash.png"
                : "/images/deposit/nagad.png"
            }
            alt={p}
            width={26}
            height={26}
            className="rounded bg-white"
          />
          <span className="text-sm">{p === "bkash" ? "bKash" : "Nagad"}</span>
          <span className="ml-1 rounded bg-white/10 px-2 text-xs">
            {counts?.[p] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
