/* ────────── LookupModeToggle ────────── */
"use client";

export default function LookupModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: "auto" | "email" | "customerId";
  onChange: (m: "auto" | "email" | "customerId") => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-start gap-1">
      <span className="text-sm text-neutral-400">Send By:</span>
      <div className="grid grid-cols-2 overflow-hidden rounded-md border border-neutral-700 text-xs">
        {(["email", "customerId"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`px-2 py-1 ${
              mode === m
                ? "bg-neutral-700 text-neutral-100"
                : "bg-neutral-900 text-neutral-400"
            }`}
            onClick={() => onChange(m)}
            disabled={disabled}
          >
            {m === "customerId" ? "User ID" : m[0].toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
