/* ── Invitation Method (with copy toast) ─────────────────────────────────── */

"use client";

import { Copy } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

/* ── Row ─────────────────────────────────────────────────────────────────── */
const Row: React.FC<{
  label: string;
  value: string;
  copyText: string;
}> = ({ label, value, copyText }) => {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-neutral-900/90 px-3 py-2">
      <span className="text-sm text-neutral-400">{label}</span>

      <div className="ml-3 flex items-center gap-2">
        <span className="truncate text-sm font-semibold text-neutral-100">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Copy ${label}`}
          onClick={onCopy}
          className="rounded p-1 text-neutral-300 hover:text-white"
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
};

/* ── Section ─────────────────────────────────────────────────────────────── */
const InvitationMethod: React.FC<{
  code: string;
  link: string;
  fullLink: string;
  fullCode: string;
}> = ({ code, link, fullLink, fullCode }) => {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-4">
      <h3 className="mb-3 text-sm font-semibold text-neutral-200">
        Invitation Method
      </h3>

      <div className="space-y-2">
        <Row label="Referral Code" value={code} copyText={fullCode} />
        <Row label="Referral Link" value={link} copyText={fullLink} />
      </div>
    </section>
  );
};

export default InvitationMethod;
