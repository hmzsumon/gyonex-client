// GlassPlateBadge.tsx
import React, { useId } from "react";

type Colors = {
  /** প্লেটের গ্লাস টিন্ট (উপর→নিচ) */
  start?: string;
  mid?: string;
  end?: string;
  /** রিম/রিং এর সাদা রঙ */
  ring?: string;
};

type GlassPlateBadgeProps = {
  size?: number; // ব্যাজের ডায়ামিটার
  colors?: Colors; // গ্লাস টিন্ট
  concaveDepth?: number; // 0~1, ডেবে থাকার তীব্রতা
  shadowOpacity?: number; // বাহিরে ড্রপ শ্যাডো

  // কন্টেন্ট – যেকোনো একটি
  emoji?: string;
  icon?: React.ReactNode; // react-icons / lucide JSX
  src?: string; // image url

  iconSize?: number; // কনটেন্ট সাইজ
  iconColor?: string; // আইকনের রঙ (emoji/img হলে প্রয়োজন নেই)
  offsetY?: number; // কনটেন্টকে একটু নিচে/উপরে সরাতে

  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

const GlassPlateBadge: React.FC<GlassPlateBadgeProps> = ({
  size = 72,
  colors = {
    start: "#c9f1f5",
    mid: "#8dd6e8",
    end: "#63bdd7",
    ring: "rgba(255,255,255,.9)",
  },
  concaveDepth = 0.55,
  shadowOpacity = 0.35,

  emoji,
  icon,
  src,

  iconSize,
  iconColor = "#fff",
  offsetY = 0,

  onClick,
  className = "",
  ariaLabel = "Fruit plate icon",
}) => {
  const id = useId().replace(/[:]/g, "");
  const cSize = iconSize ?? Math.round(size * 0.56);

  // রেডিয়াস স্কেলিং
  const R = 50; // viewBox ref
  const rimOuter = 44;
  const rimInner = 36;
  const cavityR = 33; // concave inner face

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`inline-grid place-items-center rounded-full ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          {/* গ্লাস টিন্ট গ্রেডিয়েন্ট */}
          <linearGradient id={`g-plate-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.start ?? "#c9f1f5"} />
            <stop
              offset="55%"
              stopColor={colors.mid ?? colors.start ?? "#8dd6e8"}
            />
            <stop
              offset="100%"
              stopColor={colors.end ?? colors.mid ?? "#63bdd7"}
            />
          </linearGradient>

          {/* রিমের হাইলাইট/শ্যাডো (বেভেল লুক) */}
          <linearGradient id={`g-rim-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,.85)" />
            <stop offset="100%" stopColor="rgba(0,0,0,.18)" />
          </linearGradient>

          {/* concave মুখ: চারপাশ উজ্জ্বল, মাঝখান একটু ডার্ক */}
          <radialGradient id={`g-concave-${id}`} cx="50%" cy="45%" r="60%">
            <stop
              offset={`${(1 - concaveDepth) * 60}%`}
              stopColor="rgba(0,0,0,.10)"
            />
            <stop offset="100%" stopColor="rgba(255,255,255,.06)" />
          </radialGradient>

          {/* inner shadow filter – গর্তের edge এ শ্যাডো */}
          <filter
            id={`f-inner-${id}`}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dy="1" />
            <feComposite
              in2="SourceAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="inner"
            />
            <feColorMatrix
              in="inner"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 .40 0"
            />
            <feComposite in="SourceGraphic" operator="over" />
          </filter>

          {/* ছোট স্পেকুলার হাইলাইট আর্ক */}
          <linearGradient id={`g-spec-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* ground shadow */}
        <ellipse
          cx={R}
          cy={R + 42}
          rx={R * 0.36}
          ry={R * 0.12}
          fill="#000"
          opacity={shadowOpacity}
        />

        {/* plate base */}
        <circle cx={R} cy={R} r={rimOuter} fill={`url(#g-plate-${id})`} />

        {/* outer rim bevel */}
        <circle
          cx={R}
          cy={R}
          r={rimOuter}
          fill="none"
          stroke={`url(#g-rim-${id})`}
          strokeWidth="2"
          opacity=".85"
        />

        {/* translucent outer ring (glass edge) */}
        <circle
          cx={R}
          cy={R}
          r={rimInner + 3}
          fill="none"
          stroke={colors.ring ?? "rgba(255,255,255,.9)"}
          strokeWidth="1.5"
          opacity=".8"
        />

        {/* concave inner face */}
        <circle
          cx={R}
          cy={R}
          r={cavityR}
          fill={`url(#g-concave-${id})`}
          filter={`url(#f-inner-${id})`}
        />

        {/* inner thin ring */}
        <circle
          cx={R}
          cy={R}
          r={cavityR}
          fill="none"
          stroke={colors.ring ?? "rgba(255,255,255,.9)"}
          strokeWidth="1"
          opacity=".9"
        />

        {/* specular highlight arc (টপ-লেফট) */}
        <path
          d={`M ${R - 22},${R - 28} A ${28} ${24} 0 0 1 ${R + 10},${R - 30}`}
          stroke={`url(#g-spec-${id})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity=".85"
        />
      </svg>

      {/* content layer */}
      <span
        className="pointer-events-none absolute"
        style={{
          width: cSize,
          height: cSize,
          transform: `translateY(${offsetY}px)`,
          display: "grid",
          placeItems: "center",
        }}
      >
        {src ? (
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
          <span style={{ fontSize: cSize }}>🍓</span>
        )}
      </span>
    </button>
  );
};

export default GlassPlateBadge;
