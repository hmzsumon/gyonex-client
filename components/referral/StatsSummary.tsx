/* ── Stats Summary (Ready to claim + counters) ────────────────────────────── */

"use client";

type Props = {
  readyAmount?: string; // e.g. "0.00"
  invited?: number;
  processing?: string; // e.g. "0.00"
  settled?: string; // e.g. "0.00"
};

const StatRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <span className="text-xs text-neutral-400">{label}</span>
    <span className="mt-1 text-sm font-semibold text-neutral-200">{value}</span>
  </div>
);

const StatsSummary: React.FC<Props> = ({
  readyAmount = "0.00",
  invited = 0,
  processing = "0.00",
  settled = "0.00",
}) => {
  return (
    <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
      {/* ── Ready to Claim (USDT) ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-400">Ready to claim (USDT)</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-neutral-50">
            {readyAmount}
          </p>
        </div>

        {/* ── Claim button is intentionally omitted (marked "No need") ── */}
      </div>

      {/* ── Divider ── */}
      <div className="my-4 h-px w-full bg-neutral-900" />

      {/* ── 3 columns ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatRow label="Invited friends" value={String(invited)} />
        <StatRow label="Processing (USDT)" value={processing} />
        <StatRow label="Settled (USDT)" value={settled} />
      </div>
    </section>
  );
};

export default StatsSummary;
