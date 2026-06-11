"use client";

import { useMemo, useState } from "react";

/** —— Demo types —— */
type Side = "buy" | "sell";
type Position = {
  id: string;
  symbol: string; // e.g. "BTC"
  side: Side; // "buy"|"sell"
  lots: number; // e.g. 1.00
  entryPrice: number; // e.g. 122435.86
  lastPrice?: number; // optional (for showing tiny quote at right)
  pnlUsd: number; // +/-
  tag?: "TP" | "SL" | null;
  closedAt?: string; // ISO Date (for Closed list grouping)
};

/** —— Demo data (আপনি পরে API থেকে দেবেন) —— */
const demoOpen: Position[] = [
  {
    id: "op1",
    symbol: "BTC",
    side: "buy",
    lots: 1.0,
    entryPrice: 122435.86,
    lastPrice: 122491.71,
    pnlUsd: 55.85,
  },
];

const demoClosed: Position[] = [
  {
    id: "cl1",
    symbol: "BTC",
    side: "buy",
    lots: 1.0,
    entryPrice: 120628.74,
    pnlUsd: 2.0,
    tag: "TP",
    closedAt: "2025-10-03T20:30:00.000Z",
  },
  {
    id: "cl2",
    symbol: "BTC",
    side: "sell",
    lots: 1.0,
    entryPrice: 120567.55,
    pnlUsd: 1.38,
    tag: "TP",
    closedAt: "2025-10-03T18:10:00.000Z",
  },
  {
    id: "cl3",
    symbol: "BTC",
    side: "buy",
    lots: 1.0,
    entryPrice: 120100.17,
    pnlUsd: 40.87,
    tag: "TP",
    closedAt: "2025-10-02T15:45:00.000Z",
  },
];

/** —— Utils —— */
function fmt2(n?: number) {
  return Number.isFinite(n as number) ? (n as number).toFixed(2) : "—";
}
function badge(n: number) {
  return (
    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-neutral-700 px-1.5 text-[10px] font-semibold text-neutral-200">
      {n}
    </span>
  );
}
function DayHeader({ date }: { date: Date }) {
  const today = new Date();
  const d = date.toDateString();
  const y = new Date(today.getTime() - 24 * 3600 * 1000).toDateString();
  const label =
    d === today.toDateString()
      ? "Today"
      : d === y
      ? "Yesterday"
      : date.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  return (
    <div className="mt-3 mb-1 text-xs font-medium text-neutral-400">
      {label}
    </div>
  );
}

/** —— Single row (Open/Closed shared) —— */
function PositionRow({ p, closed }: { p: Position; closed?: boolean }) {
  const sideClr =
    p.side === "buy"
      ? "text-emerald-400 border-emerald-500/30"
      : "text-red-400 border-red-500/30";
  const pnlClr = p.pnlUsd >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2">
      <div className="flex items-center gap-2">
        {/* coin bullet */}

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-200">
            <span>{p.symbol}</span>
            <span>
              {p.tag ? (
                <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300 border border-neutral-700">
                  {p.tag}
                </span>
              ) : null}
            </span>
          </div>
          <div className="text-xs text-neutral-400">
            <span
              className={`mr-1 rounded px-1.5 py-0.5 text-[10px] border ${sideClr}`}
            >
              {p.side.toUpperCase()}
            </span>{" "}
            {p.lots.toFixed(2)} lot at {fmt2(p.entryPrice)}
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className={`text-sm font-semibold ${pnlClr}`}>
          {(p.pnlUsd >= 0 ? "+" : "") + fmt2(p.pnlUsd)} USD
        </div>
        {!closed && (
          <div className="text-[11px] text-neutral-500">
            {fmt2(p.lastPrice)}
          </div>
        )}
      </div>
    </div>
  );
}

/** —— Group closed by day —— */
function groupClosedByDay(list: Position[]) {
  const map = new Map<string, Position[]>();
  for (const p of list) {
    const dayKey = p.closedAt ? new Date(p.closedAt).toDateString() : "Unknown";
    if (!map.has(dayKey)) map.set(dayKey, []);
    map.get(dayKey)!.push(p);
  }
  // newest day first
  return Array.from(map.entries()).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
}

/** —— Main component —— */
export default function AiPositionsPanel() {
  const [tab, setTab] = useState<"open" | "closed">("open");

  // demo data hooks (আপনি পরে API দিয়ে বদলাবেন)
  const openList = demoOpen;
  const closedList = demoClosed;

  const openCount = openList.length;
  const groupedClosed = useMemo(
    () => groupClosedByDay(closedList),
    [closedList]
  );

  return (
    <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-3">
      {/* Tabs */}
      <div className="mb-3 flex items-center gap-6 text-sm border-b border-neutral-800 pb-3">
        <button
          onClick={() => setTab("open")}
          className={`relative pb-1 ${
            tab === "open"
              ? "text-neutral-100"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Open
          {openCount > 0 && badge(openCount)}
          {tab === "open" && (
            <span className="absolute -bottom-[2.5px] left-0 h-[1.5px] w-full bg-neutral-200 rounded" />
          )}
        </button>

        <button
          onClick={() => setTab("closed")}
          className={`relative pb-1 ${
            tab === "closed"
              ? "text-neutral-100"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Closed
          {tab === "closed" && (
            <span className="absolute -bottom-[2.5px] left-0 h-[1.5px] w-full bg-neutral-200 rounded" />
          )}
        </button>
      </div>

      {/* Body */}
      {tab === "open" ? (
        <div>
          {openList.length === 0 ? (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
              No open positions
            </div>
          ) : (
            <div className="space-y-2">
              {/* Total P/L row */}
              <div className="flex items-center justify-between px-1 pb-1 text-sm">
                <div className="text-neutral-400">Total P/L</div>
                <div className="font-semibold text-emerald-400">
                  +{fmt2(openList.reduce((s, p) => s + p.pnlUsd, 0))} USD
                </div>
              </div>

              {openList.map((p) => (
                <PositionRow key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {groupedClosed.length === 0 ? (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
              No closed trades yet
            </div>
          ) : (
            <div className="space-y-3">
              {groupedClosed.map(([day, items]) => (
                <div key={day}>
                  <DayHeader date={new Date(day)} />
                  <div className="space-y-2">
                    {items.map((p) => (
                      <PositionRow key={p.id} p={p} closed />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
