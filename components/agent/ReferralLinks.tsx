/* ── Referral Links Section ──────────────────────────────────────────────── */

"use client";

import { Copy, QrCode } from "lucide-react";

type LinkItem = {
  title: string; // "Meta Trader 4"
  subtitle: string; // "Standard L20 Swap Free:"
  url: string;
};

const Item: React.FC<LinkItem> = ({ title, subtitle, url }) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <h4 className="text-sm font-semibold text-neutral-100">{title}</h4>
      <p className="text-xs text-neutral-400">{subtitle}</p>

      <div className="mt-2 flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
        <span className="truncate text-sm text-neutral-200">{url}</span>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="rounded p-1 text-neutral-300 hover:text-white"
            aria-label="Copy"
            onClick={copy}
          >
            <Copy size={16} />
          </button>
          <button
            type="button"
            className="rounded p-1 text-neutral-300 hover:text-white"
            aria-label="QR"
          >
            <QrCode size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ReferralLinks: React.FC = () => {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-neutral-200">Referral links</h3>
      <Item
        title="Meta Trader 4"
        subtitle="Standard L20 Swap Free:"
        url="https://mygtcportal.com/getview?view=register&token=efs6owv"
      />
      {/* Add more <Item /> as needed */}
    </section>
  );
};

export default ReferralLinks;
