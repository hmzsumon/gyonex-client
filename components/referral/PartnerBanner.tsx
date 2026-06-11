/* ── Partner Banner (CTA card) ────────────────────────────────────────────── */

"use client";

import { MailPlus } from "lucide-react";
import Link from "next/link";

const PartnerBanner: React.FC = () => {
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="rounded-lg bg-neutral-900 p-2">
          <MailPlus size={18} className="text-neutral-100" />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-100">
              Become a partner and earn more
            </p>
            <p className="text-xs text-neutral-400">Join now</p>
          </div>
          <Link
            href="#"
            className="text-xs font-medium text-neutral-200 underline underline-offset-4 hover:text-white"
          >
            Join now &rsaquo;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PartnerBanner;
