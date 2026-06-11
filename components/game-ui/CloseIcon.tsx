import React from "react";

type CoinIconProps = {
  /** Whole widget size in px */
  size?: number;
  /** Optional purple chip background behind the coin (like your screenshot) */
  withChipBg?: boolean;
  /** Center icon component, e.g. from react-icons or lucide-react */
  Icon?: React.ComponentType<any>;
  /** Or pass a ready ReactNode instead of Icon */
  icon?: React.ReactNode;
  /** Icon color (works for most icon libs) */
  iconColor?: string;
  /** Icon stroke width (useful for lucide line icons) */
  iconStrokeWidth?: number;
  /** Scale factor of icon relative to widget size (0-1) */
  iconScale?: number; // default 0.62
  /** Nudge the icon vertically (px, positive = down) */
  iconOffsetY?: number;
  /** Click handler & misc */
  onClick?: () => void;
  className?: string;
  title?: string; // a11y
};

const CoinIcon: React.FC<CoinIconProps> = ({
  size = 36,
  withChipBg = false,
  Icon,
  icon,
  iconColor = "#000",
  iconStrokeWidth,
  iconScale = 0.62,
  iconOffsetY = 0,
  onClick,
  className = "",
  title = "Icon",
}) => {
  // Coin circle proportions from the SVG (viewBox 64)
  const clipR = 28; // % of container
  const clipCx = 50; // %
  const clipCy = 47; // % (slightly above middle to match the coin center)
  const innerSize = Math.round(size * iconScale);

  const content =
    icon ??
    (Icon ? (
      <Icon
        size={innerSize}
        color={iconColor}
        strokeWidth={iconStrokeWidth}
        // Some icon packs (react-icons) also accept "style" for color fallback
        style={{ color: iconColor }}
      />
    ) : (
      // Fallback bold X if no icon given
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
    <div
      role="img"
      aria-label={title}
      onClick={onClick}
      className={`relative inline-block ${className}`}
      style={{
        width: size,
        height: size,
        cursor: onClick ? "pointer" : "default",
      }}
      title={title}
    >
      {/* Optional purple chip square (behind the coin) */}
      {withChipBg && (
        <div
          className="absolute inset-0 rounded-[10px]"
          style={{
            background:
              "linear-gradient(180deg,#B06CFF 0%,#8E39F5 55%,#651AD8 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,.35)",
          }}
        />
      )}

      {/* The coin itself (SVG) */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Coin gradients & filters */}
          <radialGradient id="coin-fill" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#FFF17B" />
            <stop offset="45%" stopColor="#FFD63A" />
            <stop offset="85%" stopColor="#FFB81A" />
            <stop offset="100%" stopColor="#F39D0A" />
          </radialGradient>
          <linearGradient id="coin-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC54A" />
            <stop offset="100%" stopColor="#D47C12" />
          </linearGradient>
          <linearGradient id="coin-gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="coin-inner" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b" />
            <feComposite
              in="b"
              in2="SourceAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="inn"
            />
            <feColorMatrix
              in="inn"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 .35 0"
            />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>

        {/* Soft shadow under coin */}
        <ellipse cx="32" cy="35" rx="18" ry="5.5" fill="#000" opacity=".18" />

        {/* Coin body */}
        <g filter="url(#coin-inner)">
          <circle cx="32" cy="30" r="18" fill="url(#coin-fill)" />
          <circle
            cx="32"
            cy="30"
            r="18"
            fill="none"
            stroke="url(#coin-rim)"
            strokeWidth="3"
          />
          {/* Top glossy band */}
          <rect
            x="18"
            y="16"
            width="28"
            height="10"
            rx="5"
            fill="url(#coin-gloss)"
            opacity=".9"
          />
        </g>
      </svg>

      {/* Cropped icon overlay (HTML layer, clipped to coin circle) */}
      <span
        className="absolute inset-0 grid place-items-center"
        style={{
          // clip to the coin circle (percentage based so it scales)
          clipPath: `circle(${clipR}% at ${clipCx}% ${clipCy}%)`,
          WebkitClipPath: `circle(${clipR}% at ${clipCx}% ${clipCy}%)`,
          transform: `translateY(${iconOffsetY}px)`,
          // keep clicks on the whole widget
          pointerEvents: "none",
          color: iconColor,
        }}
      >
        {/* pointerEvents none here; the outer wrapper handles onClick */}
        {content}
      </span>
    </div>
  );
};

export default CoinIcon;
