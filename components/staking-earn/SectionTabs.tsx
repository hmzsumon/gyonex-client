"use client";

export type TabKey = "summary" | "rules";

type Props = {
  active: TabKey;
  onChange: (k: TabKey) => void;
};

const SectionTabs = ({ active, onChange }: Props) => {
  return (
    <div className="flex items-center gap-6 border-b border-white/10">
      <button
        onClick={() => onChange("summary")}
        className={[
          "py-3 text-sm",
          active === "summary" ? "text-white font-semibold" : "text-white/50",
        ].join(" ")}
      >
        Summary
        {active === "summary" && (
          <div className="h-0.5 bg-[#f0c34d] mt-2 rounded-full w-6" />
        )}
      </button>

      <button
        onClick={() => onChange("rules")}
        className={[
          "py-3 text-sm",
          active === "rules" ? "text-white font-semibold" : "text-white/50",
        ].join(" ")}
      >
        Product Rules
        {active === "rules" && (
          <div className="h-0.5 bg-[#f0c34d] mt-2 rounded-full w-10" />
        )}
      </button>
    </div>
  );
};

export default SectionTabs;
