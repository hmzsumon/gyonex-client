"use client";

import TermCard from "./TermCard";

export type TermOption = {
  id: string;
  labelTop: string;
  labelBottom?: string;
  apr: number;
  apr2?: number;
  userSharePercent?: number;
};

type Props = {
  terms: TermOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const TermSelector = ({ terms, selectedId, onSelect }: Props) => {
  return (
    <div className="relative">
      <div
        className="
          flex gap-2 overflow-x-auto pb-2
          [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden
        "
      >
        {terms.map((t) => (
          <TermCard
            key={t.id}
            option={t}
            selected={t.id === selectedId}
            onClick={() => onSelect(t.id)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-1 mt-2 opacity-60">
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>
    </div>
  );
};

export default TermSelector;
