"use client";

import { PiggyBank } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
        <PiggyBank className="h-6 w-6 text-white/80" />
      </div>

      <h3 className="mt-4 text-base font-semibold">No staking yet</h3>
      <p className="mt-1 text-sm text-white/60">
        Start staking to earn daily profit.
      </p>

      <Link
        href="/staking-earn"
        className="mt-5 inline-flex rounded-xl bg-[#f0c34d] text-black px-4 py-2 text-sm font-semibold"
      >
        Start Staking
      </Link>
    </div>
  );
}
