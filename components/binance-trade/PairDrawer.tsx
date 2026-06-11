// components/trade/PairDrawer.tsx
"use client";

import {
  useGetSpotBalancesQuery,
  useGetTradingPairsQuery,
  type TradingPair,
} from "@/redux/features/binance-trade/binance-tradeApi";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { Side } from "./TradeLayout";

interface PairDrawerProps {
  open: boolean;
  selectedSymbol: string;
  side: Side;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

interface MiniTickerRaw {
  s: string;
  c: string; // last
  o: string; // open
  v: string; // volume (base asset)
}

interface MiniTicker {
  lastPrice: number;
  changePercent: number;
  volume: number;
}
type TickerMap = Record<string, MiniTicker>;

type TabKey =
  | "ALL"
  | "POPULAR"
  | "MOST_POPULAR"
  | "TRENDING"
  | "NEW"
  | "BEST_SELLER"
  | "FEATURED"
  | "PINNED";

const TABS: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "POPULAR", label: "Popular" },
  { key: "MOST_POPULAR", label: "Most Popular" },
  { key: "TRENDING", label: "Trending" },
  { key: "NEW", label: "New" },
  { key: "BEST_SELLER", label: "Best Seller" },
  { key: "FEATURED", label: "Featured" },
  { key: "PINNED", label: "Pinned" },
];

const DEFAULT_ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzFmMjkzNyIvPjxwYXRoIGQ9Ik0xNiA4QzEyLjY4NiA4IDEwIDEwLjY4NiAxMCAxNEMxMCAxNy4zMTQgMTIuNjg2IDIwIDE2IDIwQzE5LjMxNCAyMCAyMiAxNy4zMTQgMjIgMTRDMjIgMTAuNjg2IDE5LjMxNCA4IDE2IDhaIiBmaWxsPSIjNjQ3NDhiIi8+PC9zdmc+";

