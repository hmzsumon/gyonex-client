"use client";
import { setDrawerOpen, setSymbol } from "@/redux/features/trade/tradeSlice";
import { useDispatch, useSelector } from "react-redux";

const CATS = [
  "Favorites",
  "Most",
  "Majors",
  "Metals",
  "Crypto",
  "Indices",
  "Stocks",
] as const;
const ITEMS = [
  {
    symbol: "XAUUSD",
    name: "Gold vs US Dollar",
    cat: "Metals",
    price: 3687.197,
    chg: +0.28,
  },
  {
    symbol: "XAGUSD",
    name: "Silver vs US Dollar",
    cat: "Metals",
    price: 42.794,
    chg: +0.43,
  },
  {
    symbol: "EURUSD",
    name: "Euro vs US Dollar",
    cat: "Majors",
    price: 1.181,
    chg: +0.4,
  },
  {
    symbol: "USDJPY",
    name: "US Dollar vs Japanese Yen",
    cat: "Majors",
    price: 147.005,
    chg: -0.27,
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin vs US Dollar",
    cat: "Crypto",
    price: 115379.84,
    chg: -0.01,
  },
  {
    symbol: "ETHUSD",
    name: "Ethereum vs US Dollar",
    cat: "Crypto",
    price: 4499.35,
    chg: -0.53,
  },
] as const;

export default function InstrumentDrawer() {
  const open = useSelector((s: any) => s.trade.drawerOpen);
  const dispatch = useDispatch();
  const [tab, setTab] = useState<(typeof CATS)[number]>("Most");

  if (!open) return null;
  const list = ITEMS.filter(
    (i) =>
      i.cat === tab ||
      (tab === "Most" && ["XAUUSD", "BTCUSD", "EURUSD"].includes(i.symbol))
  );

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => dispatch(setDrawerOpen(false))}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl">
        <div className="py-1 flex justify-center">
          <span className="w-12 h-1 rounded-full bg-neutral-700" />
        </div>
        {/* Tabs */}
        <div className="px-4 flex gap-6 overflow-x-auto border-b border-neutral-800">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`py-3 text-sm whitespace-nowrap ${
                tab === c ? "border-b-2 border-white" : "text-neutral-400"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="grow" />
          <button className="px-2 py-3 text-neutral-400">🔍</button>
        </div>

        {/* List */}
        <div className="max-h-[62vh] overflow-y-auto p-4 space-y-3">
          {list.map((row) => (
            <button
              key={row.symbol}
              onClick={() => {
                dispatch(setSymbol(row.symbol));
                dispatch(setDrawerOpen(false));
              }}
              className="w-full text-left rounded-2xl bg-neutral-900 border border-neutral-800 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{row.symbol}</div>
                <div
                  className={`${
                    row.chg >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {row.price}
                </div>
              </div>
              <div className="text-xs text-neutral-400">{row.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
