// app/api/crypto/klines/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";
  const interval = searchParams.get("interval") || "1m";
  const limit = searchParams.get("limit") || "800"; // স্ক্রিন ভরার জন্য বড় রাখলাম

  const url = `${
    process.env.BINANCE_REST || "https://api.binance.com"
  }/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  const r = await fetch(url, { next: { revalidate: 5 } });
  if (!r.ok) {
    return NextResponse.json(
      { error: "Failed to fetch klines" },
      { status: 500 }
    );
  }
  const rows = (await r.json()) as any[];

  // lightweight-charts format এ রূপান্তর
  const data = rows.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open: +k[1],
    high: +k[2],
    low: +k[3],
    close: +k[4],
  }));

  return NextResponse.json({ data });
}
