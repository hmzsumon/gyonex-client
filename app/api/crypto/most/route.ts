import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // 24h stats → sort by quoteVolume desc → top 30 USDT pairs
  const url = `${process.env.BINANCE_REST}/api/v3/ticker/24hr`;
  const res = await fetch(url, { next: { revalidate: 60 } }); // 60s cache
  const all = (await res.json()) as any[];

  const rows = all
    .filter(
      (r) =>
        r.symbol.endsWith("USDT") &&
        !r.symbol.includes("UP") &&
        !r.symbol.includes("DOWN")
    )
    .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
    .slice(0, 30)
    .map((r) => ({
      symbol: r.symbol, // e.g. BTCUSDT
      display: r.symbol.replace("USDT", "/USD"),
      last: Number(r.lastPrice),
      change: Number(r.priceChangePercent),
      quoteVolume: Number(r.quoteVolume),
    }));

  return NextResponse.json({ mostTraded: rows });
}
