// GlassBar.tsx
import React, { useId } from "react";

type ResponsiveHeight =
  | number
  | {
      base: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      ["2xl"]?: number;
    };

type Gradient = {
  start: string;
  mid1?: string; // 30%
  mid2?: string; // 60%
  mid3?: string; // 80%
  end: string;
};

type BottomBeam =
  | false
  | {
      color?: string;
      height?: number; // px
      offset?: number; // px from bottom
      opacity?: number;
      blur?: number; // px
    };

export type GlassBarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** responsive height: number বা { base, md, ... } */
  height?: ResponsiveHeight;
  width?: number | string;
  radius?: number;

  /** glossy lime/green style এর বদলে কাস্টম গ্রেডিয়েন্ট */
  gradient?: Gradient;
  /** ring/border-ish outline color */
  ringColor?: string;

  /** overlays */
  gloss?: boolean;
  innerRim?: boolean;
  bottomBeam?: BottomBeam;
  grain?: boolean;

  /** content paddings & class */
  paddingX?: number;
  contentClassName?: string;
  children?: React.ReactNode;
};

const bp = { sm: 640, md: 768, lg: 1024, xl: 1280, ["2xl"]: 1536 };

const GlassBar: React.FC<GlassBarProps> = ({
  height = 110,
  width = "100%",
  radius = 20,
  gradient = {
    start: "#c7ff63",
    mid1: "#aef842",
    mid2: "#87e737",
    mid3: "#6fd42f",
    end: "#56bf28",
  },
  ringColor = "rgba(255,255,255,.20)",
  gloss = true,
  innerRim = true,
  bottomBeam = {
    color: "#e6ff9a",
    height: 3,
    offset: 10,
    opacity: 0.8,
    blur: 0.5,
  },
  grain = true,
  paddingX = 8,
  contentClassName = "flex items-center justify-center w-full",
  className = "",
  children,
  ...rest
}) => {
  const uid = useId().replace(/[:]/g, "");
  const cls = `gb-${uid}`;

  // responsive height values
  const baseH = typeof height === "number" ? height : height.base;
  const hSm = typeof height === "object" ? height.sm : undefined;
  const hMd = typeof height === "object" ? height.md : undefined;
  const hLg = typeof height === "object" ? height.lg : undefined;
  const hXl = typeof height === "object" ? height.xl : undefined;
  const h2Xl = typeof height === "object" ? height["2xl"] : undefined;

  // gradient css
  const bg = `linear-gradient(180deg, ${gradient.start} 0%, ${
    gradient.mid1 ?? gradient.start
  } 30%, ${gradient.mid2 ?? gradient.mid1 ?? gradient.start} 60%, ${
    gradient.mid3 ?? gradient.mid2 ?? gradient.start
  } 80%, ${gradient.end} 100%)`;

  return (
    <div
      {...rest}
      className={`relative overflow-hidden ${cls} ${className}`}
      style={{
        width,
        // height via CSS var
        height: "var(--gb-h)",
        borderRadius: radius,
        background: bg,
        // outer shadows (আগের মতো)
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.65), inset 0 -18px 28px rgba(0,0,0,.18), inset 0 0 0 1px rgba(255,255,255,.12), 0 12px 24px rgba(0,0,0,.28)",
        // “ring” effect
        outline: `1px solid ${ringColor}`,
        outlineOffset: -1,
      }}
    >
      {/* responsive height CSS */}
      <style>{`
        .${cls}{ --gb-h:${baseH}px; }
        ${
          hSm
            ? `@media (min-width:${bp.sm}px){  .${cls}{ --gb-h:${hSm}px; } }`
            : ""
        }
        ${
          hMd
            ? `@media (min-width:${bp.md}px){  .${cls}{ --gb-h:${hMd}px; } }`
            : ""
        }
        ${
          hLg
            ? `@media (min-width:${bp.lg}px){  .${cls}{ --gb-h:${hLg}px; } }`
            : ""
        }
        ${
          hXl
            ? `@media (min-width:${bp.xl}px){  .${cls}{ --gb-h:${hXl}px; } }`
            : ""
        }
        ${
          h2Xl
            ? `@media (min-width:${bp["2xl"]}px){ .${cls}{ --gb-h:${h2Xl}px; } }`
            : ""
        }
      `}</style>

      {/* Top glossy sheen + left-corner bloom */}
      {gloss && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: "inherit",
            background:
              "radial-gradient(120% 90% at 3% 6%, rgba(255,255,255,.55), rgba(255,255,255,.20) 36%, transparent 62%), linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,0))",
          }}
        />
      )}

      {/* Soft inner rim highlight */}
      {innerRim && (
        <span
          className="pointer-events-none absolute"
          style={{
            inset: 3,
            borderRadius: Math.max(0, radius - 3),
            boxShadow:
              "inset 0 0 0 2px rgba(255,255,255,.20), inset 0 0 80px rgba(255,255,255,.06)",
          }}
        />
      )}

      {/* Bright line near bottom */}
      {bottomBeam && (
        <span
          className="pointer-events-none absolute inset-x-2"
          style={{
            bottom: bottomBeam.offset ?? 10,
            height: bottomBeam.height ?? 3,
            borderRadius: 9999,
            background: `linear-gradient(90deg, transparent, ${
              bottomBeam.color ?? "#e6ff9a"
            }, transparent)`,
            opacity: bottomBeam.opacity ?? 0.8,
            filter: `blur(${bottomBeam.blur ?? 0.5}px)`,
          }}
        />
      )}

      {/* Light bloom/grain */}
      {grain && (
        <span
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            borderRadius: "inherit",
            opacity: 0.06,
            background:
              "radial-gradient(900px 500px at 50% 120%, #ffffff, transparent 60%)",
          }}
        />
      )}

      {/* Content */}
      <div
        className={`absolute inset-0 ${contentClassName}`}
        style={{ paddingInline: paddingX }}
      >
        {children}
      </div>
    </div>
  );
};

export default GlassBar;
