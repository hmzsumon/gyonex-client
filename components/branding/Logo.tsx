import Image, { StaticImageData } from "next/image";
import React from "react";

type SizePreset = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<SizePreset, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

type LogoProps = {
  /** Image source (Static import or remote url) */
  src?: StaticImageData | string;

  /** Text brand name (optional) */
  text?: string;

  /** Icon component (e.g. from lucide-react). Must accept className */
  Icon?: React.ComponentType<{ className?: string }>;

  /** Size preset or exact px */
  size?: SizePreset | number;

  /** Show image/icon */
  showMark?: boolean;

  /** Show text */
  showText?: boolean;

  /** Next/Image alt text */
  alt?: string;

  /** Image width/height ratio control (defaults to size x size) */
  width?: number;
  height?: number;

  /** Layout */
  direction?: "row" | "col";
  gap?: number;

  /** Styling */
  className?: string;
  textClassName?: string;
  markClassName?: string;

  /** Clickable */
  href?: string;

  /** For next/image remote images */
  unoptimized?: boolean;

  /** If you want round logo */
  rounded?: boolean;
};

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const Logo: React.FC<LogoProps> = ({
  src,
  text = "",
  Icon,
  size = "md",
  showMark = true,
  showText = true,
  alt = "Logo",
  width,
  height,
  direction = "row",
  gap = 10,
  className,
  textClassName,
  markClassName,
  href,
  unoptimized,
  rounded = false,
}) => {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const w = width ?? px;
  const h = height ?? px;

  const Mark = () => {
    if (!showMark) return null;

    // Priority: src > Icon > fallback letter mark
    if (src) {
      return (
        <Image
          src={src}
          alt={alt}
          width={w}
          height={h}
          unoptimized={unoptimized}
          className={cx(
            "shrink-0 object-contain",
            rounded && "rounded-full",
            markClassName,
          )}
        />
      );
    }

    if (Icon) {
      return (
        <span
          className={cx(
            "inline-flex shrink-0 items-center justify-center",
            rounded && "rounded-full",
            markClassName,
          )}
          style={{ width: px, height: px }}
          aria-hidden="true"
        >
          <Icon className="h-full w-full" />
        </span>
      );
    }

    // fallback: just "O" mark
    return (
      <span
        className={cx(
          "inline-flex shrink-0 items-center justify-center font-bold",
          rounded && "rounded-full",
          markClassName,
        )}
        style={{ width: px, height: px, fontSize: Math.max(12, px * 0.55) }}
        aria-label={alt}
      >
        O
      </span>
    );
  };

  const Text = () => {
    if (!showText || !text) return null;
    return (
      <span
        className={cx("font-semibold leading-none", textClassName)}
        style={{ fontSize: Math.max(12, px * 0.45) }}
      >
        {text}
      </span>
    );
  };

  const content = (
    <div
      className={cx(
        "inline-flex items-center",
        direction === "col" ? "flex-col" : "flex-row",
        className,
      )}
      style={{ gap }}
    >
      <Mark />
      <Text />
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
};

export default Logo;
