"use client";

import { toggleSidebar } from "@/redux/features/ui/uiSlice";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarGroupItem from "./SidebarGroupItem";
import { NAV_ITEMS } from "./sidebar-data";

/* ── desktop sidebar (collapsible) ─────────────────────────── */
export default function DesktopSidebar() {
  const collapsed = useSelector((s: any) => s.ui.sidebarCollapsed) as boolean;
  const dispatch = useDispatch();

  // group open state (only relevant when not collapsed)
  const [open, setOpen] = useState<Record<string, boolean>>({
    analytics: true,
    performance: false,
    settings: false,
  });
  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <nav
      className={[
        "sticky top-16 h-[calc(100dvh-4rem)] border-r border-neutral-900",
        "bg-neutral-950/95 backdrop-blur",
        collapsed ? "w-[72px] px-1" : "w-[280px] px-2",
        "pb-3 pt-2 flex flex-col",
        "overflow-y-auto [scrollbar-width:auto] [&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:bg-neutral-800/70 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700",
      ].join(" ")}
    >
      {/* top groups */}
      <div className="space-y-1">
        {NAV_ITEMS.filter((i) => i.section !== "bottom").map((i) => (
          <SidebarGroupItem
            key={i.key}
            item={i}
            collapsed={collapsed}
            open={!!open[i.key]}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* invite card */}
      {/* {!collapsed && <SidebarInviteCard />} */}

      {/* bottom groups */}
      <div className="mt-4 space-y-1">
        {NAV_ITEMS.filter((i) => i.section === "bottom").map((i) => (
          <SidebarGroupItem
            key={i.key}
            item={i}
            collapsed={collapsed}
            open={!!open[i.key]}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* collapse control */}
      <div className="fixed bottom-1 flex w-full justify-center bg-neutral-900/60">
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
