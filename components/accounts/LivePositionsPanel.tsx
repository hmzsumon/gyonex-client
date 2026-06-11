"use client";

import { useState } from "react";
import LiveClosedList from "./LiveClosedList";
import LiveOpenList from "./LiveOpenList";
import type { Position } from "./types";

const demoClosed: Position[] = [];
function badge(n: number) {
  return (
    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-neutral-700 px-1.5 text-[10px] font-semibold text-neutral-200">
      {n}
    </span>
  );
}

export default function LivePositionsPanel() {
  const [tab, setTab] = useState<"open" | "closed">("open");
  // const { count } = useFilteredOpenPositions();
  const count = 0;

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
          {count > 0 && badge(count)}
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
      {tab === "open" ? <LiveOpenList /> : <LiveClosedList />}
    </div>
  );
}
