import React from "react";

type CircleIconButtonProps = {
  /** পুরো বাটনের ডায়ামিটার (px) */
  size?: number;
  /** গ্রেডিয়েন্ট কালার (উপর → মাঝ → নিচ) */
  colors?: { start: string; mid: string; end: string };
  /** টেইলউইন্ড ring color override (e.g. "rgba(255,255,255,.45)") */
  ringColor?: string;
  /** ভেতরের আইকন: কম্পোনেন্ট টাইপ (react-icons/lucide) */
  Icon?: React.ComponentType<any>;
  /** অথবা রেডিমেড ReactNode */
  icon?: React.ReactNode;
  /** আইকনের রঙ */
  iconColor?: string;
  /** lucide-এর মতো লাইন-আইকনের স্ট্রোক-উইডথ */
  iconStrokeWidth?: number;
  /** আইকনের স্কেল (বাটনের সাথে), 0-1 */
  iconScale?: number; // default 0.62
  /** Y-অক্ষ বরাবর নাজ (px, +ve => নিচে) */
  iconOffsetY?: number;
  onClick?: () => void;
  className?: string;
  label?: string; // a11y label
  disabled?: boolean;
};

const CircleIconButton: React.FC<CircleIconButtonProps> = ({
  size = 44,
  colors = { start: "#b36cff", mid: "#8e39f5", end: "#6a17da" }, // ডিফল্ট পার্পল
  ringColor = "rgba(255,255,255,.35)",
  Icon,
  icon,
  iconColor = "#fff",
  iconStrokeWidth,
  iconScale = 0.62,
  iconOffsetY = 0,
  onClick,
  className = "",
  label = "Action",
  disabled = false,
}) => {
  const innerSize = Math.round(size * iconScale);

  const content =
    icon ??
    (Icon ? (
      <Icon
        size={innerSize}
        color={iconColor}
        strokeWidth={iconStrokeWidth}
        style={{ color: iconColor }}
        aria-hidden="true"
      />
    ) : (
      // ফালব্যাক (X)
      <svg
        width={innerSize}
        height={innerSize}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <g stroke={iconColor} strokeWidth="3.6" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </g>
      </svg>
    ));

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        "relative inline-grid place-items-center rounded-full select-none",
        "ring-1 focus:outline-none focus:ring-2",
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:brightness-110 active:translate-y-[1px]",
        "[box-shadow:0_10px_18px_rgba(0,0,0,.35)]",
        "overflow-hidden", // আইকন ক্রপড থাকবে
        className,
      ].join(" ")}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 54%, ${colors.end} 100%)`,
        // Tailwind ring color var
        ["--tw-ring-color" as any]: ringColor,
      }}
    >
      {/* Top glossy highlight */}
      <span
        className="pointer-events-none absolute inset-x-1 top-1 rounded-full"
        style={{
          height: Math.max(10, Math.round(size * 0.55)),
          background:
            "linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,0))",
          opacity: 0.9,
        }}
      />
      {/* Subtle inner bevel */}
      <span
        className="pointer-events-none absolute inset-[3px] rounded-full"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,.45), inset 0 -10px 14px rgba(0,0,0,.25)",
        }}
      />
      {/* Icon */}
      <span
        className="relative pointer-events-none flex items-center justify-center"
        style={{ transform: `translateY(${iconOffsetY}px)`, color: iconColor }}
      >
        {content}
      </span>
    </button>
  );
};

export default CircleIconButton;
