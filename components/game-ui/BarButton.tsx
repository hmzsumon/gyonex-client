import React from "react";

type BarButtonProps = {
  label?: string;
  onClick?: () => void;
  /** sm=40px, md=56px, lg=64px */
  size?: "sm" | "md" | "lg";
  /** বাটন ফুল-উইডথ হবে কি না */
  fullWidth?: boolean;
  /** গ্রেডিয়েন্ট রঙ (উপর→নিচ) */
  colors?: { start: string; mid?: string; end: string };
  /** টেক্সট কালার */
  textColor?: string;
  /** বর্ডার/রিং কালার (Tailwind ring var) */
  ringColor?: string;
  /** বর্ডার রেডিয়াস (px) */
  radius?: number;

  /** আইকন: react-icons/lucide component */
  Icon?: React.ComponentType<any>;
  /** অথবা রেডি ReactNode */
  icon?: React.ReactNode;
  /** আইকন কালার/সাইজ/গ্যাপ */
  iconColor?: string;
  iconSize?: number;
  gap?: number;

  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

const SIZES = {
  sm: { h: 40, px: 14, text: "text-[14px]" },
  md: { h: 56, px: 18, text: "text-[16px]" },
  lg: { h: 64, px: 22, text: "text-[18px]" },
};

const BarButton: React.FC<BarButtonProps> = ({
  label = "Deposit",
  onClick,
  size = "md",
  fullWidth = true,
  colors = { start: "#0b3f45", mid: "#08353c", end: "#05262d" }, // teal dark gradient
  textColor = "#ffd23a", // screenshot-ish yellow
  ringColor = "rgba(255,255,255,.10)",
  radius = 12,
  Icon,
  icon,
  iconColor = "#ffd23a",
  iconSize,
  gap = 10,
  className = "",
  disabled = false,
  ariaLabel,
}) => {
  const s = SIZES[size];
  const effectiveIconSize =
    iconSize ?? (size === "sm" ? 16 : size === "md" ? 18 : 20);

  const iconEl =
    icon ??
    (Icon ? (
      <Icon
        size={effectiveIconSize}
        color={iconColor}
        strokeWidth={2.5}
        style={{ color: iconColor }}
        aria-hidden="true"
      />
    ) : null);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      disabled={disabled}
      className={[
        "relative inline-flex items-center justify-center",
        fullWidth ? "w-full" : "w-auto",
        "select-none rounded-[12px]",
        "font-extrabold tracking-wide",
        s.text,
        "ring-1 focus:outline-none focus:ring-2",
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:brightness-110 active:translate-y-[1px]",
        "[box-shadow:0_10px_22px_rgba(0,0,0,.35)]",
        className,
      ].join(" ")}
      style={{
        height: s.h,
        paddingInline: s.px,
        width: fullWidth ? "100%" : undefined,
        background: `linear-gradient(180deg, ${colors.start} 0%, ${
          colors.mid || colors.start
        } 50%, ${colors.end} 100%)`,
        borderRadius: radius,
        color: textColor,
        // Tailwind ring color override
        ["--tw-ring-color" as any]: ringColor,
      }}
    >
      {/* inner bevel + edge highlight */}
      <span
        className="pointer-events-none absolute inset-[2px] rounded-inherit"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.18), inset 0 -12px 18px rgba(0,0,0,.35)",
        }}
      />
      {/* soft outer glow line (subtle) */}
      <span
        className="pointer-events-none absolute inset-0 rounded-inherit"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)",
        }}
      />
      {/* content */}
      <span
        className="relative inline-flex items-center justify-center"
        style={{ gap }}
      >
        {iconEl && <span className="leading-none">{iconEl}</span>}
        <span className="leading-none">{label}</span>
      </span>
    </button>
  );
};

export default BarButton;
