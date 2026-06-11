// components/fruit-loops/RulesBtn.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import React from "react";

/* ── Props ─────────────────────────────────────────────────────────────── */
type RulesBtnProps = {
  label?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  colors?: {
    start: string;
    mid: string;
    end: string;
  } /* ── Comment like this──────────────────────────────────────────────────────────── */;
  textColor?: string;
  ringColor?: string;
  disabled?: boolean /* ── Comment like this──────────────────────────────────────────────────────────── */;
};

/* ── Size map ──────────────────────────────────────────────────────────── */
const SIZES = {
  sm: { h: "h-8", px: "px-3", text: "text-[13px]" },
  md: { h: "h-10", px: "px-5", text: "text-[16px]" },
  lg: { h: "h-12", px: "px-6", text: "text-[18px]" },
};

/* ── Component ─────────────────────────────────────────────────────────── */
const RulesBtn: React.FC<RulesBtnProps> = ({
  label = "Rules",
  onClick,
  size = "md",
  className = "",
  colors = { start: "#b36cff", mid: "#8e39f5", end: "#6a17da" }, // default purple
  textColor = "#ffffff",
  ringColor,
  disabled = false /* ── Comment like this──────────────────────────────────────────────────────────── */,
}) => {
  const s = SIZES[size];

  /* ── Handlers ───────────────────────────────────────────────────────── */
  const handleClick = () => {
    if (disabled)
      return; /* ── Comment like this──────────────────────────────────────────────────────────── */
    onClick?.();
  };

  /* ── Inline style (gradient + ring override) ────────────────────────── */
  const style: React.CSSProperties = {
    background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 54%, ${colors.end} 100%)`,
    color: textColor,
    ...(ringColor
      ? ({ ["--tw-ring-color"]: ringColor } as React.CSSProperties)
      : {}),
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      disabled={
        disabled
      } /* ── Comment like this──────────────────────────────────────────────────────────── */
      aria-disabled={
        disabled
      } /* ── Comment like this──────────────────────────────────────────────────────────── */
      className={[
        "relative inline-flex items-center justify-center",
        s.h,
        s.px,
        "rounded-full font-extrabold tracking-wide",
        s.text,
        "ring-1 focus:outline-none focus:ring-2",
        "[box-shadow:0_8px_16px_rgba(0,0,0,.35)]",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:brightness-110 active:translate-y-[1px]" /* ── Comment like this──────────────────────────────────────────────────────────── */,
        className,
      ].join(" ")}
      style={style}
    >
      {/* ── Top glossy highlight ───────────────────────────────────────── */}
      <span
        className="pointer-events-none absolute inset-x-1 top-1 h-[58%] rounded-full
                   bg-[linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,0))]
                   opacity-90"
      />
      {/* ── Subtle inner bevel ─────────────────────────────────────────── */}
      <span
        className="pointer-events-none absolute inset-[3px] rounded-full
                   [box-shadow:inset_0_0_0_1px_rgba(255,255,255,.45),inset_0_-10px_14px_rgba(0,0,0,.25)]"
      />
      {/* ── Label ──────────────────────────────────────────────────────── */}
      <span className="relative drop-shadow-[0_2px_2px_rgba(0,0,0,.35)]">
        {label}
      </span>
    </button>
  );
};

export default RulesBtn;

/* ── ApplePotProps ───────────────────────────────────────────────────── */
