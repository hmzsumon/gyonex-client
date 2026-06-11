// components/trade/parts/InstrumentDrawer.tsx
"use client";

import {
  useGetCryptoSymbolsQuery,
  useGetMostCryptoQuery,
} from "@/redux/features/crypto/cryptoApi";
import { useEffect, useMemo, useState } from "react";

type Tab = "favorites" | "most" | "crypto";
const tabs: { key: Tab; label: string }[] = [
  { key: "favorites", label: "Favorites" },
  { key: "most", label: "Most traded" },
  { key: "crypto", label: "Crypto" },
];

export default function InstrumentDrawer({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (symbol: string) => void; // raw (e.g. BTCUSDT)
}) {
  const [tab, setTab] = useState<Tab>("most");

  // fetch (RTK Query uses baseUrl + cookies)
  const {
    data: mostData,
    isFetching: mostLoading,
    isError: mostErr,
  } = useGetMostCryptoQuery(undefined, { skip: !open });
  const {
    data: symData,
    isFetching: symLoading,
    isError: symErr,
  } = useGetCryptoSymbolsQuery(undefined, { skip: !open });

  // safe list builder (hooks always run)
  const list = useMemo(() => {
    if (!open)
      return [] as {
        symbol: string;
        name: string;
        last?: number;
        change?: number;
      }[];

    if (tab === "most") {
      return (mostData?.mostTraded ?? []).map((r) => ({
        symbol: r.symbol,
        name: r.display,
        last: r.last,
        change: r.change,
      }));
    }
    if (tab === "crypto") {
      return (symData?.symbols ?? []).map((s) => ({
        symbol: s.symbol,
        name: s.display,
      }));
    }
    return [];
  }, [tab, open, mostData, symData]);

  useEffect(() => {
    if (!open) setTab("most");
  }, [open]);

  if (!open) return null;

  const loading = tab === "most" ? mostLoading : symLoading;
  const error = tab === "most" ? mostErr : symErr;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl">
        <div className="py-2 flex justify-center">
          <span className="w-12 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Tabs */}
        <div className="px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 border-b border-neutral-800">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-3 whitespace-nowrap text-sm ${
                  tab === t.key ? "border-b-2 border-white" : "text-neutral-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="p-6 text-center text-sm text-neutral-400">
            Loading…
          </div>
        )}
        {error && (
          <div className="p-6 text-center text-sm text-red-400">
            Failed to load.
          </div>
        )}

        {!loading && !error && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
            {list.length === 0 && (
              <div className="text-center text-neutral-400 text-sm py-6">
                {tab === "favorites"
                  ? "No favorites yet."
                  : "No instruments found."}
              </div>
            )}
            {list.map((it) => (
              <button
                key={it.symbol}
                onClick={() => onPick(it.symbol)}
                className="w-full rounded-2xl bg-neutral-900 border border-neutral-800 px-4 py-3 text-left hover:bg-neutral-800/60 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{fmtDisplay(it.symbol)}</div>
                    <div className="text-xs text-neutral-400">{it.name}</div>
                  </div>
                  {"last" in it ? (
                    <div className="text-right">
                      <div>{(it as any).last.toLocaleString()}</div>
                      <div
                        className={
                          (it as any).change >= 0
                            ? "text-green-400 text-xs"
                            : "text-red-400 text-xs"
                        }
                      >
                        {(it as any).change >= 0 ? "↑" : "↓"}{" "}
                        {Math.abs((it as any).change).toFixed(2)}%
                      </div>
                    </div>
                  ) : (
                    <div className="text-right text-xs text-neutral-500">
                      Select
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function fmtDisplay(sym: string) {
  if (sym.endsWith("USDT")) return sym.replace("USDT", "/USD");
  if (sym.length === 6) return `${sym.slice(0, 3)}/${sym.slice(3)}`;
  return sym.replace("-", "/");
}
