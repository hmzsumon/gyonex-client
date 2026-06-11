/* ── Invitation Method (code + link with copy) ────────────────────────────── */

"use client";

import { Copy } from "lucide-react";

type Props = {
  referralCode: string;
  referralLink: string;
};

const CopyRow: React.FC<{
  label: string;
  value: string;
  onCopy?: () => void;
}> = ({ label, value, onCopy }) => {
  return (
    <div className="space-y-2">
      <p className="text-xs text-neutral-400">{label}</p>
      <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
        <span className="truncate text-sm text-neutral-200">{value}</span>
        <button
          type="button"
          onClick={onCopy}
          className="ml-3 shrink-0 rounded-md p-1 text-neutral-300 hover:text-white"
          aria-label="Copy"
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
};

const InvitationMethod: React.FC<Props> = ({ referralCode, referralLink }) => {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // best-effort, no toast here to keep the demo minimal
    }
  };

  return (
    <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
      <CopyRow
        label="Referral Code"
        value={referralCode}
        onCopy={() => copy(referralCode)}
      />
      <div className="h-3" />
      <CopyRow
        label="Referral Link"
        value={referralLink}
        onCopy={() => copy(referralLink)}
      />
    </section>
  );
};

export default InvitationMethod;
