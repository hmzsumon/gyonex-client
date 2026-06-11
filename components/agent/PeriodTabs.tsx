/* ── Period Tabs ──────────────────────────────────────────────────────────── */

"use client";

type Range = "yesterday" | "lastWeek" | "thisMonth" | "lastMonth";

const labels: Record<Range, string> = {
  yesterday: "Yesterday",
  lastWeek: "Last week",
  thisMonth: "This Month",
  lastMonth: "Last month",
};

const PeriodTabs: React.FC<{ value: Range; onChange: (v: Range) => void }> = ({
  value,
  onChange,
}) => {
  const btn = (k: Range) => (
    <button
      key={k}
      onClick={() => onChange(k)}
      className={`rounded-md border px-3 py-1.5 text-xs ${
        value === k
          ? "border-neutral-700 bg-neutral-800 text-neutral-100"
          : "border-transparent bg-transparent text-neutral-400 hover:text-neutral-200"
      }`}
    >
      {labels[k]}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {(["yesterday", "lastWeek", "thisMonth", "lastMonth"] as Range[]).map(
        btn
      )}
    </div>
  );
};

export default PeriodTabs;
