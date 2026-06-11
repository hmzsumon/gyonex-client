"use client";

import React from "react";

/**
 * Drop-in radial glow background for dark sections.
 * Parent should have `position: relative`.
 *
 * Props:
 * - className: extra utility classes (e.g. change z-index)
 * - variant: "base" (2 glows), "plus" (4 glows), "max" (4 glows + vignette)
 */
type Props = {
  className?: string;
  variant?: "base" | "plus" | "max";
};

const GlowBackdrop: React.FC<Props> = ({
  className = "",
  variant = "plus",
}) => {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    >
      {/* --- Base glows --- */}
      {/* Emerald — top/right */}
      <div
        className="
          absolute inset-0 mix-blend-screen
          [background:radial-gradient(900px_540px_at_82%_18%,rgba(16,185,129,0.12),transparent_60%)]
        "
      />
      {/* Cyan — bottom/right */}
      <div
        className="
          absolute inset-0 mix-blend-screen
          [background:radial-gradient(820px_520px_at_90%_78%,rgba(34,211,238,0.10),transparent_60%)]
        "
      />

      {/* --- Extra glows near center (plus/max) --- */}
      {variant !== "base" && (
        <>
          {/* Small emerald — mid/center-right */}
          <div
            className="
              absolute inset-0 mix-blend-screen
              [background:radial-gradient(420px_320px_at_58%_48%,rgba(16,185,129,0.10),transparent_62%)]
            "
          />
          {/* Small cyan — mid/center-left */}
          <div
            className="
              absolute inset-0 mix-blend-screen
              [background:radial-gradient(380px_300px_at_42%_58%,rgba(34,211,238,0.10),transparent_62%)]
            "
          />
        </>
      )}

      {/* --- Soft vignette (max) --- */}
      {variant === "max" && (
        <div
          className="
            absolute inset-0
            [background:radial-gradient(1400px_720px_at_-8%_50%,rgba(0,0,0,0.55),transparent_70%)]
          "
        />
      )}
    </div>
  );
};

export default GlowBackdrop;
