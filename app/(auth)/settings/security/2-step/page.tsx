"use client";

import Link from "next/link";

/* ── 2FA overview ─────────────────────────────────────────── */
export default function TwoStepPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8 pt-4">
      <h1 className="px-4 text-3xl font-extrabold tracking-tight text-neutral-100">
        2-Step verification
      </h1>

      <p className="px-4 text-neutral-300">
        2-step verification ensures that all sensitive transactions are
        authorized by you. We encourage you to enter verification codes to
        confirm these transactions.
      </p>

      <div className="mx-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4">
        <div className="text-sm text-neutral-400">Security type</div>
        <div className="mb-4 text-neutral-100">za••••um@gmail.com</div>
        <Link
          href="/settings/security/2-step/change"
          className="block w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-center font-medium text-neutral-200 hover:border-neutral-700"
        >
          Change
        </Link>
      </div>
    </div>
  );
}
