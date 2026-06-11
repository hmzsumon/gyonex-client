"use client";

import { formatBalance } from "@/lib/functions";
import { ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

/* ── balance accordion used in Mobile ──────────────────────── */
export default function SidebarBalanceAccordion() {
  const { user } = useSelector((s: any) => s.auth);
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user?.customerId || "");
    } catch {}
  };

  return (
    <div className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900/60">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-3 text-sm"
      >
        <span className="flex items-center gap-2 font-medium">
          <span className="inline-flex items-center rounded-md px-2 py-1 ring-1 ring-neutral-800">
            {hide ? "••••" : `${formatBalance(user?.m_balance || 0)} USDT`}
          </span>
          <span className="text-neutral-400">Balance</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-neutral-800 p-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-300">Hide balance</span>
            <button
              type="button"
              onClick={() => setHide((s) => !s)}
              className={`relative h-5 w-9 rounded-full transition ${
                hide ? "bg-neutral-600" : "bg-neutral-700"
              }`}
              aria-pressed={hide}
            >
              <span
                className={`absolute top-[2px] h-4 w-4 rounded-full bg-white transition ${
                  hide ? "right-[2px]" : "left-[2px]"
                }`}
              />
            </button>
          </div>

          <div>
            <div className="text-lg font-semibold text-white">
              {hide ? "••••" : `${formatBalance(user?.m_balance || 0)} USDT`}
            </div>
            <div className="text-xs text-neutral-400">Investment wallet</div>
          </div>

          <div className="flex items-center justify-between">
            <code className="text-xs text-neutral-300">{user?.customerId}</code>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
