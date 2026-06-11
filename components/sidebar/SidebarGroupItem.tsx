"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { NavItem } from "./sidebar-data";

/* ── shared row for Desktop & Mobile ───────────────────────── */
type Props = {
  item: NavItem;
  collapsed?: boolean; // desktop only
  open?: boolean; // children visible?
  onToggle?: (key: string) => void;
  onLeafClick?: () => void; // close drawer on mobile
};

/* ── component ─────────────────────────────────────────────── */
export default function SidebarGroupItem({
  item,
  collapsed = false,
  open = false,
  onToggle,
  onLeafClick,
}: Props) {
  const hasChildren = !!item.children?.length;

  /* ── row base (w-full so chevron can pin to the right) ───── */
  const rowBase =
    "flex w-full items-center rounded-xl px-3 py-2 text-sm hover:bg-neutral-900";
  const row = collapsed
    ? `${rowBase} justify-center`
    : `${rowBase} justify-start`;

  /* ── leaf item (no children) ─────────────────────────────── */
  if (!hasChildren) {
    return (
      <Link href={item.href || "#"} onClick={onLeafClick} className={row}>
        {/* label area flex-1 keeps spacing consistent when expanded */}
        <span
          className={`flex items-center gap-3 ${collapsed ? "" : "flex-1"}`}
        >
          <item.icon className="h-5 w-5" />
          <span className={collapsed ? "hidden" : "inline"}>{item.label}</span>
          {!collapsed && item.badge ? (
            <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              {item.badge === "new" ? "New" : item.badge}
            </span>
          ) : null}
        </span>
      </Link>
    );
  }

  /* ── group with children (toggle when expanded) ──────────── */
  return (
    <div>
      <button
        type="button"
        onClick={() => (collapsed ? null : onToggle?.(item.key))}
        className={row}
        aria-expanded={open}
      >
        {/* flex-1 pushes chevron to the far right */}
        <span
          className={`flex items-center gap-3 ${collapsed ? "" : "flex-1"}`}
        >
          <item.icon className="h-5 w-5" />
          <span className={collapsed ? "hidden" : "inline"}>{item.label}</span>
          {!collapsed && item.badge ? (
            <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              {item.badge === "new" ? "New" : item.badge}
            </span>
          ) : null}
        </span>

        {/* chevron pinned right */}
        {!collapsed && (
          <span className="ml-auto inline-flex">
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            />
          </span>
        )}
      </button>

      {/* children list */}
      {!collapsed && open && (
        <div className="ml-9 space-y-1 py-1">
          {item.children!.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              onClick={onLeafClick}
              className="block rounded-lg px-2 py-1.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              <span className="block">{c.label}</span>
              {c.sublabel ? (
                <span className="block text-xs text-neutral-400">
                  {c.sublabel}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
