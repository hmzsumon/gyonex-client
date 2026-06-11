/* ──────────────────────────────────────────────────────────────────────────
   LeverageSheet — list with risk colors + "Custom leverage"
────────────────────────────────────────────────────────────────────────── */
"use client";

const OPTIONS: Array<number | "unlimited"> = [
  "unlimited",
  2000,
  1000,
  800,
  600,
  500,
  400,
  200,
  100,
  50,
  20,
  2,
];

export default function LeverageSheet({
  current,
  onPick,
  onClose,
}: {
  current: number | "unlimited";
  onPick: (v: number | "unlimited") => void;
  onClose: () => void;
}) {
  return (
    <Sheet title="Max leverage" onClose={onClose}>
      <div className="px-4 pb-4 space-y-1">
        {OPTIONS.map((opt) => {
          const active = opt === current;
          const ratio = opt === "unlimited" ? "Unlimited" : opt;
          const color =
            typeof opt === "number"
              ? opt >= 500
                ? "bg-red-600"
                : opt >= 100
                ? "bg-yellow-500"
                : "bg-green-600"
              : "bg-red-600";

          return (
            <button
              key={String(opt)}
              className="w-full flex items-center justify-between py-3"
              onClick={() => onPick(opt)}
            >
              <div className="flex items-center gap-3">
                <span className={`w-1 h-5 rounded ${color}`} />
                <span>1:{ratio}</span>
              </div>
              {active && (
                <span className="text-sm text-neutral-400">High ✓</span>
              )}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

/* simple sheet wrapper */
function Sheet({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end">
      <div className="w-full bg-neutral-950 border-t border-neutral-800 rounded-t-2xl">
        <div className="p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="opacity-70">
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
