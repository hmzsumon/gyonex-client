// components/trade/pickers/TimeframeDrawer.tsx
"use client";

import { Timeframe, setTimeframe } from "@/redux/features/trade/tradeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const TFS: Timeframe[] = ["1m", "3m", "5m", "10m", "15m", "1h", "2h"];

export default function TimeframeDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s: any) => s.trade.tf);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 rounded-t-2xl border-t border-neutral-800 bg-neutral-950">
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-neutral-700/60" />
        <div className="px-5 py-3">
          <div className="mb-2 text-lg font-bold">Time frame</div>
          <div className="divide-y divide-neutral-800">
            {TFS.map((tf) => {
              const selected = active === tf;
              return (
                <button
                  key={tf}
                  onClick={() => {
                    dispatch(setTimeframe(tf));
                    onClose();
                  }}
                  className="w-full py-3 text-left"
                >
                  <span className="text-base">
                    {human(tf)} {selected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function human(tf: Timeframe) {
  if (tf.endsWith("m")) return `${tf.replace("m", "")} minute`;
  if (tf.endsWith("h")) return `${tf.replace("h", "")} hour`;
  return tf;
}
