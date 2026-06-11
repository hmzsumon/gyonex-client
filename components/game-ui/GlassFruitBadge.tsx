// GlassFruitBadge.tsx
import React from "react";

type Colors = {
  start?: string; // top
  mid?: string; // middle
  end?: string; // bottom
};

type GlassFruitBadgeProps = {
  size?: number; // ডায়ামিটার (px)
  colors?: Colors; // ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট
  ringColor?: string; // সাদা রিং-এর রঙ/অপাসিটি
  shadowOpacity?: number; // ড্রপ-শ্যাডোর তীব্রতা

  // কন্টেন্ট — যেকোনো একটি ব্যবহার করুন
  emoji?: string; // যেমন "🥭" "🍎" "🍉"
  icon?: React.ReactNode; // react-icons/lucide JSX
  src?: string; // ইমেজ url (png/svg/webp)

  iconSize?: number; // কনটেন্ট সাইজ (px); না দিলে size থেকে গণনা
  iconColor?: string; // Icon (stroke/fill) কালার
  offsetY?: number; // কনটেন্টের Y-offset (px)

  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

const GlassFruitBadge: React.FC<GlassFruitBadgeProps> = ({
  size = 64,
  colors = { start: "#bdeef1", mid: "#86d4e6", end: "#5bbad3" }, // aqua/teal
  ringColor = "rgba(255,255,255,.80)",
  shadowOpacity = 0.35,

  emoji,
  icon,
  src,

  iconSize,
  iconColor = "#fff",
  offsetY = 0,

  onClick,
  className = "",
  ariaLabel = "Fruit icon",
}) => {
  const cSize = iconSize ?? Math.round(size * 0.55);
  const inset1 = Math.round(size * 0.1); // outer ring inset
  const inset2 = Math.round(size * 0.22); // inner ring inset
  const ringW = Math.max(1, Math.round(size * 0.033)); // ring thickness

  const content = src ? (
    <img
      src={src}
      alt=""
      width={cSize}
      height={cSize}
      className="object-contain"
    />
  ) : emoji ? (
    <span style={{ fontSize: cSize, lineHeight: 1 }}>{emoji}</span>
  ) : icon ? (
    <span style={{ fontSize: cSize, color: iconColor }}>{icon}</span>
  ) : (
    <span style={{ fontSize: cSize }}>🍓</span> // fallback
  );

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        "relative inline-grid place-items-center rounded-full select-none",
        onClick ? "cursor-pointer" : "cursor-default",
        className,
      ].join(" ")}
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        // base glass plate
        background: `linear-gradient(180deg, ${colors.start ?? "#cbeff3"} 0%,
                                                ${
                                                  colors.mid ??
                                                  colors.start ??
                                                  "#99dceb"
                                                } 55%,
                                                ${
                                                  colors.end ??
                                                  colors.mid ??
                                                  "#66c2da"
                                                } 100%)`,
        boxShadow: `0 ${Math.round(size * 0.18)}px ${Math.round(
          size * 0.24
        )}px rgba(0,0,0,${shadowOpacity})`,
      }}
    >
      {/* glossy top sheen */}
      <span
        className="pointer-events-none absolute inset-x-[10%] top-[6%] rounded-full"
        style={{
          height: Math.round(size * 0.42),
          background:
            "linear-gradient(180deg, rgba(255,255,255,.70), rgba(255,255,255,0))",
          opacity: 0.9,
        }}
      />
      {/* soft inner bevel */}
      <span
        className="pointer-events-none absolute inset-[3px] rounded-full"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -10px 14px rgba(0,0,0,.22)",
        }}
      />
      {/* outer white ring */}
      <span
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: inset1,
          border: `${ringW}px solid ${ringColor}`,
        }}
      />
      {/* inner thin ring */}
      <span
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: inset2,
          border: `${Math.max(
            1,
            Math.round(ringW * 0.7)
          )}px solid ${ringColor}`,
          opacity: 0.9,
        }}
      />

      {/* centered content */}
      <span
        className="relative"
        style={{ transform: `translateY(${offsetY}px)`, color: iconColor }}
      >
        {content}
      </span>
    </button>
  );
};

export default GlassFruitBadge;
