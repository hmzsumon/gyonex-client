"use client";

import {
  ChevronDown,
  Maximize2,
  MoreVertical,
  PlusCircle,
  Settings,
} from "lucide-react";
import OpenPendingStrip, { ActivePos } from "./parts/OpenPendingStrip";

function prettify(sym: string) {
  if (sym.includes("/")) return sym;
  if (sym.endsWith("USDT")) return sym.replace("USDT", "/USD");
  if (sym.length === 6) return `${sym.slice(0, 3)}/${sym.slice(3)}`;
  return sym;
}

export default function TopHeaderSection({
  symbol,
  openCount,
  pendingCount,
  activePos,
  onOpenPicker,
  onActiveClosed,
}: {
  symbol: string;
  openCount: number;
  pendingCount: number;
  activePos: ActivePos | null;
  onOpenPicker: () => void; // ইন্সট্রুমেন্ট ড্রয়ার ওপেন
  onActiveClosed?: (id: string) => void;
}) {
  const pretty = prettify(symbol);

  return (
    <div className="px-3 space-y-3">
      {/* প্রথম লাইন: সিম্বল + আইকনসমূহ */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 px-3 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenPicker}
            className="text-2xl font-semibold flex items-center gap-2"
          >
            {pretty} <ChevronDown className="w-5 h-5 opacity-70" />
          </button>

          <div className="flex items-center gap-3 opacity-80">
            <PlusCircle className="w-5 h-5" />
            <Maximize2 className="w-5 h-5" />
            <Settings className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* দ্বিতীয় লাইন: Open/Pending + লাইভ PNL + ✕ */}
      <OpenPendingStrip
        symbol={symbol}
        openCount={openCount}
        pendingCount={pendingCount}
        active={activePos}
        onClosed={onActiveClosed}
      />
    </div>
  );
}
