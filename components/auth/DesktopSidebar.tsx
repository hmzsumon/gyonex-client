"use client";

import { toggleSidebar } from "@/redux/features/ui/uiSlice";
import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INVITE_CARD, NAV_ITEMS, type NavItem } from "./sidebar-data";

export default function DesktopSidebar() {
  // global collapse state
  const collapsed = useSelector((s: any) => s.ui.sidebarCollapsed) as boolean;
  const dispatch = useDispatch();

  // group expand state (only when expanded)
  const [open, setOpen] = useState<Record<string, boolean>>({
    analytics: true,
    performance: false,
    settings: false,
  });
  const toggleGroup = (key: string) =>
    setOpen((s) => ({ ...s, [key]: !s[key] }));

  const Group = ({ item }: { item: NavItem }) => {
    const hasChildren = !!item.children?.length;

    // row classes
    const row =
      "flex items-center rounded-xl px-3 py-2 text-sm hover:bg-neutral-900";
    const rowExpanded = "justify-between";
    const rowCollapsed = "justify-center";

    return (
      <div>
        <Link
          href={item.href || "#"}
          onClick={(e) => {
            if (collapsed) return; // collapsed অবস্থায় টগল দেখাব না
            if (hasChildren) {
              e.preventDefault();
              toggleGroup(item.key);
            }
          }}
          className={`${row} ${collapsed ? rowCollapsed : rowExpanded}`}
        >
          <span
            className={`flex items-center gap-3 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <item.icon className="h-5 w-5" />
            {/* label hide when collapsed */}
            <span className={`${collapsed ? "hidden" : "inline"}`}>
              {item.label}
            </span>
            {!collapsed && item.badge ? (
              <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                {item.badge === "new" ? "New" : item.badge}
              </span>
            ) : null}
          </span>

          {!collapsed && hasChildren ? (
            <ChevronDown
              className={`h-4 w-4 transition ${
                open[item.key] ? "rotate-180" : ""
              }`}
            />
          ) : null}
        </Link>

        {!collapsed && hasChildren && open[item.key] ? (
          <div className="ml-9 space-y-1 py-1">
            {item.children!.map((c) => (
              <Link
                key={c.label}
                href={c.href}
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
        ) : null}
      </div>
    );
  };

  return (
    <nav
      className={[
        "sticky top-16 h-[calc(100dvh-4rem)] border-r border-neutral-900",
        "bg-neutral-950/95 backdrop-blur",
        // width + padding changes with collapse
        collapsed ? "w-[72px] px-1" : "w-[280px] px-2",
        "pb-3 pt-2",
        "flex flex-col",
        // scrollbar
        "overflow-y-auto [scrollbar-width:auto] [&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:bg-neutral-800/70 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700",
      ].join(" ")}
    >
      {/* top section */}
      <div className="space-y-1">
        {NAV_ITEMS.filter((i) => i.section !== "bottom").map((i) => (
          <Group key={i.key} item={i} />
        ))}
      </div>

      {/* invite card (hide when collapsed) */}
      {!collapsed && (
        <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
          <div className="text-sm font-medium">{INVITE_CARD.title}</div>
          <Link
            href={INVITE_CARD.href}
            className="mt-2 inline-flex rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-neutral-950"
          >
            Open
          </Link>
        </div>
      )}

      {/* bottom section */}
      <div className="mt-4 space-y-1">
        {NAV_ITEMS.filter((i) => i.section === "bottom").map((i) => (
          <Group key={i.key} item={i} />
        ))}
      </div>

      {/* collapse / expand control (BOTTOM) */}
      <div className="sticky -bottom-2  flex w-full justify-center bg-neutral-900/60">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>
    </nav>
  );
}
