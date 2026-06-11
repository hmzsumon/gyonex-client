"use client";

import type { TermOption } from "./TermSelector";

type Props = {
  option: TermOption;
  selected?: boolean;
  onClick?: () => void;
};

const TermCard = ({ option, selected, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={[
        "min-w-[130px] rounded-xl px-2 py-3 text-left border",
        "bg-[#141b23] active:scale-[0.99] transition",
        selected
          ? "border-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
          : "border-white/10",
      ].join(" ")}
    >
      <div className="text-xs font-semibold text-white/90">
        {option.labelTop}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-xl font-bold">
          {option.apr.toFixed(2).replace(/\.00$/, "")}%
        </div>
        <div className="text-xs text-white/50 mb-1">
          {option.labelBottom ?? "APR"}
        </div>
      </div>
    </button>
  );
};

export default TermCard;
