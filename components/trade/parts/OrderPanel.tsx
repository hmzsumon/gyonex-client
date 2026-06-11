/* components/trade/OrderPanel.tsx */
"use client";

/* ────────── deps ────────── */
import { useUnifiedPrice } from "@/hooks/useUnifiedPrice";
import { usePlaceMarketOrderMutation } from "@/redux/features/trade/tradeApi";
import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";

/* ────────── symbol helpers ────────── */
function toBinanceSymbol(sym: string) {
  let s = sym.replace("/", "").toUpperCase();
  if (s.endsWith("USD")) s = s.replace("USD", "USDT");
  return s;
}

/* ────────── lots helpers ────────── */
function clampLots(v: number) {
  if (!Number.isFinite(v)) return 0.01;
  return Math.max(0.01, +v.toFixed(2));
}
function addLots(v: number, d = 0.01) {
  return clampLots(v + d);
}
function subLots(v: number, d = 0.01) {
  return clampLots(v - d);
}

/* ────────── component ────────── */
export default function OrderPanel({
  symbol: uiSymbol,
  account,
}: {
  symbol: string;
  account: any;
}) {
  const symbol = toBinanceSymbol(uiSymbol);

  // ✅ unified mid/bid/ask
  const { mid, bid, ask, spreadAbs, spreadPm } = useUnifiedPrice(symbol);

  const [lots, setLots] = useState(0.01);
  const [lotsText, setLotsText] = useState(lots.toFixed(2));
  const [side, setSide] = useState<"buy" | "sell">("sell");
  const [place, { isLoading }] = usePlaceMarketOrderMutation();
  const [submitting, setSubmitting] = useState(false);

  const dp = useMemo(() => (/(BONK|PEPE|SHIB)/.test(symbol) ? 5 : 2), [symbol]);

  const leverage = account?.leverage ?? 200;
  const contractSize = useMemo(
    () => (symbol.includes("XAU") ? 100 : 1), // crypto = 1
    [symbol]
  );
  const notional = (mid || 0) * contractSize * lots;
  const margin = leverage ? notional / leverage : 0;

  const pxForSide = side === "buy" ? ask : bid;
  const canTrade = !!account && lots > 0 && Number.isFinite(pxForSide);

  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(dp) : "–");

  /* ── lots input handlers ───────────────────────────────── */
  const onLotsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, "");
    const parts = raw.split(".");
    const safe =
      parts.length > 1 ? parts[0] + "." + parts.slice(1).join("") : raw;
    setLotsText(safe);
    const n = Number(safe);
    if (Number.isFinite(n)) setLots(n);
  };
  const onLotsBlur = () => {
    const clamped = clampLots(Number(lotsText));
    setLots(clamped);
    setLotsText(clamped.toFixed(2));
  };
  const onLotsKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      const v = addLots(lots);
      setLots(v);
      setLotsText(v.toFixed(2));
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      const v = subLots(lots);
      setLots(v);
      setLotsText(v.toFixed(2));
      e.preventDefault();
    }
  };

  /* ── confirm place ─────────────────────────────────────── */
  async function onConfirm() {
    if (!canTrade || submitting) return;

    const hint = `${side.toUpperCase()} ${lots.toFixed(2)} ${symbol} @ ${fmt(
      pxForSide
    )}`;
    const toastId = toast.loading(`Placing order… ${hint}`);

    try {
      setSubmitting(true);

      const res = await place({
        accountId: account._id,
        symbol, // Binance raw
        side, // "buy" | "sell"
        lots, // volume
        price: pxForSide, // client hint
      }).unwrap();

      // ── optional DOM events you already had
      window.dispatchEvent(
        new CustomEvent("position:opened", {
          detail: { position: res.position },
        })
      );

      // ✅ success toast
      toast.success(`Order placed ✓ ${hint}`, { id: toastId });
    } catch (err: any) {
      // ❌ error toast
      const msg = err?.data?.error || "Failed to place order";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  /* ────────── render ────────── */
  return (
    <div className="relative border-t border-neutral-800 bg-neutral-950 p-3 rounded-t-lg">
      <div className="absolute -top-3 right-2 rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px]">
        spread ~ {Number.isFinite(spreadAbs) ? spreadAbs.toFixed(dp) : "–"} (
        {Number.isFinite(spreadPm) ? spreadPm.toFixed(2) : "–"}‰)
      </div>

      {/* Volume (lots) */}
      <div>
        <div className="mb-1 text-sm text-neutral-400">Volume (lots)</div>
        <div className="flex overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <button
            type="button"
            className="px-4 py-2 text-xl hover:bg-neutral-800"
            onClick={() => {
              const v = subLots(lots);
              setLots(v);
              setLotsText(v.toFixed(2));
            }}
          >
            −
          </button>

          <input
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            value={lotsText}
            onChange={onLotsChange}
            onBlur={onLotsBlur}
            onKeyDown={onLotsKey}
            className="flex-1 bg-transparent py-2 text-center font-semibold outline-none"
            aria-label="Lots"
          />

          <button
            type="button"
            className="px-4 py-2 text-xl hover:bg-neutral-800"
            onClick={() => {
              const v = addLots(lots);
              setLots(v);
              setLotsText(v.toFixed(2));
            }}
          >
            ＋
          </button>
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Step: 0.01 • Minimum: 0.01
        </div>
      </div>

      {/* Sell / Buy */}
      <div className="relative mt-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            className={`rounded-xl py-3 font-semibold ${
              side === "sell" ? "bg-red-500/90" : "bg-neutral-800"
            }`}
            onClick={() => setSide("sell")}
          >
            Sell {fmt(bid)}
          </button>
          <button
            className={`rounded-xl py-3 font-semibold ${
              side === "buy" ? "bg-blue-600/90" : "bg-neutral-800"
            }`}
            onClick={() => setSide("buy")}
          >
            Buy {fmt(ask)}
          </button>
        </div>

        {/* spread chip */}
        <div
          className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[12px] font-semibold text-neutral-300 shadow"
          title="Spread (Ask − Bid)"
        >
          {Number.isFinite(spreadAbs) ? spreadAbs.toFixed(dp) : "—"}
        </div>
      </div>

      {/* Confirm */}
      <div className="mt-3">
        <button
          disabled={!canTrade || isLoading || submitting}
          onClick={onConfirm}
          className={`w-full rounded-xl py-2.5 text-sm font-semibold ${
            side === "sell" ? "bg-red-600" : "bg-blue-600"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {submitting ? (
            "Placing…"
          ) : (
            <>
              Confirm {side === "sell" ? "Sell" : "Buy"} {lots.toFixed(2)} lots{" "}
              {fmt(pxForSide)}
            </>
          )}
        </button>
      </div>

      <div className="mt-2 text-xs text-neutral-400">
        Margin: {Number.isFinite(margin) ? margin.toFixed(2) : "–"}{" "}
        {account?.currency || "USD"} (1:{leverage})
      </div>
    </div>
  );
}
