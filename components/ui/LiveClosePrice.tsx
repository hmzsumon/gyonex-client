"use client";

/* Small live close-price readout (Exness-like)
   - BUY closes at bid, SELL at ask (via useLiveClosePrice)
   - Fallback to provided last price
*/
import { useLiveClosePrice } from "@/hooks/useLivePrice";
import { fmt } from "@/utils/num";

export default function LiveClosePrice({
  symbol,
  side,
  fallback,
  className = "",
}: {
  symbol: string;
  side: "buy" | "sell";
  fallback?: number;
  className?: string;
}) {
  const px = useLiveClosePrice(symbol, side, fallback);
  const txt = Number.isFinite(px) ? fmt(px, 2) : "—";

  return (
    <div
      className={["text-[12px] text-neutral-400 text-right", className].join(
        " "
      )}
    >
      {txt}
    </div>
  );
}
