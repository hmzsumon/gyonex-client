/* ────────── ClosedList: groups closed items by day ────────── */
"use client";

import DayHeader from "./DayHeader";
import PositionRow from "./PositionRow";
import { Position } from "./types";

function groupClosedByDay(list: Position[]) {
  const map = new Map<string, Position[]>();
  for (const p of list) {
    const key = p.closedAt ? new Date(p.closedAt).toDateString() : "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries()).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
}

export default function ClosedList({
  items,
  loading = false,
}: {
  items: Position[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-6 w-40 rounded bg-neutral-800 animate-pulse" />
        <div className="h-16 rounded-lg bg-neutral-800 animate-pulse" />
        <div className="h-16 rounded-lg bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
        No closed trades yet
      </div>
    );
  }

  const groups = groupClosedByDay(items);

  return (
    <div className="space-y-3">
      {groups.map(([day, list]) => (
        <div key={day}>
          <DayHeader date={new Date(day)} />
          <div className="space-y-2">
            {list.map((p) => (
              <PositionRow key={p.id} p={p} closed />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
