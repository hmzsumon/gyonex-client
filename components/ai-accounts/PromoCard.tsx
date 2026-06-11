/* ──────────────────────────────────────────────────────────────────────────
   PromoCard — “Trade with 3x fewer stop outs.” banner
────────────────────────────────────────────────────────────────────────── */
export default function PromoCard() {
  return (
    <div className="mt-4 rounded-lg bg-neutral-950 border border-neutral-800 py-3 flex items-center gap-2">
      <img
        src="/assets/tick_sign.webp"
        alt="tick"
        className="w-12 h-12 object-contain"
      />
      <div>
        <div className="text-sm font-semibold">
          Trade smarter with Smart—fewer stop-outs.
        </div>
        <div className="text-xs text-neutral-400">
          Adaptive risk engine targets one of the lowest Stop Out Levels in the
          market.
        </div>
      </div>
    </div>
  );
}
