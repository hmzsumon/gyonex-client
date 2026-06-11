"use client";

import React from "react";
import { FiAlertTriangle, FiGift, FiInfo } from "react-icons/fi";

/* ── helper generic panel ──────────────────────────────────── */
function InfoPanel({
  title,
  tone = "neutral",
  icon,
  children,
}: {
  title: string;
  tone?: "neutral" | "warning" | "success";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const tones = {
    neutral: "border-emerald-900/30 bg-emerald-500/5 text-emerald-200",
    warning: "border-yellow-900/30 bg-yellow-500/10 text-yellow-200",
    success: "border-green-900/30 bg-green-500/10 text-green-200",
  } as const;

  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <h4 className="mb-2 flex items-center text-sm font-medium">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-black/20">
          {icon}
        </span>
        {title}
      </h4>
      <div className="space-y-1.5 text-xs opacity-90">{children}</div>
    </div>
  );
}

/* ── concrete panels ───────────────────────────────────────── */
export function DepositGuidelines({
  min,
  network,
}: {
  min: number;
  network: string;
}) {
  return (
    <InfoPanel title="Deposit guidelines" tone="neutral" icon={<FiInfo />}>
      <p>
        <span className="font-semibold">Minimum deposit:</span> ${min} USDT
      </p>
      <p>
        <span className="font-semibold">Network:</span> {network} only
      </p>
      <p>
        <span className="font-semibold">Processing time:</span> 1–3
        confirmations (~5–15 minutes)
      </p>
    </InfoPanel>
  );
}

export function DepositSecurity({ network }: { network: string }) {
  return (
    <InfoPanel
      title="Security notice"
      tone="warning"
      icon={<FiAlertTriangle />}
    >
      <p>
        Never send directly from an exchange wallet; withdraw to your own wallet
        first.
      </p>
      <p>Double-check the network before sending. We only support {network}.</p>
      <p>For large deposits, consider sending a small test amount first.</p>
    </InfoPanel>
  );
}

export function DepositBonus() {
  return (
    <InfoPanel title="Bonus information" tone="success" icon={<FiGift />}>
      <p>
        <span className="font-semibold">5% bonus</span> on deposits over $10,000
        USDT.
      </p>
      <p>Bonuses are credited automatically after confirmation.</p>
      <p>Bonus amounts are subject to terms and conditions.</p>
    </InfoPanel>
  );
}
