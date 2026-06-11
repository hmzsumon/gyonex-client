// components/game-ui/PotCard.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */
import React, { useEffect, useMemo, useState } from "react";

/* ── Types ───────────────────────────────────────────────────────────────── */
type Gradient5 = [string, string, string, string, string];
type Gradient3 = [string, string, string];

export type PotCardPalette = {
  /** main green body gradient (৫টা স্টপ) */
  main?: Gradient5;
  /** purple chip gradient (৩টা স্টপ) */
  chip?: Gradient3;
  /** top tag gradient (৩টা স্টপ) */
  topTag?: Gradient3;
  /** inner panel gradient (৩টা স্টপ) */
  inner?: Gradient3;
};

export type PotCardProps = {
  title?: string; // 2) top title
  multiplier?: string | number;
  pot?: number; // 4) Pot value
  my?: number; // 5) My value
  className?: string;

  /** টপ পিলটা বডির উপরে কতটা উঠানো হবে (px) */
  topLift?: number;

  /** 1) color palette override */
  palette?: PotCardPalette;

  /** 3) faint watermark: ReactNode দিলে custom, না দিলে kind="watermelon" ডিফল্ট */
  watermark?:
    | React.ReactNode
    | { kind?: "watermelon" | "none"; opacity?: number };

  /** winner হলে pulse/burst অ্যানিম চালু হবে */
  isWinner?: boolean;
  winKey?: string | number;
  emitCount?: number;

  /** bet ক্লিক হ্যান্ডলার (Client থেকে পাঠাতে হবে) */
  onClick?: () => void;
  disabled?: boolean;
};

/* ── Defaults / Palette ──────────────────────────────────────────────────── */
const dfPalette: Required<PotCardPalette> = {
  main: ["#B9FF73", "#A9FB55", "#87EB3E", "#6CD733", "#59C62A"],
  chip: ["#A25BFF", "#842FF4", "#6A17DA"],
  topTag: ["#D4FFA3", "#B8FB6E", "#8BE241"],
  inner: ["#FFFFFF", "#FBFBFC", "#EEF6EF"],
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n: number | undefined) => Number(n || 0).toFixed(2);

const WatermarkWatermelon = ({ opacity = 0.17 }: { opacity?: number }) => (
  <g opacity={opacity} transform="translate(74,145)">
    <circle cx="60" cy="60" r="46" fill="#8cd66d" />
    <g stroke="#fff" strokeOpacity=".45" strokeWidth="6" fill="none">
      <path d="M60 16v88M16 60h88M28 30c12 10 38 10 52 0M28 90c12-10 38-10 52 0" />
    </g>
    <path
      d="M30 76a32 18 0 1 0 60 0 32 18 0 1 0-60 0Z"
      fill="#ffd2cf"
      stroke="#ff9aa0"
      strokeWidth="4"
    />
  </g>
);

