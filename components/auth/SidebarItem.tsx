"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavChild } from "./sidebar-data";

type ItemRowProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  badge?: "new" | number;
  childrenItems?: NavChild[];
  collapsed: boolean;
  onNavigate?: () => void;
};

export default function ItemRow({
  icon: Icon,
  label,
  href,
  badge,
  childrenItems,
  collapsed,
  onNavigate,
}: ItemRowProps) {
  const pathname = usePathname();
  const active = href ? pathname === href : false;
  const [open, setOpen] = useState<boolean>(false);

  const base = (
    <div
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
      ${
        active
          ? "bg-neutral-800/60 text-white"
          : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge === "new" ? (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              New
            </span>
          ) : typeof badge === "number" ? (
            <span className="rounded-full bg-neutral-700 px-1.5 text-[10px]">
              {badge}
            </span>
          ) : null}
          {childrenItems ? (
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            />
          ) : null}
        </>
      )}
    </div>
  );

  if (childrenItems && childrenItems.length) {
    return (
      <div className="w-full">
        <button
          type="button"
          className="w-full"
          onClick={() => setOpen((s) => !s)}
        >
          {base}
        </button>
        <div
          className={`overflow-hidden pl-9 transition-[max-height,opacity] ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="mt-1 space-y-1">
            {childrenItems.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  onClick={onNavigate}
                  className={`block rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white`}
                >
                  <div className="flex items-center justify-between">
                    <span>{c.label}</span>
                    {c.sublabel ? (
                      <span className="ml-3 text-[10px] text-neutral-400">
                        {c.sublabel}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} onClick={onNavigate} className="block w-full">
        {base}
      </Link>
    );
  }

  return base;
}
