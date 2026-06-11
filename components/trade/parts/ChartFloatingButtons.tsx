// components/trade/parts/ChartFloatingButtons.tsx
"use client";

import { Maximize2, RotateCcw } from "lucide-react";

export default function ChartFloatingButtons({
  onFullscreen,
  onReset,
}: {
  onFullscreen: () => void;
  onReset: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute right-2 top-2 flex gap-2">
      <button
        onClick={onReset}
        className="grid h-8 w-8 place-items-center rounded-md bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700"
        title="Reset zoom"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <button
        onClick={onFullscreen}
        className="grid h-8 w-8 place-items-center rounded-md bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700"
        title="Fullscreen"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
