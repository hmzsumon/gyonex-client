// FILE: components/dashboard/TransferSection.tsx
"use client";
import { ChevronRight } from "lucide-react";

function SelectRow({ label }: { label: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left">
      <span className="text-sm">{label}</span>
      <ChevronRight className="h-4 w-4 opacity-60" />
    </button>
  );
}

export function TransferSection() {
  return (
    <div className="space-y-3">
      <SelectRow label="Transfer from" />
      <SelectRow label="Transfer to" />
      <button className="w-full rounded-2xl bg-[#5b4a7f] py-3 text-center text-base font-semibold">
        Continue
      </button>
    </div>
  );
}
