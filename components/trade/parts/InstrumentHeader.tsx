// components/trade/InstrumentHeader.tsx
"use client";

import ChartTypeDrawer from "@/components/trade/pickers/ChartTypeDrawer";
import TimeframeDrawer from "@/components/trade/pickers/TimeframeDrawer";
import { useAppSelector } from "@/redux/hooks";
import {
  CandlestickChart,
  ChevronDown,
  Maximize2,
  RotateCcw, // 👈 reset icon
} from "lucide-react";
import { useState } from "react";

export default function InstrumentHeader({
  symbol,
  onOpenDrawer,
  onFullscreen, // 👈 new
  onResetZoom, // 👈 new
}: {
  symbol: string;
  onOpenDrawer: () => void;
  onFullscreen: () => void;
  onResetZoom: () => void;
}) {
  const pretty = prettify(symbol);
  const tf = useAppSelector((s: any) => s.trade.tf);

  const [ctOpen, setCtOpen] = useState(false);
  const [tfOpen, setTfOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-1 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenDrawer}
            className="text-sm font-semibold flex items-center gap-2"
          >
            {pretty} <ChevronDown className="w-5 h-5 opacity-70" />
          </button>

          {/* middle tool group */}
          <div className="flex items-center gap-2">
            {/* Chart type */}
            <button
              onClick={() => setCtOpen(true)}
              className="grid place-items-center h-8 w-8 rounded-md bg-neutral-800/70 hover:bg-neutral-700"
              title="Chart type"
            >
              <CandlestickChart className="h-4 w-4" />
            </button>

            {/* Time frame */}
            <button
              onClick={() => setTfOpen(true)}
              className="h-8 rounded-md bg-neutral-800/70 px-2 text-sm hover:bg-neutral-700"
              title="Time frame"
            >
              {tf}
            </button>

            {/* Fullscreen */}
            <button
              onClick={onFullscreen}
              className="grid place-items-center h-8 w-8 rounded-md bg-neutral-800/70 hover:bg-neutral-700"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Reset zoom (Settings-এর জায়গায়) */}
            <button
              onClick={onResetZoom}
              className="grid place-items-center h-8 w-8 rounded-md bg-neutral-800/70 hover:bg-neutral-700"
              title="Reset zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <ChartTypeDrawer open={ctOpen} onClose={() => setCtOpen(false)} />
      <TimeframeDrawer open={tfOpen} onClose={() => setTfOpen(false)} />
    </>
  );
}

function prettify(s: string) {
  if (s.includes("/")) return s;
  if (s.endsWith("USDT")) return s.replace("USDT", "/USD");
  if (s.length === 6) return `${s.slice(0, 3)}/${s.slice(3)}`;
  return s;
}
