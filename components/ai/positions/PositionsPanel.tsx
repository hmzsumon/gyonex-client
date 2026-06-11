/* ────────── PositionsPanel (tabs: open / closed) ────────── */
"use client";

import { useFilteredClosedPositions } from "@/hooks/ai/useFilteredClosedPositions"; // ⬅️ NEW
import { useFilteredOpenPositions } from "@/hooks/ai/useFilteredOpenPositions";
import { useState } from "react";
import ClosedList from "./ClosedList";
import OpenList from "./OpenList";

function badge(n: number) {
  return (
    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-neutral-700 px-1.5 text-[10px] font-semibold text-neutral-200">
      {n}
    </span>
  );
}

export default function PositionsPanel() {
  const [tab, setTab] = useState<"open" | "closed">("open");

  const { count: openCount } = useFilteredOpenPositions();
  const {
    items: closedItems,
    count: closedCount,
    loading: closedLoading,
  } = useFilteredClosedPositions(); // ⬅️ get API data

  return (
    <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-3">
      {/* Tabs */}
      <div className="mb-3 flex items-center gap-6 border-b border-neutral-800 pb-3 text-sm">
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
            <span className="absolute -bottom-[2.5px] left-0 h-[1.5px] w-full rounded bg-neutral-200" />
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
          {closedCount > 0 && badge(closedCount)}
          {tab === "closed" && (
            <span className="absolute -bottom-[2.5px] left-0 h-[1.5px] w-full rounded bg-neutral-200" />
          )}
        </button>
      </div>

      {/* Body */}
      {tab === "open" ? (
        <OpenList />
      ) : (
        <ClosedList items={closedItems} loading={closedLoading} />
      )}
    </div>
  );
}
