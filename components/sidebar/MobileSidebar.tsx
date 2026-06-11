"use client";

import Link from "next/link";
import { useState } from "react";
import SidebarBalanceAccordion from "./SidebarBalanceAccordion";
import SidebarGroupItem from "./SidebarGroupItem";
import SidebarInviteCard from "./SidebarInviteCard";
import SidebarUserBlock from "./SidebarUserBlock";
import { NAV_ITEMS } from "./sidebar-data";

/* ── mobile sidebar (drawer) ───────────────────────────────── */
type Props = { open: boolean; onClose: () => void };

export default function MobileSidebar({ open, onClose }: Props) {
  const [expand, setExpand] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setExpand((s) => ({ ...s, [key]: !s[key] }));

  return (
    <>
      {/* overlay under header */}
      <div
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* drawer panel */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-50 w-[86%] max-w-[320px] border-r border-neutral-900 bg-neutral-950 transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        {/* scroll area */}
        <div className="h-full overflow-y-auto px-2 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* user */}
          <SidebarUserBlock />

          {/* balance */}
          <SidebarBalanceAccordion />

          {/* groups (top) */}
          <div className="space-y-1">
            {NAV_ITEMS.filter((i) => i.section !== "bottom").map((i) => (
              <SidebarGroupItem
                key={i.key}
                item={i}
                open={!!expand[i.key]}
                onToggle={toggle}
                onLeafClick={onClose}
              />
            ))}
          </div>

          {/* invite */}
          <SidebarInviteCard />

          {/* bottom section */}
          <div className="mt-4 space-y-1">
            {NAV_ITEMS.filter((i) => i.section === "bottom").map((i) => (
              <SidebarGroupItem
                key={i.key}
                item={i}
                open={!!expand[i.key]}
                onToggle={toggle}
                onLeafClick={onClose}
              />
            ))}
          </div>

          {/* footer: close entry (optional quick close) */}
          <div className="mt-3">
            <Link
              href="#"
              onClick={onClose}
              className="block w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-center text-sm text-neutral-300 hover:bg-neutral-900"
            >
              Close
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
