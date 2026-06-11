"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

/* ── one list row (clickable or static) ────────────────────── */
type Props = {
  href?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  end?: React.ReactNode; // right accessory (e.g. value/toggle)
  intent?: "default" | "primary"; // special highlight card
};

export default function Row({
  href,
  icon,
  title,
  subtitle,
  end,
  intent = "default",
}: Props) {
  const inner = (
    <div
      className={[
        "flex items-center gap-3 px-4 py-4",
        "border-b border-neutral-800/70 last:border-b-0",
        intent === "primary" ? "bg-emerald-500/5" : "",
      ].join(" ")}
    >
      {/* icon */}
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800/60">
        {icon}
      </div>

      {/* text */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-neutral-100">
          {title}
        </div>
        {subtitle ? (
          <div className="truncate text-sm text-neutral-400">{subtitle}</div>
        ) : null}
      </div>

      {/* right accessory */}
      {end ? (
        <div className="ml-2 shrink-0 text-sm text-neutral-400">{end}</div>
      ) : href ? (
        <ChevronRight className="ml-1 h-5 w-5 text-neutral-500" />
      ) : null}
    </div>
  );

  return href ? (
    <Link href={href} className="block hover:bg-neutral-900/40">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}
