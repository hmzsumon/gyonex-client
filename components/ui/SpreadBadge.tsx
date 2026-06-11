// components/ui/SpreadBadge.tsx
"use client";

import { useLiveBook } from "@/hooks/useLiveBook";
import { fmt } from "@/utils/num";

export default function SpreadBadge({
  symbol,
  className = "",
}: {
  symbol: string;
  className?: string;
}) {
  const { book } = useLiveBook(symbol);
  const bid = Number(book?.bid);
  const ask = Number(book?.ask);
  const spread = Number.isFinite(bid) && Number.isFinite(ask) ? ask - bid : NaN;

  return (
    <div
      className={[
        "min-w-[54px] rounded-md border border-neutral-800 bg-neutral-900/80 px-2 py-1 text-center text-xs font-semibold text-neutral-300",
        className,
      ].join(" ")}
      title="Spread (Ask − Bid)"
    >
      {Number.isFinite(spread) ? fmt(spread, 2) : "–"}
    </div>
  );
}
