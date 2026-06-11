"use client";

import { Lock } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

/* ── types ─────────────────────────────────────────────────── */
export type DepositItem = {
  key: string;
  name: string;
  processing: string;
  fee: string;
  limits: string;
  status: "available" | "unavailable";
  Icon?: ComponentType<SVGProps<SVGSVGElement>>; // svg component (SVGR)
  logo?: string; // fallback: public path
  logoStatic?: StaticImageData; // fallback: imported img
  tags?: string[];
  colorClass?: string; // e.g., "text-emerald-400"
};

/* ── component ─────────────────────────────────────────────── */
export default function DepositItemCard({ item }: { item: DepositItem }) {
  const locked = item.status !== "available";
  const tint = item.colorClass || "text-neutral-300";

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-xl border p-4",
        locked
          ? "border-neutral-850 bg-neutral-950/80"
          : "border-emerald-800/40 bg-neutral-950/60 ring-1 ring-emerald-800/20",
      ].join(" ")}
    >
      {/* ── header: logo + name ─────────────────────────────── */}
      <div className="mb-3 flex items-center gap-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-neutral-800 bg-gray-200">
          {item.Icon ? (
            // svg component → color via currentColor
            <item.Icon className={`h-full w-full p-1.5 ${tint}`} />
          ) : item.logoStatic ? (
            <Image
              src={item.logoStatic}
              alt={item.name}
              fill
              className="object-contain p-1.5 brightness-[1.2] contrast-[1.15]"
            />
          ) : item.logo ? (
            // fallback (public path): improve visibility on dark bg
            <img
              src={item.logo}
              alt={item.name}
              className="h-full w-full object-contain p-1.5 brightness-[1.25] contrast-[1.2] drop-shadow-[0_1px_2px_rgba(0,0,0,.6)]"
            />
          ) : null}
        </div>

        <div className="flex-1">
          <div className="font-medium text-neutral-100">{item.name}</div>
          <div className="text-xs text-neutral-400">{item.processing}</div>
        </div>

        {/* ── status badge ──────────────────────────────────── */}
        {locked ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/70 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
            <Lock className="h-3 w-3" />
            Unavailable
          </span>
        ) : (
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-neutral-950">
            Available
          </span>
        )}
      </div>

      {/* ── meta rows ───────────────────────────────────────── */}
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Fee</span>
          <span className="font-medium text-neutral-200">{item.fee}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Limits</span>
          <span className="font-medium text-neutral-200">{item.limits}</span>
        </div>
      </div>

      {/* ── footer CTA ──────────────────────────────────────── */}
      <div className="mt-3">
        {locked ? (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-400"
            title="Complete verification to enable this method"
          >
            Locked — complete verification
          </button>
        ) : (
          <Link
            href={`/deposit/${item.key}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
          >
            Deposit
          </Link>
        )}
      </div>

      {/* ── tag pills ───────────────────────────────────────── */}
      {item.tags && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-neutral-800 bg-neutral-900/60 px-2 py-0.5 text-[10px] text-neutral-400"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
