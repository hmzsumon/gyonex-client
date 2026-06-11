// components/settings/security/RadioRow.tsx
"use client";

/* ── radio row used by settings list ──────────────────────── */
import { Edit2 } from "lucide-react";

export default function RadioRow({
  label,
  sub,
  value,
  selected,
  onChange,
  onEdit,
}: {
  label: string;
  sub?: string;
  value: "email" | "phone" | "password";
  selected: "email" | "phone" | "password";
  onChange: (v: "email" | "phone" | "password") => void;
  onEdit: (v: "email" | "phone" | "password") => void;
}) {
  const active = selected === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className="group flex w-full items-center gap-3 border-b border-neutral-800/70 px-4 py-4 text-left last:border-b-0 hover:bg-neutral-900/40"
    >
      <span
        className={[
          "grid h-5 w-5 place-items-center rounded-full border",
          active
            ? "border-emerald-500 ring-4 ring-emerald-500/20"
            : "border-neutral-600",
        ].join(" ")}
      >
        <span
          className={[
            "h-2.5 w-2.5 rounded-full",
            active ? "bg-emerald-500" : "bg-transparent",
          ].join(" ")}
        />
      </span>

      <div className="flex-1">
        <div className="text-[15px] font-medium text-neutral-100">{label}</div>
        {sub ? <div className="text-sm text-neutral-400">{sub}</div> : null}
      </div>

      {/* ── edit at far-right ───────────────────────────────── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(value);
        }}
        className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-900"
        title={`Edit ${label}`}
      >
        <span className="inline-flex items-center gap-1">
          <Edit2 className="h-3.5 w-3.5" /> Edit
        </span>
      </button>
    </button>
  );
}
