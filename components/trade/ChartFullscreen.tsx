// components/trade/ChartFullscreen.tsx
"use client";

import LiveChart, { ChartExpose } from "@/components/trade/parts/LiveChart";
import { useRef } from "react";
import InstrumentHeader from "./parts/InstrumentHeader";

export default function ChartFullscreen({
  symbol,
  interval,
  onClose,
}: {
  symbol: string;
  interval: "1m" | "3m" | "5m" | "10m" | "15m" | "1h" | "2h";
  onClose: () => void;
}) {
  const chartRef = useRef<ChartExpose>(null);

  return (
    <div className="fixed inset-0 z-[80] bg-black/95">
      {/* Top header (reuse of the same InstrumentHeader) */}
      <div className="absolute left-0 right-0 top-0 z-50 p-3 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
        <InstrumentHeader
          symbol={symbol}
          onOpenDrawer={() => {
            /* optional: fullscreen instrument drawer open */
          }}
          onFullscreen={onClose} // <- act as Minimize
          onResetZoom={() => chartRef.current?.resetView()}
        />
      </div>

      {/* Chart body below the header (reserve top space with pt) */}
      <div className="absolute inset-0 pt-[68px]">
        <LiveChart ref={chartRef} symbol={symbol} />
      </div>
    </div>
  );
}
