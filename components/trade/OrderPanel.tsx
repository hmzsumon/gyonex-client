"use client";

import SpreadBadge from "@/components/ui/SpreadBadge";
import { useLiveBook } from "@/hooks/useLiveBook"; // ✅ server-driven quotes (Socket.IO)
import { usePlaceMarketOrderMutation } from "@/redux/features/trade/tradeApi";
import { useMemo, useState } from "react";

type Side = "buy" | "sell";

export default function OrderPanel({
  symbol,
  account,
}: {
  symbol: string;
  account: any;
}) {
  /* ────────── live server quotes ────────── */
  const { book } = useLiveBook(symbol);
  const bid = Number(book?.bid);
  const ask = Number(book?.ask);
  const mid =
    Number.isFinite(bid) && Number.isFinite(ask) ? (bid + ask) / 2 : NaN;

  /* ────────── local state ────────── */
  const [lots, setLots] = useState(0.1);
  const [side, setSide] = useState<Side>("buy");
  const [place, { isLoading }] = usePlaceMarketOrderMutation();

  /* ────────── calc ────────── */
  const leverage = account?.leverage ?? 200;
  const contractSize = useMemo(
    () => (symbol.toUpperCase().includes("XAU") ? 100 : 1), // crypto=1, XAU=100
    [symbol]
  );
  const notional = (Number.isFinite(mid) ? mid : 0) * contractSize * lots;
  const margin = leverage ? notional / leverage : NaN;

  // trade only when we have a sane price + lots
  const havePx = Number.isFinite(bid) && Number.isFinite(ask) && ask > bid;
  const canTrade = !!account && lots > 0 && (havePx || Number.isFinite(mid));

  // UI digits (lightweight): more for meme/alt, 2 for majors/metals
  const dp = useMemo(() => {
    const s = symbol.toUpperCase();
    if (/(BONK|PEPE|SHIB|DOGE)/.test(s)) return 5;
    if (/BTC|ETH|SOL|BNB|XAU/.test(s)) return 2;
    return 3;
  }, [symbol]);

  /* ────────── handlers ────────── */
  const decLots = () => setLots((v) => Math.max(0.01, +(v - 0.01).toFixed(2)));
  const incLots = () => setLots((v) => +(v + 0.01).toFixed(2));

  const handleConfirm = async () => {
    if (!canTrade || isLoading) return;

    // ✅ server-truth exec price: BUY→ask, SELL→bid; fallback mid
    const execPrice =
      side === "buy"
        ? Number.isFinite(ask)
          ? ask
          : mid
        : Number.isFinite(bid)
        ? bid
        : mid;

    if (!Number.isFinite(execPrice)) return;

    try {
      const res = await place({
        accountId: account._id,
        symbol, // keep UI symbol; backend normalizes
        side,
        lots,
        price: execPrice, // client hint; backend re-validates vs getTopOfBook()
      }).unwrap();

      const position = res.position;
      window.dispatchEvent(
        new CustomEvent("position:opened", { detail: { position } })
      );
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            kind: "success",
            text: `Order filled: ${side.toUpperCase()} ${lots.toFixed(
              2
            )} ${symbol} @ ${execPrice.toFixed(dp)}`,
          },
        })
      );
    } catch (e: any) {
      const msg =
        e?.data?.error || e?.data?.message || e?.message || "Order failed";
      window.dispatchEvent(
        new CustomEvent("toast", { detail: { kind: "error", text: msg } })
      );
    }
  };

  /* ────────── render ────────── */
  return (
    <div className="rounded-t-2xl bg-neutral-950 border-t border-neutral-800 p-4">
      <div className="text-center text-sm text-neutral-400">Regular</div>

      {/* Volume */}
      <div className="mt-3">
        <div className="text-sm text-neutral-400">Volume</div>
        <div className="mt-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center">
          <button className="px-4 py-3 text-xl" onClick={decLots}>
            −
          </button>
          <div className="flex-1 text-center text-2xl font-semibold">
            {lots.toFixed(2)}
          </div>
          <button className="px-4 py-3 text-xl" onClick={incLots}>
            ＋
          </button>
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Step: 0.01 • Min: 0.01
        </div>
      </div>

      {/* Sell / Buy buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3 items-center">
        <button
          onClick={() => setSide("sell")}
          disabled={!havePx}
          className={`rounded-xl py-3 font-semibold ${
            side === "sell" ? "bg-red-500/90" : "bg-neutral-800"
          } disabled:opacity-60`}
          title={!havePx ? "Waiting for price…" : undefined}
        >
          Sell {Number.isFinite(bid) ? bid.toFixed(dp) : "—"}
        </button>

        <button
          onClick={() => setSide("buy")}
          disabled={!havePx}
          className={`rounded-xl py-3 font-semibold ${
            side === "buy" ? "bg-blue-600/90" : "bg-neutral-800"
          } disabled:opacity-60`}
          title={!havePx ? "Waiting for price…" : undefined}
        >
          Buy {Number.isFinite(ask) ? ask.toFixed(dp) : "—"}
        </button>
      </div>

      {/* Spread badge (center) */}
      <div className="mt-2 flex items-center justify-center">
        <SpreadBadge symbol={symbol} />
      </div>

      {/* Confirm */}
      <div className="mt-3">
        <button
          disabled={!canTrade || isLoading || !havePx}
          onClick={handleConfirm}
          className={`w-full rounded-xl py-3 font-semibold ${
            side === "sell" ? "bg-red-600" : "bg-blue-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={!havePx ? "Waiting for price…" : undefined}
        >
          {isLoading
            ? "Placing…"
            : `Confirm ${side === "sell" ? "Sell" : "Buy"} ${lots.toFixed(
                2
              )} lots ${
                Number.isFinite(side === "sell" ? bid : ask)
                  ? (side === "sell" ? bid : ask)!.toFixed(dp)
                  : Number.isFinite(mid)
                  ? (mid as number).toFixed(dp)
                  : "—"
              }`}
        </button>
      </div>

      {/* Fees / Margin */}
      <div className="mt-3 text-xs text-neutral-400">
        Fees: ~0.00 {account?.currency || "USD"} • Margin:{" "}
        {Number.isFinite(margin) ? margin.toFixed(2) : "—"}{" "}
        {account?.currency || "USD"} (1:{leverage})
      </div>
    </div>
  );
}