/* ── Component ─ PotCard ─────────────────────────────────────────────────── */
const PotCard: React.FC<PotCardProps> = ({
  title = "Watermelon",
  multiplier = "X 2.9",
  pot = 0,
  my = 0,
  className = "",
  topLift = 10, // ← টপকে বাইরে তোলার পরিমাণ
  palette,
  watermark = { kind: "watermelon", opacity: 0.17 },
  isWinner = false,
  winKey,
  emitCount = 12,
  onClick,
  disabled,
}) => {
  /* ── Derived palette ──────────────────────────────────────────────────── */
  const pal = { ...dfPalette, ...(palette || {}) };

  /* ── Local State / Animations ─────────────────────────────────────────── */
  const idp = useMemo(() => `wm-${Math.random().toString(36).slice(2, 8)}`, []);
  const [pulseId, setPulseId] = useState(0);
  const [burstIds, setBurstIds] = useState<number[]>([]);

  const PULSE_MS = 900;
  const TITLE_MS = 920;
  const EMOJI_MS = 1200;

  useEffect(() => {
    if (!isWinner) return;
    setPulseId((p) => p + 1);

    const batch = Date.now();
    setBurstIds(Array.from({ length: emitCount }, (_, i) => batch + i));

    const t = setTimeout(() => setBurstIds([]), EMOJI_MS + 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWinner, winKey, emitCount]);

  const panelAnim = `wmPanelPulse-${idp}-${pulseId}`;
  const titleAnim = `wmTitleBounce-${idp}-${pulseId}`;

  /* ── Random helpers for 🍉 burst ─────────────────────────────────────── */
  const rand = (a: number, b: number) => Math.random() * (b - a) + a;

  // ✅ Title থেকে ইমোজি ম্যাপ (ব্লাস্টটা Winner পটের ফলটাই হবে)
  const lower = String(title || "").toLowerCase();
  const fruitEmoji = lower.includes("apple")
    ? "🍎"
    : lower.includes("mango")
    ? "🥭"
    : "🍉";

  const startTopPct = 59.8;
  const startLeftPct = 50.0;

  /* ── SVG viewBox (top lift-aware) ─────────────────────────────────────── */
  const viewBox = `0 ${-26 - topLift} 272 ${372 + topLift}`;

  return (
    <div className={className}>
      <div className="relative w-full h-[346px]">
        {/* ── Click Overlay ──────────────────────────────────────────────── */}
        <div
          role="button"
          aria-label={`Bet on ${title}`}
          onClick={disabled ? undefined : onClick}
          className="absolute inset-0 z-20 rounded-[26px]"
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        />

        {/* ── SVG Root ───────────────────────────────────────────────────── */}
        <svg
          viewBox={viewBox}
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        >
          {/* ── Defs (gradients + filters) ──────────────────────────────── */}
          <defs>
            {/* main body */}
            <linearGradient id={`${idp}-gMain`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={pal.main[0]} />
              <stop offset="22%" stopColor={pal.main[1]} />
              <stop offset="58%" stopColor={pal.main[2]} />
              <stop offset="86%" stopColor={pal.main[3]} />
              <stop offset="100%" stopColor={pal.main[4]} />
            </linearGradient>

            {/* inner rim */}
            <linearGradient id={`${idp}-rim`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".28" />
              <stop offset="100%" stopColor="#fff" stopOpacity=".14" />
            </linearGradient>

            {/* top gloss */}
            <linearGradient id={`${idp}-glossTop`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".42" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* chip */}
            <linearGradient id={`${idp}-chip`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={pal.chip[0]} />
              <stop offset="55%" stopColor={pal.chip[1]} />
              <stop offset="100%" stopColor={pal.chip[2]} />
            </linearGradient>
            <linearGradient id={`${idp}-chipGloss`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".75" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* inner panel */}
            <linearGradient id={`${idp}-inner`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={pal.inner[0]} />
              <stop offset="40%" stopColor={pal.inner[1]} />
              <stop offset="100%" stopColor={pal.inner[2]} />
            </linearGradient>

            {/* top pill */}
            <linearGradient id={`${idp}-topTag`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={pal.topTag[0]} />
              <stop offset="45%" stopColor={pal.topTag[1]} />
              <stop offset="100%" stopColor={pal.topTag[2]} />
            </linearGradient>
            <linearGradient
              id={`${idp}-topTagGloss`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#fff" stopOpacity=".6" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* filters */}
            <filter
              id={`${idp}-softShadow`}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feDropShadow
                dx="0"
                dy="12"
                stdDeviation="10"
                floodColor="#000"
                floodOpacity=".35"
              />
            </filter>
            <filter
              id={`${idp}-innerShadow`}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite
                operator="arithmetic"
                k2="-1"
                k3="1"
                in2="SourceAlpha"
              />
              <feColorMatrix
                type="matrix"
                values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0`}
              />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>
            <filter
              id={`${idp}-edgeGlow`}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
          </defs>

          {/* ── Base Card ───────────────────────────────────────────────── */}
          <rect
            x="2"
            y="2"
            width="268"
            height="342"
            rx="26"
            fill={`url(#${idp}-gMain)`}
            filter={`url(#${idp}-softShadow)`}
          />
          <rect
            x="5"
            y="4"
            width="262"
            height="96"
            rx="22"
            fill={`url(#${idp}-glossTop)`}
          />
          <rect
            x="4"
            y="4"
            width="264"
            height="338"
            rx="24"
            fill="none"
            stroke={`url(#${idp}-rim)`}
            strokeWidth="2"
            opacity=".9"
          />

          {/* ── TOP (lifted outside) ─────────────────────────────────────── */}
          <g
            filter={`url(#${idp}-softShadow)`}
            transform={`translate(0, ${-topLift})`}
          >
            <ellipse
              cx="136"
              cy="18"
              rx="74"
              ry="13"
              fill="#000"
              opacity=".12"
            />
            <circle
              cx="66"
              cy="15"
              r="12"
              fill={`url(#${idp}-topTag)`}
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <circle
              cx="206"
              cy="15"
              r="12"
              fill={`url(#${idp}-topTag)`}
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <rect
              x="66"
              y="-5"
              width="140"
              height="40"
              rx="20"
              fill={`url(#${idp}-topTag)`}
              stroke="#fff"
              strokeOpacity=".45"
              strokeWidth="1"
            />
            <rect
              x="70"
              y="-3"
              width="132"
              height="16"
              rx="10"
              fill={`url(#${idp}-topTagGloss)`}
              opacity=".9"
            />
            <text
              x="136"
              y="22"
              textAnchor="middle"
              fontSize="18"
              fontFamily="Poppins, system-ui, sans-serif"
              fontStyle="italic"
              fontWeight="600"
              fill="#2a5d0e"
              style={{
                animation:
                  pulseId > 0
                    ? `${titleAnim} ${TITLE_MS}ms ease-out 1`
                    : undefined,
              }}
            >
              {title}
            </text>
          </g>

          {/* ── Multiplier Chip ──────────────────────────────────────────── */}
          <g filter={`url(#${idp}-softShadow)`} transform="translate(0,-15)">
            <rect
              x="92"
              y="64"
              width="88"
              height="38"
              rx="19"
              fill="#000"
              opacity=".18"
            />
            <rect
              x="96"
              y="68"
              width="80"
              height="30"
              rx="15"
              fill={`url(#${idp}-chip)`}
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <rect
              x="99"
              y="70"
              width="74"
              height="12"
              rx="8"
              fill={`url(#${idp}-chipGloss)`}
            />
            <text
              x="136"
              y="89"
              textAnchor="middle"
              fontSize="16"
              fontFamily="Baloo 2, system-ui, sans-serif"
              fontWeight="800"
              fill="#fff"
              letterSpacing=".08em"
            >
              {typeof multiplier === "number"
                ? `X ${multiplier}`
                : String(multiplier)}
            </text>
          </g>

          {/* ── Inner Content Panel (pulse) ─────────────────────────────── */}
          <g
            key={pulseId}
            id={`${idp}-inner-panel`}
            filter={`url(#${idp}-softShadow)`}
            style={{
              transformOrigin: "50% 50%",
              animation:
                pulseId > 0
                  ? `${panelAnim} ${PULSE_MS}ms ease-in-out 1`
                  : undefined,
            }}
          >
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill={`url(#${idp}-inner)`}
              filter={`url(#${idp}-innerShadow)`}
            />
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="none"
              stroke="#fff"
              strokeOpacity=".35"
              strokeWidth="2"
            />
          </g>

          {/* ── Faint Watermark ─────────────────────────────────────────── */}
          {React.isValidElement(watermark) ? (
            watermark
          ) : (watermark as any)?.kind === "none" ? null : (
            <WatermarkWatermelon
              opacity={(watermark as any)?.opacity ?? 0.17}
            />
          )}

          {/* ── Pot / Divider / My ──────────────────────────────────────── */}
          <text
            x="136"
            y="180"
            textAnchor="middle"
            fontSize="18"
            fontFamily="Poppins, system-ui, sans-serif"
            fontWeight="600"
            fill="#000"
            fillOpacity=".85"
          >
            {`Pot: ${fmt(pot)}`}
          </text>
          <g>
            <rect
              x="54"
              y={207 - 0.75}
              width="164"
              height="1.5"
              fill="#000"
              opacity=".45"
            />
            <rect
              x="54"
              y={207 - 1.2}
              width="164"
              height="0.8"
              fill="#fff"
              opacity=".22"
            />
          </g>
          <text
            x="136"
            y="240"
            textAnchor="middle"
            fontSize="20"
            fontFamily="Baloo 2, system-ui, sans-serif"
            fontWeight="800"
            fill="#7B1CF9"
          >
            {`My: ${fmt(my)}`}
          </text>

          {/* ── Bottom Decorations ──────────────────────────────────────── */}
          <rect
            x="18"
            y="322"
            width="236"
            height="2"
            fill="#fff"
            opacity=".18"
          />
          <ellipse
            cx="136"
            cy="346"
            rx="78"
            ry="12"
            fill="#000"
            opacity=".22"
          />
          <g>
            <circle cx="88" cy="340" r="18" fill={`url(#${idp}-gMain)`} />
            <circle cx="136" cy="342" r="20" fill={`url(#${idp}-gMain)`} />
            <circle cx="184" cy="340" r="18" fill={`url(#${idp}-gMain)`} />
            <g opacity=".85" filter={`url(#${idp}-edgeGlow)`}>
              <path
                d="M72 328a18 18 0 0 1 32 0"
                stroke="#fff"
                strokeOpacity=".55"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M118 328a20 20 0 0 1 36 0"
                stroke="#fff"
                strokeOpacity=".55"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M166 328a18 18 0 0 1 32 0"
                stroke="#fff"
                strokeOpacity=".55"
                strokeWidth="2"
                fill="none"
              />
            </g>
            <g opacity=".35">
              <circle cx="96" cy="330" r="2" fill="#fff" />
              <circle cx="136" cy="332" r="2.3" fill="#fff" />
              <circle cx="176" cy="330" r="2" fill="#fff" />
            </g>
          </g>
          <circle cx="12" cy="334" r="2" fill="#fff" opacity=".7" />
          <circle cx="260" cy="16" r="3" fill="#fff" opacity=".7" />
        </svg>

        {/* ── 🍉 Emoji Burst (winner) ───────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 overflow-visible z-10">
          {burstIds.map((id, i) => {
            const startJx = rand(-6, 6);
            const startJy = rand(-4, 4);
            const endLeft = 50 + rand(-12, 12);
            const endTop = 93 + rand(-3, 2);
            const delay = i * 30;
            const size = 18 + rand(-2, 10);
            return (
              <span
                key={id}
                className="absolute emoji-fly"
                style={
                  {
                    left: `${50 + startJx}%`,
                    top: `${59.8 + startJy}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: `${size}px`,
                    lineHeight: 1,
                    animationDelay: `${delay}ms`,
                    // @ts-ignore
                    "--end-left": `${endLeft}%`,
                    // @ts-ignore
                    "--end-top": `${endTop}%`,
                    // @ts-ignore
                    "--emoji-dur": `${EMOJI_MS}ms`,
                  } as React.CSSProperties
                }
              >
                {fruitEmoji}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Scoped Styles ───────────────────────────────────────────────── */}
      <style jsx>{`
        #${idp}-inner-panel {
          transform-box: fill-box;
          transform-origin: 50% 50%;
        }
        @keyframes ${panelAnim} {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes ${titleAnim} {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            text-shadow: none;
          }
          30% {
            transform: translateY(-1px) scale(1.18) rotate(-2deg);
            text-shadow: 0 0 14px rgba(255, 210, 140, 0.75);
          }
          60% {
            transform: translateY(0) scale(1.08) rotate(1.5deg);
          }
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
            text-shadow: none;
          }
        }
        @keyframes emojiFlyDown {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.6) rotate(0deg);
          }
          12% {
            opacity: 1;
          }
          100% {
            left: var(--end-left);
            top: var(--end-top);
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9) rotate(16deg);
          }
        }
        .emoji-fly {
          animation: emojiFlyDown var(--emoji-dur, 1200ms)
            cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          will-change: left, top, transform, opacity;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default PotCard;
