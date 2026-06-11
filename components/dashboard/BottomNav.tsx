// FILE: components/dashboard/BottomNav.tsx
"use client";
import { ArrowUpRight, FileText, Home, Menu } from "lucide-react";
export function BottomNav() {
  const Item = ({
    icon: Icon,
    label,
    active = false,
  }: {
    icon: any;
    label: string;
    active?: boolean;
  }) => (
    <button
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] ${
        active ? "text-white" : "text-white/60"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto mb-2 max-w-md rounded-2xl border border-white/10 bg-[#0c0f13]/90 px-2">
      <div className="flex">
        <Item icon={Home} label="Dashboard" active />
        <Item icon={FileText} label="Reports" />
        <Item icon={ArrowUpRight} label="Trade" />
        <Item icon={Menu} label="Menu" />
      </div>
    </nav>
  );
}
