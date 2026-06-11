"use client";

export type StakingTabKey = "active" | "completed" | "all";

export default function StakingTabs({
  value,
  onChange,
}: {
  value: StakingTabKey;
  onChange: (v: StakingTabKey) => void;
}) {
  const btn = (k: StakingTabKey, label: string) => {
    const active = value === k;
    return (
      <button
        onClick={() => onChange(k)}
        className={[
          "px-3 py-2 rounded-xl text-sm",
          active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
      {btn("active", "Active")}
      {btn("completed", "Completed")}
      {btn("all", "All")}
    </div>
  );
}
