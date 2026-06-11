import React, { useMemo } from "react";

type BWChipProps = {
  size?: number;
  baseColor?: string;
  stripeColor?: string;
  faceColor?: string;
  textColor?: string;

  amount?: number;
  label?: string;
  format?: "short" | "none";
  precision?: number;
  prefix?: string;
  suffix?: string;

  outerStripeCount?: number;
  innerNotchCount?: number;

  onClick?: (amount: number) => void;
  disabled?: boolean;

  /** NEW: selected visual state */
  selected?: boolean;
  /** NEW: scale on selected */
  selectedScale?: number; // default 1.06
  /** NEW: animation type on selected */
  animate?: "none" | "pulse" | "breathe"; // default "pulse"
  /** NEW: glow ring color */
  glowColor?: string; // default emerald glow

  className?: string;
};

const short = (n: number, p = 0) => {
  const a = Math.abs(n);
  const s = n < 0 ? "-" : "";
  const f = (d: number) => (a / d).toFixed(p);
  if (a >= 1e9) return `${s}${f(1e9)}b`;
  if (a >= 1e6) return `${s}${f(1e6)}m`;
  if (a >= 1e3) return `${s}${f(1e3)}k`;
  return `${n}`;
};

const BWChip: React.FC<BWChipProps> = ({
  size = 96,
  baseColor = "#181a1b",
  stripeColor = "#ffffff",
  faceColor = "#1f2123",
  textColor = "#ffffff",

  amount = 100,
  label,
  format = "short",
  precision = 0,
  prefix = "",
  suffix = "",

  outerStripeCount = 6,
  innerNotchCount = 12,

  onClick,
  disabled = false,

  /** NEW props */
  selected = false,
  selectedScale = 1.06,
  animate = "pulse",
  glowColor = "rgba(16,185,129,.55)",

  className = "",
}) => {
  const display = useMemo(() => {
    if (label !== undefined) return label;
    const core = format === "short" ? short(amount, precision) : `${amount}`;
    return `${prefix}${core}${suffix}`;
  }, [label, amount, format, precision, prefix, suffix]);

  const scale = selected ? selectedScale : 1;

  return (
    <button
      type="button"
      aria-label={typeof label === "string" ? label : `Chip ${display}`}
      aria-pressed={selected}
      onClick={() => !disabled && onClick?.(amount)}
      disabled={disabled}
      className={[
        "relative inline-block select-none",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        className,
      ].join(" ")}
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        transform: `translateZ(0) scale(${scale})`,
        transition: "transform .18s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      {/* keyframes (কম্পোনেন্টের ভিতরেই inject) */}
      <style>{`
        @keyframes bwchip-breathe {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes bwchip-ringPulse {
          0%   { box-shadow: 0 0 0 0 var(--chip-glow, rgba(16,185,129,.55)); opacity: .9; }
          70%  { box-shadow: 0 0 0 14px rgba(0,0,0,0); opacity: 0; }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* ground shadow */}
        <ellipse cx="50" cy="92" rx="26" ry="7" fill="#000" opacity=".18" />

        {/* outer body */}
        <circle cx="50" cy="50" r="46" fill={baseColor} />

        {/* outer big stripes */}
        <g fill={stripeColor}>
          {Array.from({ length: outerStripeCount }).map((_, i) => (
            <g
              transform={`rotate(${(360 / outerStripeCount) * i} 50 50)`}
              key={i}
            >
              <rect x="45" y="4" width="10" height="14" rx="2" />
            </g>
          ))}
        </g>

        {/* ring pair */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={stripeColor}
          strokeWidth="5"
        />
        <circle
          cx="50"
          cy="50"
          r="31"
          fill="none"
          stroke={stripeColor}
          strokeWidth="2.2"
        />

        {/* inner notches */}
        <g fill={stripeColor}>
          {Array.from({ length: innerNotchCount }).map((_, i) => (
            <rect
              key={i}
              x="49"
              y="20"
              width="2"
              height="6"
              rx="1"
              transform={`rotate(${(360 / innerNotchCount) * i} 50 50)`}
            />
          ))}
        </g>

        {/* center face */}
        <circle cx="50" cy="50" r="23" fill={faceColor} />
        <circle
          cx="50"
          cy="50"
          r="23"
          fill="none"
          stroke={stripeColor}
          strokeWidth="1.5"
          opacity=".9"
        />

        {/* amount */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif"
          fill={textColor}
          style={{ letterSpacing: ".02em" }}
        >
          {display.toUpperCase()}
        </text>
      </svg>

      {/* static glow ring + elevation */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: selected
            ? `0 0 0 3px ${glowColor}, 0 8px 18px rgba(0,0,0,.35)`
            : "0 8px 18px rgba(0,0,0,.35)",
          transition: "box-shadow .18s ease",
        }}
      />

      {/* animated pulse/breathe overlay */}
      {selected && animate !== "none" && (
        <span
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -2,
            ["--chip-glow" as any]: glowColor,
            animation:
              animate === "breathe"
                ? "bwchip-breathe 1.4s ease-in-out infinite"
                : "bwchip-ringPulse 1.4s ease-out infinite",
          }}
        />
      )}
    </button>
  );
};

export default BWChip;
