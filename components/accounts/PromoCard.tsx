/* ──────────────────────────────────────────────────────────────────────────
   PromoCard — “Trade with 3x fewer stop outs.” banner
────────────────────────────────────────────────────────────────────────── */
export default function PromoCard() {
  return (
    <div className="mt-4 rounded-lg bg-neutral-950 border border-neutral-800 py-4 px-2 flex items-center gap-3">
      <img
        src="/assets/tick_sign.webp"
        alt="tick"
        className="w-10 h-10 object-contain"
      />
      <div>
        <div className="text-sm font-semibold">Trade with fewer stop outs.</div>
        <div className="text-xs text-neutral-400">
          Trade with the lowest Stop Out Level in the market.
        </div>
      </div>
    </div>
  );
}