const PairDrawer: React.FC<PairDrawerProps> = ({
  open,
  selectedSymbol,
  side,
  onClose,
  onSelectSymbol,
}) => {
  const [tickers, setTickers] = useState<TickerMap>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");

  const { user } = useSelector((state: any) => state.auth);

  // 👉 Spot wallet balances (SELL filter)
  const { data: spotBalances, isLoading: balancesLoading } =
    useGetSpotBalancesQuery(undefined, {
      skip: !user?._id,
    });

  const ownedSymbols = useMemo(() => {
    if (!spotBalances) return [];
    return spotBalances
      .filter((w) => w.qty > 0)
      .map((w) => w.symbol.toUpperCase());
  }, [spotBalances]);

  // 🔎 debounce search (network কমানোর জন্য)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  // ✅ tab => query map
  const queryArgs = useMemo(() => {
    const base: any = {
      page: 1,
      limit: 250, // বড় লিস্ট চাইলে বাড়াও
      sort: "serialNo",
      order: "asc",
      enabled: true,
    };

    if (debouncedSearch) base.search = debouncedSearch;

    switch (activeTab) {
      case "POPULAR":
        base.popular = true;
        break;
      case "MOST_POPULAR":
        base.mostPopular = true;
        break;
      case "TRENDING":
        base.trending = true;
        break;
      case "NEW":
        base.newListing = true;
        break;
      case "BEST_SELLER":
        base.bestSeller = true;
        break;
      case "FEATURED":
        base.featured = true;
        break;
      case "PINNED":
        base.pinned = true;
        break;
      default:
        break;
    }

    return base;
  }, [activeTab, debouncedSearch]);

  // ✅ DB থেকে pairs আনো (drawer open না হলে কল করবে না)
  const { data: pairRes, isLoading: pairsLoading } = useGetTradingPairsQuery(
    queryArgs,
    { skip: !open }
  );

  const allPairs = useMemo(() => {
    const items = pairRes?.items ?? [];
    // শুধু USDT pairs দেখাতে চাইলে:
    return items.filter((p) => p.quoteAsset?.toUpperCase?.() === "USDT");
  }, [pairRes]);

  // SELL হলে ownedSymbols অনুযায়ী filter
  const visiblePairs = useMemo(() => {
    let list: TradingPair[] =
      side === "sell"
        ? allPairs.filter((p) => ownedSymbols.includes(p.symbol.toUpperCase()))
        : allPairs;

    // Local quick filter (server search সহ রেখেছি, তারপরও UX smooth থাকে)
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.symbol.toLowerCase().includes(q) ||
          p.baseAsset.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allPairs, side, ownedSymbols, search]);

  // WebSocket miniTicker: visiblePairs অনুযায়ী tickers update
  useEffect(() => {
    if (!open) return;

    const symbolSet = new Set(
      (visiblePairs ?? []).map((p) => p.symbol.toUpperCase())
    );

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const arr = JSON.parse(event.data) as MiniTickerRaw[];
        if (!Array.isArray(arr)) return;

        setTickers((prev) => {
          const next: TickerMap = { ...prev };

          arr.forEach((t) => {
            const sym = String(t.s || "").toUpperCase();
            if (!symbolSet.has(sym)) return;

            const last = parseFloat(t.c);
            const openP = parseFloat(t.o);
            const vol = parseFloat(t.v);

            let changePercent = 0;
            if (openP && !Number.isNaN(openP) && !Number.isNaN(last)) {
              changePercent = ((last - openP) / openP) * 100;
            }

            next[sym] = {
              lastPrice: Number.isNaN(last) ? 0 : last,
              changePercent: Number.isNaN(changePercent) ? 0 : changePercent,
              volume: Number.isNaN(vol) ? 0 : vol,
            };
          });

          return next;
        });
      } catch (error) {
        console.error("pair drawer miniTicker parse error", error);
      }
    };

    return () => ws.close();
  }, [open, visiblePairs]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full rounded-t-3xl bg-slate-950 px-3 pb-4 pt-2 shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-700" />

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search (BTC, ETH...)"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const active = t.key === activeTab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] ${
                  active
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-slate-900/70 text-slate-300 border border-slate-800"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* SELL hint */}
        {side === "sell" && (
          <div className="mb-2 text-[10px] text-slate-500">
            {balancesLoading
              ? "Loading balances..."
              : "Showing only coins you own"}
          </div>
        )}

        {/* Header */}
        <div className="mb-1 flex justify-between text-[10px] text-slate-400">
          <span>Name / Vol</span>
          <span>Last Price • 24h Chg</span>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto pb-2 pr-2">
          {(pairsLoading ? [] : visiblePairs).map((p) => {
            const symbol = p.symbol.toUpperCase();
            const t = tickers[symbol];

            const rawChange = t?.changePercent ?? 0;
            const change = Number.isNaN(rawChange) ? 0 : rawChange;
            const isDown = change < 0;
            const isActive = symbol === selectedSymbol.toUpperCase();

            const icon = p.iconUrl || DEFAULT_ICON;

            return (
              <button
                key={symbol}
                type="button"
                onClick={() => onSelectSymbol(symbol)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left ${
                  isActive ? "bg-slate-800/80" : "hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Icon */}
                  <img
                    src={icon}
                    alt={p.baseAsset}
                    className="h-7 w-7 rounded-full bg-slate-800"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_ICON;
                    }}
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[13px] font-medium">
                        {symbol.replace("USDT", "/USDT")}
                      </div>

                      {/* small badges */}
                      {p.isPinned && (
                        <span className="rounded bg-slate-800 px-1.5 py-[1px] text-[10px] text-yellow-400">
                          PIN
                        </span>
                      )}
                      {p.isTrending && (
                        <span className="rounded bg-slate-800 px-1.5 py-[1px] text-[10px] text-emerald-300">
                          HOT
                        </span>
                      )}
                      {p.isNewListing && (
                        <span className="rounded bg-slate-800 px-1.5 py-[1px] text-[10px] text-sky-300">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="mt-[2px] text-[11px] text-slate-500">
                      Vol{" "}
                      {t
                        ? t.volume.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "--"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-[13px] ${
                      isDown ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {t ? t.lastPrice.toLocaleString() : "--"}
                  </div>
                  <div
                    className={`mt-[2px] text-[11px] ${
                      isDown ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {t ? `${change.toFixed(2)}%` : "--"}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Empty / Loading */}
          {pairsLoading && (
            <div className="py-6 text-center text-xs text-slate-500">
              Loading pairs...
            </div>
          )}

          {!pairsLoading && visiblePairs.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500">
              {side === "sell"
                ? balancesLoading
                  ? "Loading balances..."
                  : "You don't own any of these pairs yet"
                : "No results"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PairDrawer;
