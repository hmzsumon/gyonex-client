// components/game-ui/ChipStack.tsx

/* ── Imports ─────────────────────────────────────────────────────────────── */
import React from "react";

/* ── Props ──────────────────────────────────────────────────────────────── */
export type ChipStackProps = {
  count?: number;
  color?: string;
  stripe?: string;
  size?: number;
  pile?: boolean; // true → overlap in place
  maxVisible?: number;
  showOverflowBadge?: boolean;
};

/* ── Component ──────────────────────────────────────────────────────────── */
const ChipStack: React.FC<ChipStackProps> = ({
  count = 3,
  color = "#ef4444",
  stripe = "#ffffff",
  size = 24,
  pile = false,
  maxVisible,
  showOverflowBadge = false,
}) => {
  const visible = Math.max(0, Math.min(maxVisible ?? count, count));
  const items = Array.from({ length: visible });
  const box = pile ? size : size + 12;

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div
      className="relative pointer-events-none"
      style={{ width: box, height: box }}
    >
      {items.map((_, i) => {
        const style: React.CSSProperties = pile
          ? {
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%) translateY(-${i * 2}px)`,
            }
          : { left: i * 6, top: (items.length - i - 1) * 4 };

        return (
          <svg
            key={i}
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className="absolute drop-shadow"
            style={style}
          >
            <circle cx="50" cy="50" r="46" fill={color} />
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke={stripe}
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="26"
              fill="none"
              stroke={stripe}
              strokeWidth="2"
            />
            <circle cx="50" cy="50" r="20" fill={color} />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <rect
                key={k}
                x="45"
                y="6"
                width="10"
                height="12"
                rx="2"
                fill={stripe}
                transform={`rotate(${k * 60} 50 50)`}
              />
            ))}
          </svg>
        );
      })}

      {showOverflowBadge && count > visible && (
        <div className="absolute -right-1 -top-2 text-[10px] font-bold px-1.5 py-[1px] rounded-full bg-black/70 text-white">
          +{count - visible}
        </div>
      )}
    </div>
  );
};

/* ── Exports ───────────────────────────────────────────────────────────── */
export default ChipStack;
