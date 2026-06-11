/* ──────────────────────────────────────────────────────────────────────────
   CurrencySheet — short list demo (আপনি চাইলে পুরো লিস্ট দিন)
────────────────────────────────────────────────────────────────────────── */
"use client";

const LIST = [
  ["US Dollar", "USD"],
  ["Bangladeshi Taka", "BDT"],
  ["Euro", "EUR"],
  ["British Pound", "GBP"],
  ["Chinese Yuan", "CNY"],
];

export default function CurrencySheet({
  current,
  onPick,
  onClose,
}: {
  current: "USD" | "BDT";
  onPick: (c: any) => void;
  onClose: () => void;
}) {
  return (
    <Sheet title="Currency" onClose={onClose}>
      <div className="px-4 pb-4">
        {LIST.map(([name, code]) => (
          <button
            key={code}
            onClick={() => onPick(code)}
            className="w-full flex items-center justify-between py-3"
          >
            <div>{name}</div>
            <div className="text-neutral-400">
              {code}
              {current === code ? " ✓" : ""}
            </div>
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
