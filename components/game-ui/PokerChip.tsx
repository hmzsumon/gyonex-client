import React, { useId, useMemo } from "react";

type ChipColors = {
  /** outer body gradient (light→base→dark) */
  light?: string;
  base?: string;
  dark?: string;
  /** white stripes color */
  stripe?: string;
  /** center face color (optional) */
  face?: string;
  /** center text color */
  text?: string;
};

type PokerChipProps = {
  amount?: number; // প্রদর্শিত এমাউন্ট
  size?: number; // px (ডায়ামিটার)
  onClick?: (amount: number) => void;
  className?: string;
  disabled?: boolean;
  selected?: boolean;

  /** label override (amount না দেখিয়ে কাস্টম টেক্সট) */
  label?: string;

  /** "short" => 1.2k / 1m; "none" => raw */
  format?: "short" | "none";
  precision?: number; // short ফরম্যাটে দশমিক প্লেস (ডিফল্ট 0)
  prefix?: string; // eg. "$"
  suffix?: string; // eg. "x"

  colors?: ChipColors; // কাস্টম কালার
};

/** ডিফল্ট লাল চিপ রঙ */
const DEFAULT_COLORS: Required<ChipColors> = {
  light: "#ff6565",
  base: "#e52f2f",
  dark: "#a31212",
  stripe: "#ffffff",
  face: "#d32b2b",
  text: "#fff4cc",
};

const formatShort = (n: number, precision = 0) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const div = (d: number) => (abs / d).toFixed(precision);
  if (abs >= 1e9) return `${sign}${div(1e9)}b`;
  if (abs >= 1e6) return `${sign}${div(1e6)}m`;
  if (abs >= 1e3) return `${sign}${div(1e3)}k`;
  return `${n}`;
};

/** Re-usable Poker Chip */
const PokerChip: React.FC<PokerChipProps> = ({
  amount = 100,
  size = 96,
  onClick,
  className = "",
  disabled = false,
  selected = false,
  label,
  format = "short",
  precision = 0,
  prefix = "",
  suffix = "",
  colors = {},
}) => {
  const c = { ...DEFAULT_COLORS, ...colors };
  const id = useId(); // unique ids to avoid gradient collisions

  const display = useMemo(() => {
    if (label !== undefined) return label;
    const core =
      format === "short" ? formatShort(amount, precision) : `${amount}`;
    return `${prefix}${core}${suffix}`;
  }, [label, amount, format, precision, prefix, suffix]);

  return (
    <button
      type="button"
      aria-label={typeof label === "string" ? label : `Chip ${display}`}
      disabled={disabled}
      onClick={() => !disabled && onClick?.(amount)}
      className={[
        "relative inline-block select-none",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        selected ? "ring-2 ring-emerald-300/60" : "ring-0",
        className,
      ].join(" ")}
      style={{ width: size, height: size, borderRadius: "9999px" }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <defs>
          <radialGradient id={`gBody-${id}`} cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor={c.light} />
            <stop offset="55%" stopColor={c.base} />
            <stop offset="100%" stopColor={c.dark} />
          </radialGradient>
          <linearGradient id={`gRim-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".25" />
            <stop offset="100%" stopColor="#000000" stopOpacity=".25" />
          </linearGradient>
          <linearGradient id={`gFaceGloss-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter
            id={`shadow-${id}`}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="#000"
              floodOpacity=".35"
            />
          </filter>
        </defs>

        {/* soft ground shadow */}
        <ellipse cx="50" cy="92" rx="28" ry="7" fill="#000" opacity=".22" />

        {/* outer body */}
        <g filter="url(#shadow)">
          <circle cx="50" cy="50" r="44" fill={`url(#gBody-${id})`} />
          {/* outer rim bevel */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={`url(#gRim-${id})`}
            strokeWidth="2"
            opacity=".6"
          />
        </g>

        {/* white stripes (8 segments) */}
        <g fill={c.stripe}>
          {Array.from({ length: 8 }).map((_, i) => (
            <g transform={`rotate(${i * 45} 50 50)`} key={i}>
              {/* outer stripe */}
              <rect x="46" y="6" width="8" height="14" rx="2" />
              {/* inner stripe */}
              <rect x="46" y="26" width="8" height="8" rx="2" />
            </g>
          ))}
        </g>

        {/* inner ring with gaps (pseudo 3D) */}
        <g>
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#000"
            strokeOpacity=".18"
            strokeWidth="10"
          />
          {/* small radial notches */}
          {Array.from({ length: 16 }).map((_, i) => (
            <rect
              key={i}
              x="49.2"
              y="20"
              width="1.6"
              height="7"
              rx="1"
              transform={`rotate(${i * 22.5} 50 50) translate(0 0)`}
              fill="#000"
              opacity=".18"
            />
          ))}
        </g>

        {/* center face */}
        <g>
          <circle cx="50" cy="50" r="24" fill={c.face} />
          <rect
            x="32"
            y="32"
            width="36"
            height="12"
            rx="6"
            fill={`url(#gFaceGloss-${id})`}
          />
          <circle
            cx="50"
            cy="50"
            r="24"
            fill="none"
            stroke={`url(#gRim-${id})`}
            strokeWidth="1.5"
            opacity=".55"
          />
        </g>

        {/* amount text */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif"
          fill={c.text}
          style={{ letterSpacing: ".02em" }}
        >
          {display.toUpperCase()}
        </text>
      </svg>

      {/* hover/active微动画 */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: selected
            ? "0 0 0 3px rgba(16,185,129,.5), 0 8px 18px rgba(0,0,0,.35)"
            : "0 8px 18px rgba(0,0,0,.35)",
          transition: "transform .12s ease, filter .12s ease",
        }}
      />
    </button>
  );
};

export default PokerChip;
