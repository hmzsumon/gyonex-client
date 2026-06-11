/* ── Referral Header ───────────────────────────────────────────────────────── */

"use client";

import { ChevronLeft, SquareGanttChart } from "lucide-react";
import Link from "next/link";

const ReferralHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900/60 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
        {/* ── Back ── */}
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-300 hover:text-white"
        >
          <ChevronLeft size={20} />
        </Link>

        {/* ── Title ── */}
        <h1 className="text-sm font-medium text-neutral-100">Invite Friends</h1>

        {/* ── Top-right icon (dummy) ── */}
        <button
          type="button"
          className="rounded-md p-1.5 text-neutral-300 hover:text-white"
          aria-label="More"
        >
          <SquareGanttChart size={18} />
        </button>
      </div>
    </header>
  );
};

export default ReferralHeader;
