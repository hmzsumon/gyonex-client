// components/trade/parts/ClosePositionDialog.tsx
/* ───────────────────────────────────────────
   close dialog: single hook + single math + toast feedback
   - safe when position is not ready
─────────────────────────────────────────── */

"use client";

import LivePnlBadge from "@/components/ui/LivePnlBadge";
import { useLiveClosePrice } from "@/hooks/useLivePrice";
import { useClosePositionMutation } from "@/redux/features/trade/tradeApi";
import { fmt } from "@/utils/num";
import { positionPnl } from "@/utils/tradeMath";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type PositionMini = {
  _id: string;
  symbol: string;
  side: "buy" | "sell";
  volume: number;
  entryPrice: number;
};

export default function ClosePositionDialog({
  position,
  lastPrice,
  onDone,
}: {
  position?: PositionMini; // ← optional guard
  lastPrice?: number; // ← optional guard
  onDone: () => void;
}) {
  if (!position) return null;

  const px = useLiveClosePrice(
    position.symbol,
    position.side,
    lastPrice ?? position.entryPrice
  );

  const [closeMut, { isLoading }] = useClosePositionMutation();
  const [error, setError] = useState<string | null>(null);

  const pnl = useMemo(
    () =>
      positionPnl({
        side: position.side,
        entryPrice: position.entryPrice,
        closePrice: px,
        lots: position.volume,
      }),
    [position, px]
  );

  /* ── submit with toast feedback ─────────────────────────── */
  const submit = async () => {
    const hint = `${position.symbol} • ${position.side.toUpperCase()} • ${fmt(
      px,
      2
    )}`;
    const tId = toast.loading(`Closing position… ${hint}`);
    setError(null);

    try {
      await closeMut({ id: position._id, price: px }).unwrap();

      // ── local events (kept from your original flow)
      window.dispatchEvent(
        new CustomEvent("position:closed", { detail: { id: position._id } })
      );

      // ── success toast
      toast.success(`Closed • P/L: ${fmt(pnl, 2)} USD`, { id: tId });

      onDone();
    } catch (e: any) {
      const msg = e?.data?.message || "Close failed";
      setError(msg);

      // ── error toast
      toast.error(msg, { id: tId });
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/60" onClick={onDone} />
      <div className="absolute left-0 right-0 bottom-0 rounded-t-2xl border-t border-neutral-800 bg-neutral-950 p-5">
        <div className="mb-2 text-center text-lg font-semibold">
          Close position {position.symbol}?
        </div>

        <div className="mb-3 flex justify-between text-sm text-neutral-300">
          <div>Lots</div>
          <div>{fmt(position.volume, 2)}</div>
        </div>

        <div className="mb-3 flex justify-between text-sm text-neutral-300">
          <div>Closing price</div>
          <div>{fmt(px, 2)}</div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-neutral-300">P/L</div>
          <LivePnlBadge
            position={{
              _id: position._id,
              symbol: position.symbol,
              side: position.side,
              entryPrice: position.entryPrice,
              lots: position.volume,
              lastPrice: lastPrice ?? position.entryPrice,
              status: "open",
            }}
            size="md"
          />
        </div>

        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDone}
            className="rounded-xl bg-neutral-800 py-3"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-xl bg-yellow-400 py-3 font-semibold text-black disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? "Closing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
