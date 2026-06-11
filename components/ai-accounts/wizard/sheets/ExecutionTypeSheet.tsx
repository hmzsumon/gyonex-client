/* ──────────────────────────────────────────────────────────────────────────
   ExecutionTypeSheet — Market / Instant
────────────────────────────────────────────────────────────────────────── */
"use client";

export default function ExecutionTypeSheet({
  current,
  onPick,
  onClose,
}: {
  current: "market" | "instant";
  onPick: (t: "market" | "instant") => void;
  onClose: () => void;
}) {
  return (
    <Sheet title="Execution type" onClose={onClose}>
      <div className="px-4 pb-4">
        {[
          ["Market", "market"],
          ["Instant", "instant"],
        ].map(([label, val]) => (
          <button
            key={val}
            className="w-full flex items-center justify-between py-3"
            onClick={() => onPick(val as any)}
          >
            <div>{label}</div>
            {current === val && <div className="text-neutral-400">✓</div>}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

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
