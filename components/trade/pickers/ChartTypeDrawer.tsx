// components/trade/pickers/ChartTypeDrawer.tsx
"use client";

import { ChartType, setChartType } from "@/redux/features/trade/tradeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { BarChart3, CandlestickChart, Circle, LineChart } from "lucide-react";

const OPTS: Array<{ k: ChartType; label: string; Icon: any }> = [
  { k: "line", label: "Line", Icon: LineChart },
  { k: "bars", label: "Bars", Icon: BarChart3 },
  { k: "candles", label: "Candles", Icon: CandlestickChart },
  { k: "hollow", label: "Hollow Candles", Icon: CandlestickChart },
];

export default function ChartTypeDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s: any) => s.trade.chartType);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute left-0 right-0 bottom-0 rounded-t-2xl border-t border-neutral-800 bg-neutral-950">
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-neutral-700/60" />
        <div className="px-5 py-3">
          <div className="mb-2 text-lg font-bold">Chart type</div>
          <div className="grid grid-cols-1">
            {OPTS.map(({ k, label, Icon }) => {
              const selected = active === k;
              return (
                <button
                  key={k}
                  onClick={() => {
                    dispatch(setChartType(k));
                    onClose();
                  }}
                  className="flex items-center justify-between py-3"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="text-base">{label}</span>
                  </span>
                  {selected ? (
                    <Circle className="h-4 w-4 fill-current" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-neutral-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
