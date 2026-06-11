"use client";

import React from "react";

/* ── props ─────────────────────────────────────────────────── */
type Props = {
  isLoading: boolean;
  qr: string | null;
  loadingSlot?: React.ReactNode;
};

/* ── component ─────────────────────────────────────────────── */
export default function QRCodeCard({ isLoading, qr, loadingSlot }: Props) {
  return (
    <div className="rounded-xl border border-emerald-900/30 bg-emerald-500/10 p-4 text-center">
      {isLoading ? (
        loadingSlot || <div className="h-48 w-48" />
      ) : (
        <div className="mx-auto mb-3 flex h-48 w-48 items-center justify-center rounded-md bg-neutral-900/60">
          {qr ? (
            <img
              src={qr}
              alt="Deposit QR code"
              className="h-full w-full rounded-md object-contain"
            />
          ) : (
            <div className="text-sm text-neutral-400">No QR available</div>
          )}
        </div>
      )}
      <p className="text-sm text-emerald-300">
        {isLoading ? "Generating QR code…" : "Scan the QR to deposit"}
      </p>
    </div>
  );
}
