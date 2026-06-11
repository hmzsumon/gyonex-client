"use client";

import React, { useId } from "react";
import styles from "./ElectricCards.module.css";

type Variant = "cyan" | "orange";

type ElectricCardProps = {
  variant: Variant;
  badge?: string;
  title?: string;
  desc?: string;
};

function ElectricBorderSVG({ variant }: { variant: Variant }) {
  const uid = useId().replace(/:/g, "");
  const glowFilter = `glow_${uid}`;
  const jaggedFilter = `jagged_${uid}`;

  // Colors close to screenshot
  const main = variant === "cyan" ? "0,255,225" : "255,165,45";

  return (
    <svg
      className={styles.borderSvg}
      viewBox="0 0 100 140"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Jagged / crack edge */}
        <filter id={jaggedFilter} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="2"
            result="noise"
          >
            <animate
              attributeName="seed"
              dur="0.28s"
              values="1;2;3;4;2;5"
              repeatCount="indefinite"
            />
          </feTurbulence>

          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Glow */}
        <filter id={glowFilter} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 1 0"
            result="colored"
          />
          <feMerge>
            <feMergeNode in="colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Big soft glow stroke */}
      <path
        d="M10,10
           H90
           Q96,10 96,16
           V124
           Q96,130 90,130
           H10
           Q4,130 4,124
           V16
           Q4,10 10,10 Z"
        fill="none"
        stroke={`rgba(${main},0.28)`}
        strokeWidth="3.8"
        filter={`url(#${glowFilter})`}
      />

      {/* Electric jagged stroke */}
      <path
        d="M10,10
           H90
           Q96,10 96,16
           V124
           Q96,130 90,130
           H10
           Q4,130 4,124
           V16
           Q4,10 10,10 Z"
        fill="none"
        stroke={`rgba(${main},0.95)`}
        strokeWidth="1.65"
        filter={`url(#${jaggedFilter})`}
        className={styles.zapStroke}
      />
    </svg>
  );
}

function ElectricCard({
  variant,
  badge = "CODEWITH_MUHIBLAN",
  title = "Electric\nBorder",
  desc = "In case you'd like to emphasise\nsomething very dramatically.",
}: ElectricCardProps) {
  return (
    <div
      className={`${styles.card} ${variant === "cyan" ? styles.cyan : styles.orange}`}
    >
      {/* Electric border */}
      <ElectricBorderSVG variant={variant} />

      {/* Inner frame like screenshot */}
      <div className={styles.innerFrame} />

      {/* Content */}
      <div className={styles.inner}>
        <div className={styles.badgeWrap}>
          <div className={styles.badge}>{badge}</div>
        </div>

        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            {title.split("\n").map((t, i) => (
              <React.Fragment key={i}>
                {t}
                {i < title.split("\n").length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h2>

          <div className={styles.divider} />

          <p className={styles.desc}>
            {desc.split("\n").map((t, i) => (
              <React.Fragment key={i}>
                {t}
                {i < desc.split("\n").length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ElectricCards() {
  return (
    <main className={styles.stage}>
      <ElectricCard variant="cyan" />
      <ElectricCard variant="orange" />
    </main>
  );
}
