"use client";

import Image from "next/image";
import Link from "next/link";

type CryptoAssetCardProps = {
  symbol: string;
  name: string;
  balance: number;
  quoteSymbol?: string;
  quoteValue?: number;
  avgPrice?: number;
  todayPnl?: number;
  iconSrc?: string;
  onEarn?: () => void;
  onTrade?: () => void;
};

export default function CryptoAssetCard({
  symbol,
  name,
  balance,
  quoteSymbol = "USDT",
  quoteValue,
  avgPrice,
  todayPnl,
  iconSrc,
  onTrade,
}: CryptoAssetCardProps) {
  const displayBalance = Number(balance || 0).toLocaleString(undefined, {
    maximumFractionDigits: 8,
  });

  const tradePair = (() => {
    const n = (name || "").toUpperCase();
    // যদি name আসলে pair symbol হয় (e.g. XRPUSDT) তাহলে এটাকেই নিন
    if (/^[A-Z0-9]+USDT$/.test(n)) return n;

    const s = symbol.toUpperCase();
    // USDT কার্ড হলে ডিফল্টে BTCUSDT (আপনি চাইলে বদলাতে পারেন)
    if (s === "USDT") return "BTCUSDT";

    // নাহলে BASE + USDT
    return `${s}USDT`;
  })();

  const tradeHref = `/trade?symbol=${encodeURIComponent(tradePair)}`;

  const displayQuote =
    typeof quoteValue === "number"
      ? `${quoteValue.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })} ${quoteSymbol}`
      : undefined;

  const displayAvgPrice =
    typeof avgPrice === "number"
      ? `${avgPrice.toFixed(4)} ${quoteSymbol}`
      : undefined;

  const pnlValue =
    typeof todayPnl === "number" && !Number.isNaN(todayPnl) ? todayPnl : 0;
  const pnlIsPositive = pnlValue >= 0;

  const src = iconSrc || "/images/icons/default-coin.png";

  // ✅ pass data via query params
  const earnHref =
    `/staking-earn?symbol=${encodeURIComponent(symbol)}` +
    `&name=${encodeURIComponent(name)}` +
    `&balance=${encodeURIComponent(String(balance ?? 0))}` +
    `&iconSrc=${encodeURIComponent(src)}`;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800/70 bg-[#020617] px-4 py-3 hover:border-zinc-600 hover:bg-[#020617]/90 transition-colors">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#111827]">
          <Image
            src={src}
            alt={symbol}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-white">
            {symbol}
          </span>
          <span className="mt-0.5 text-xs leading-tight text-zinc-400">
            {name}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-1">
        <div className="text-sm font-semibold text-white">{displayBalance}</div>

        {displayQuote && (
          <div className="text-[11px] text-zinc-400">{displayQuote}</div>
        )}

        <div className="mt-1 text-[11px] text-zinc-500">
          Today&apos;s PNL{" "}
          <span className={pnlIsPositive ? "text-emerald-400" : "text-red-400"}>
            {pnlValue.toFixed(2)} {quoteSymbol}
          </span>
        </div>

        <div className="text-[11px] text-zinc-500">
          Average Price{" "}
          <span className="text-zinc-300">
            {displayAvgPrice ?? `-- ${quoteSymbol}`}
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          {/* ✅ Earn now sends data */}
          <Link href={earnHref}>
            <button className="rounded-md px-4 py-1 text-xs font-medium transition-colors bg-[#374151] text-zinc-100 hover:bg-[#4B5563]">
              Earn
            </button>
          </Link>

          <Link href={tradeHref}>
            <button
              onClick={onTrade}
              className="rounded-md bg-[#374151] px-4 py-1 text-xs font-medium text-zinc-100 hover:bg-[#4B5563] transition-colors"
            >
              Trade
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
