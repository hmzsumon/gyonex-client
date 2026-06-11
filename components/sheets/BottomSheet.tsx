// components/sheets/BottomSheet.tsx
"use client";

/* ── bottom sheet (slide-up drawer) ───────────────────────── */
import { X } from "lucide-react";

export default function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* sheet */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 z-50 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2",
          "rounded-t-2xl border-t border-neutral-800 bg-neutral-950 shadow-2xl",
          "transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <div className="text-sm font-semibold text-neutral-200">{title}</div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
