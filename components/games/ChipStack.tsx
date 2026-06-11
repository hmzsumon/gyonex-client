// ChipStack.tsx
import React from "react";

export type ChipStackProps = {
  count?: number; // কয়টা চিপ
  color?: string; // বেস কালার
  stripe?: string; // স্ট্রাইপ কালার
  size?: number; // px
};

const ChipStack: React.FC<ChipStackProps> = ({
  count = 3,
  color = "#ef4444",
  stripe = "#ffffff",
  size = 24,
}) => {
  const items = Array.from({ length: Math.min(4, count) });
  return (
    <div className="relative" style={{ width: size + 12, height: size + 12 }}>
      {items.map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="absolute"
          style={{ left: i * 6, top: (items.length - i - 1) * 4 }}
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
      ))}
      {count > 4 && (
        <div className="absolute -right-1 -top-2 text-[10px] font-bold px-1.5 py-[1px] rounded-full bg-black/70 text-white">
          +{count - 4}
        </div>
      )}
    </div>
  );
};

export default ChipStack;
