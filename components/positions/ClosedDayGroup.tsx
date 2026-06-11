// components/positions/ClosedDayGroup.tsx
"use client";

import { dayHeader } from "@/utils/dt";
import ClosedItemRow from "./ClosedItemRow";

export default function ClosedDayGroup({
  day,
  items,
  onPick,
}: {
  day: Date;
  items: any[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="mb-4">
      <div className="px-1 py-2 text-sm font-semibold text-neutral-400">
        {dayHeader(day)}
      </div>
      <div className="space-y-2">
        {items.map((it) => (
          <ClosedItemRow key={it._id} item={it} onClick={onPick} />
        ))}
      </div>
    </div>
  );
}
