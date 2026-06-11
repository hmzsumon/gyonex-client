/* ──────────────────────────────────────────────────────────────────────────
   NicknameSheet — input + validation (no special chars)
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useState } from "react";

export default function NicknameSheet({
  current,
  onSave,
  onClose,
}: {
  current: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState(current);

  const ok = /^[A-Za-z0-9 _-]{0,36}$/.test(val);

  return (
    <Sheet title="Nickname" onClose={onClose}>
      <div className="p-4 space-y-4">
        <p className="text-sm text-neutral-400">
          Give this account a custom name to find it faster.
        </p>
        <input
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 outline-none"
          placeholder="My Pro MT5"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <div className="text-xs text-neutral-500">
          Nicknames can't contain special characters: &lt;&gt;”'&amp;?^*#@
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 py-3 rounded-xl border border-neutral-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-semibold disabled:opacity-50"
            disabled={!ok}
            onClick={() => onSave(val)}
          >
            Save changes
          </button>
        </div>
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
