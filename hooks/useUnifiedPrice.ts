// hooks/useUnifiedPrice.ts
"use client";

import { useBinanceStream } from "@/hooks/useBinanceStream";
import { applyFixedSpread, perMilleFromTargetUsd } from "@/utils/spread";

/** প্রতিটি সিম্বলের ডিফল্ট টিক সাইজ */
function tick(symbol: string) {
  const s = symbol.toUpperCase();
  if (/BTC|ETH|SOL|BNB/.test(s)) return 0.01;
  if (s.includes("XAU")) return 0.01;
  return 0.001;
}

const PM_DEFAULT = Number(process.env.NEXT_PUBLIC_SPREAD_PM ?? 10); // fallback ‰

/**
 * Bid-anchored pricing:
 *  - SELL (bid) == চার্টের প্রাইস (lastClose) — ফ্যালব্যাক হিসেবে bookTicker bid/ask
 *  - BUY (ask)  == SELL + spread
 */
export function useUnifiedPrice(symbol: string) {
  const { data: bt } = useBinanceStream(symbol, "bookTicker");
  const { data: kl1 } = useBinanceStream(symbol, "kline_1m");

  // raw feeds
  const bidRaw = bt?.b ? parseFloat(bt.b) : NaN;
  const askRaw = bt?.a ? parseFloat(bt.a) : NaN;
  const lastClose = (kl1 as any)?.k?.c ? parseFloat((kl1 as any).k.c) : NaN;

  // --- anchor নির্বাচন: চার্ট ক্লোজ > bid > ask
  const anchor = Number.isFinite(lastClose)
    ? lastClose
    : Number.isFinite(bidRaw)
    ? bidRaw
    : Number.isFinite(askRaw)
    ? askRaw
    : NaN;

  // per-mille সেট: BTC জোড়ায় ~$12 টার্গেট, নাহলে ডিফল্ট
  let perMille: number = PM_DEFAULT;
  if (/^BTC.*(USD|USDT)$/i.test(symbol) && Number.isFinite(anchor)) {
    perMille = perMilleFromTargetUsd(anchor, 12, 0.01); // 0.01‰ স্টেপ
  }

  // spread (absolute) = anchor * perMille / 1000
  // symmetric apply করার জন্য mid = anchor + spread/2
  const sAbs = Number.isFinite(anchor) ? (anchor * perMille) / 1000 : NaN;
  const midForApply =
    Number.isFinite(anchor) && Number.isFinite(sAbs) ? anchor + sAbs / 2 : NaN;

  const { bid, ask, spreadAbs, spreadPm } = applyFixedSpread(midForApply, {
    perMille,
    tick: tick(symbol),
  });

  // নিরাপত্তা: bid না মিললে (NaN হলে) পরিষ্কার NaN ফেরত
  return {
    // reference mid দেখাতে চাইলে এটা midForApply; নইলে anchor-ই লগিক্যাল mid
    mid: Number.isFinite(midForApply) ? midForApply : anchor,
    bid, // == anchor (রাউন্ডিং-সহ)
    ask, // == anchor + spread
    spreadAbs,
    spreadPm,
  };
}
