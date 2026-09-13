"use client";

/* ────────── client lucky card component imports ────────── */
import type {
  LuckyCardRow,
  LuckyPurchaseRow,
  LuckyShopCardType,
} from "@/redux/features/lucky-card/luckyCardTypes";
import Link from "next/link";
import { ReactNode } from "react";

/* ────────── currency helper (project currency = USDT) ────────── */
export const usdt = (n: any) => `${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT`;

/* ────────── hero ────────── */
export function LuckyHero({ balance }: { balance?: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 via-[#0E1014] to-[#0E1014] p-5">
      <p className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
        🍀 Lucky Card
      </p>
      <h1 className="text-2xl font-black text-white">Scratch &amp; Win USDT</h1>
      <p className="mt-1 max-w-xl text-sm text-white/50">
        Buy a package, scratch each card and reveal your prize instantly. Every
        purchase feeds a shared, provably-fair global prize pool.
      </p>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
        <div>
          <p className="text-xs text-white/45">Your balance</p>
          <p className="text-xl font-black text-white">{usdt(balance)}</p>
        </div>
        <Link
          href="/deposit"
          className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-black text-black"
        >
          Deposit
        </Link>
      </div>
    </div>
  );
}

/* ────────── tabs ────────── */
export function LuckyTabs({
  active,
  onChange,
  unopenedCount,
}: {
  active: "shop" | "cards";
  onChange: (tab: "shop" | "cards") => void;
  unopenedCount: number;
}) {
  return (
    <div className="flex rounded-2xl border border-white/10 bg-[#0E1014] p-1 text-sm">
      {(["shop", "cards"] as const).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 rounded-xl py-2.5 font-bold transition ${
            active === t ? "bg-emerald-400 text-black" : "text-white/50 hover:text-white"
          }`}
        >
          {t === "shop" ? "Shop" : `My Cards (${unopenedCount})`}
        </button>
      ))}
    </div>
  );
}

/* ────────── shop list ────────── */
export function LuckyShopList({
  shop,
  loading,
  busyPackageId,
  onBuy,
}: {
  shop: LuckyShopCardType[];
  loading: boolean;
  busyPackageId: string | null;
  onBuy: (packageId: string, price: number) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-3xl bg-white/[0.04]" />
        ))}
      </div>
    );
  }

  if (!shop.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0E1014] px-6 py-16 text-center">
        <p className="text-white/50">No lucky card types available right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shop.map((t) => (
        <div key={t._id} className="space-y-3 rounded-3xl border border-white/10 bg-[#0E1014] p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-black" style={{ color: t.accent }}>
              {t.name}
            </p>
            <p className="text-xs text-white/45">{usdt(t.price)}/card · RTP {t.rtp}%</p>
          </div>

          <div className="rounded-2xl border border-amber-300/25 bg-gradient-to-br from-amber-300/15 to-transparent px-4 py-3 text-center">
            <p className="text-[11px] uppercase tracking-wide text-amber-200/70">Top Prize</p>
            <p className="text-2xl font-black text-amber-300 drop-shadow">{usdt(t.topPrize)}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {t.packages.map((p) => {
              const hasOffer = Number(p.regularPrice || 0) > Number(p.price || 0);
              const busy = busyPackageId === p._id;
              return (
                <button
                  key={p._id}
                  disabled={busy}
                  onClick={() => onBuy(p._id, p.price)}
                  className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center transition hover:border-emerald-400/60 disabled:opacity-50"
                >
                  {hasOffer && (
                    <span className="absolute -right-1 -top-2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                      -{p.discountPercent}%
                    </span>
                  )}
                  <p className="text-lg font-black text-white">{p.totalCards}</p>
                  <p className="text-[10px] text-white/40">cards</p>
                  {hasOffer && (
                    <p className="text-[10px] font-medium text-white/30 line-through">
                      {usdt(p.regularPrice)}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs font-black text-emerald-300">
                    {busy ? "…" : usdt(p.price)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────── my cards grid (unopened + opened history) ────────── */
export function LuckyMyCards({
  unopened,
  opened,
  onGoShop,
}: {
  unopened: LuckyCardRow[];
  opened: LuckyCardRow[];
  onGoShop: () => void;
}) {
  return (
    <div className="space-y-4">
      {unopened.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0E1014] p-6 text-center text-sm text-white/45">
          No cards yet.{" "}
          <button className="font-bold text-emerald-300" onClick={onGoShop}>
            Go to shop
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {unopened.map((c) => (
          <Link
            key={c._id}
            href={`/lucky-cards/${c._id}`}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 p-3"
            style={{ background: `linear-gradient(150deg, ${c.accent}33, #141a2e)` }}
          >
            {c.source === "gift" && (
              <span className="absolute right-2 top-2 rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-black text-black">
                GIFT
              </span>
            )}
            <span className="text-2xl">🍀</span>
            <p className="absolute bottom-8 left-3 text-sm font-bold text-white">{c.cardType}</p>
            <p className="absolute bottom-3 left-3 text-[10px] text-white/40">{c.shortCode}</p>
            <span className="absolute bottom-3 right-3 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80">
              Scratch
            </span>
          </Link>
        ))}
      </div>

      {opened.length > 0 && (
        <div className="space-y-1.5">
          <p className="mt-2 text-sm font-bold text-white/60">Opened cards</p>
          {opened.map((c) => (
            <div
              key={c._id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1014] px-3 py-2.5 text-sm"
            >
              <div>
                <p className="font-bold text-white">{c.cardType}</p>
                <p className="text-[11px] text-white/40">{c.shortCode}</p>
              </div>
              <span className={c.win ? "font-black text-emerald-400" : "text-white/40"}>
                {c.win ? `+ ${usdt(c.prizeAmount)}` : "Good luck 🍀"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────── purchase history list ────────── */
export function LuckyPurchaseHistory({ purchases }: { purchases: LuckyPurchaseRow[] }) {
  if (!purchases.length) return null;
  return (
    <div className="space-y-1.5">
      <p className="mt-2 text-sm font-bold text-white/60">Purchase history</p>
      {purchases.map((p) => (
        <div
          key={p._id}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1014] px-3 py-2.5 text-xs"
        >
          <div>
            <p className="font-bold text-white">
              {p.cardType} · {p.quantity} cards
            </p>
            <p className="text-white/40">{new Date(p.createdAt).toLocaleString()}</p>
          </div>
          <span className="font-black text-white/80">
            {p.source === "gift" ? "🎁 Gift" : usdt(p.totalPrice)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ────────── simple section wrapper ────────── */
export function LuckySection({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-[#E6E6E6]">{children}</div>;
}
