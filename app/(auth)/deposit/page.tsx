"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import DepositItemCard, {
  type DepositItem,
} from "@/components/deposit/DepositItemCard";

// ── import svg icons as React components (SVGR) ──────────────
import BtcIcon from "@/public/images/deposit/bitcoin.svg";
import CardIcon from "@/public/images/deposit/card.svg";
import EthIcon from "@/public/images/deposit/ethereum.svg";
import UsdtIcon from "@/public/images/deposit/usdt-trc20.svg";

/* ── data: payment methods ──────────────────────────────────── */
const ALL_ITEMS: DepositItem[] = [
  {
    key: "bep-20",
    name: "BNB (USDT BEP20)",
    Icon: UsdtIcon,
    colorClass: "text-emerald-400",
    processing: "Instant – 15 minutes",
    fee: "0%",
    limits: "10 – 200,000 USD",
    status: "available",
    tags: ["Crypto", "TRON"],
  },

  {
    key: "bank-card",
    name: "Bank Card",
    Icon: CardIcon,
    colorClass: "text-neutral-300",
    processing: "Instant – 30 minutes",
    fee: "0%",
    limits: "10 – 10,000 USD",
    status: "unavailable",
    tags: ["Fiat"],
  },
  {
    key: "btc",
    name: "Bitcoin (BTC)",
    Icon: BtcIcon,
    colorClass: "text-amber-400",
    processing: "Instant – 1 hour",
    fee: "0%",
    limits: "10 – 200,000 USD",
    status: "unavailable",
    tags: ["Crypto", "BTC"],
  },
  {
    key: "eth",
    name: "Ethereum (ETH)",
    Icon: EthIcon,
    colorClass: "text-indigo-400",
    processing: "Instant – 15 minutes",
    fee: "0%",
    limits: "10 – 200,000 USD",
    status: "unavailable",
    tags: ["Crypto", "ETH"],
  },
];

/* ── simple tag list for filtering ──────────────────────────── */
const TAGS = [
  "All",
  "Crypto",
  "Fiat",
  "Local",
  "BD",
  "TRON",
  "BTC",
  "ETH",
] as const;

/* ── page ──────────────────────────────────────────────────── */
export default function DepositPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<(typeof TAGS)[number]>("All");

  /* ── filter logic ─────────────────────────────────────────── */
  const items = useMemo(() => {
    const text = q.trim().toLowerCase();
    return ALL_ITEMS.filter((it) => {
      const nameMatch = !text || it.name.toLowerCase().includes(text);
      const tagMatch = tag === "All" || it.tags?.includes(tag);
      return nameMatch && tagMatch;
    });
  }, [q, tag]);

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 md:px-6 md:py-6">
      {/* ── header row ───────────────────────────────────────── */}
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-white">Deposit</h1>

        <div className="flex items-center gap-2">
          <Link
            href="/deposit-history"
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
          >
            History
          </Link>
        </div>
      </div>

      {/* ── verification banner ──────────────────────────────── */}
      {/* <div className="mb-4 rounded-xl border border-yellow-600/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4" />
          <p>
            Verification required to enable deposits. Complete your profile to
            unlock the available methods.
          </p>
        </div>
      </div> */}

      {/* ── toolbar: search + tags ───────────────────────────── */}
      {/* <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search method…"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 px-9 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-emerald-600/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/60 px-2 py-1.5 text-xs text-neutral-300">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={[
                  "rounded-full px-3 py-1 text-xs",
                  t === tag
                    ? "bg-emerald-500 text-neutral-950"
                    : "border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* ── grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <DepositItemCard key={it.key} item={it} />
        ))}
      </div>

      {/* ── empty state ──────────────────────────────────────── */}
      {items.length === 0 && (
        <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center">
          <TriangleAlert className="mx-auto mb-2 h-6 w-6 text-neutral-400" />
          <p className="text-sm text-neutral-400">
            No methods match your filter.
          </p>
        </div>
      )}
    </div>
  );
}
