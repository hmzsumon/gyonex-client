import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  // exchangeInfo → tradable USDT pairs
  const url = `${process.env.BINANCE_REST}/api/v3/exchangeInfo`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // 1h cache
  const data = await res.json();
  console.log(data);

  const list = (data.symbols || [])
    .filter((s: any) => s.status === "TRADING" && s.quoteAsset === "USDT")
    .map((s: any) => ({
      symbol: s.symbol, // BTCUSDT
      base: s.baseAsset, // BTC
      display: `${s.baseAsset}/USD`,
    }))
    .sort((a: any, b: any) => a.base.localeCompare(b.base));

  return NextResponse.json({ symbols: list });
}
