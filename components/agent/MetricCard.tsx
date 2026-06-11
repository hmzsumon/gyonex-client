/* ── Metric Card ──────────────────────────────────────────────────────────── */

"use client";

type Props = {
  label: string;
  amount: string; // "0.00 USD"
  suffix?: string; // "(USD)" for Volume per screenshot
  onMore?: () => void;
};

const MetricCard: React.FC<Props> = ({ label, amount, suffix, onMore }) => {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-2">
      <div>
        <p className="text-sm font-bold text-neutral-100">{amount}</p>
        {suffix ? <p className="text-xs text-neutral-400">{suffix}</p> : null}
        <p className="mt-1 text-xs text-neutral-300">{label}</p>
      </div>
    </div>
  );
};

export default MetricCard;
