"use client";
import React, { useEffect, useMemo, useState } from "react";

type MangoPotProps = {
  pot?: number;
  mine?: number;
  title?: string;
  multiplier?: number | string;
  className?: string;

  /** set true when Mango wins */
  isWinner?: boolean;
  /** change this (e.g. spinId/Date.now()) to retrigger on same result */
  winKey?: number | string;
  /** how many 🥭 to emit */
  emitCount?: number;
};

const MangoPot: React.FC<MangoPotProps> = ({
  pot = 0,
  mine = 0,
  title = "Mango",
  multiplier = "X 2.9",
  className = "",
  isWinner = false,
  winKey,
  emitCount = 12,
}) => {
  const fmt = (n: number) => n.toFixed(2);
  const midY = 207; // inner panel middle (113 + 188/2)

  // === timing (easily tweak here) ===
  const PULSE_MS = 900; // was 600ms → now a bit longer
  const EMOJI_MS = 1300; // was 1000ms → now a bit longer
  const CLEAR_AFTER_MS = Math.max(PULSE_MS, EMOJI_MS) + 600; // buffer to clear bursts

  // ====== animation helpers (no design change) ======
  const idp = useMemo(() => `mg-${Math.random().toString(36).slice(2, 8)}`, []);
  const [pulseId, setPulseId] = useState(0); // remount + new keyframes each time
  const [burstIds, setBurstIds] = useState<number[]>([]);
  const emoji = "🥭";
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  // start point ~ inner panel center (as % of 272x346 viewBox)
  const startTopPct = 59.8;
  const startLeftPct = 50.0;

  const trigger = () => {
    // 1) ensure panel pulse resets
    setPulseId((p) => p + 1);
    // 2) emit emojis
    const batch = Date.now();
    const ids = Array.from({ length: emitCount }, (_, i) => batch + i);
    setBurstIds(ids);
    // clear after animation completes
    window.setTimeout(() => setBurstIds([]), CLEAR_AFTER_MS);
  };

  useEffect(() => {
    if (isWinner) trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWinner, winKey, emitCount]);

  // unique animation name per pulse to guarantee restart on all browsers
  const animName = `mp-panelPulse-${idp}-${pulseId}`;

  return (
    <div className={className}>
      <div className="relative w-full h-[346px]">
        <svg
          viewBox="0 0 272 346"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ===== defs ===== */}
          <defs>
            {/* main body */}
            <linearGradient id="mp-gMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE09A" />
              <stop offset="18%" stopColor="#FFD067" />
              <stop offset="48%" stopColor="#FFB33B" />
              <stop offset="78%" stopColor="#FFA224" />
              <stop offset="100%" stopColor="#FF8D15" />
            </linearGradient>

            {/* inner rim highlight */}
            <linearGradient id="mp-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".28" />
              <stop offset="100%" stopColor="white" stopOpacity=".14" />
            </linearGradient>

            {/* glossy top */}
            <linearGradient id="mp-glossTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".42" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* purple chip */}
            <linearGradient id="mp-chip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A25BFF" />
              <stop offset="55%" stopColor="#842FF4" />
              <stop offset="100%" stopColor="#6A17DA" />
            </linearGradient>

            {/* chip top gloss */}
            <linearGradient id="mp-chipGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".65" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* inner panel */}
            <linearGradient id="mp-inner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="42%" stopColor="#FBFBFC" />
              <stop offset="100%" stopColor="#F1F6F0" />
            </linearGradient>

            {/* top tag gradient (slightly lighter) */}
            <linearGradient id="mp-topTag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE7A8" />
              <stop offset="36%" stopColor="#FFD068" />
              <stop offset="100%" stopColor="#FFB23B" />
            </linearGradient>

            {/* top tag gloss */}
            <linearGradient id="mp-topTagGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity=".55" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* soft shadow */}
            <filter
              id="mp-softShadow"
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

            {/* inner shadow for white panel */}
            <filter
              id="mp-innerShadow"
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
                values={`0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 .34 0`}
              />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>

            {/* tiny glow */}
            <filter
              id="mp-edgeGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
          </defs>

          {/* ===== main orange rounded panel ===== */}
          <rect
            x="2"
            y="2"
            width="268"
            height="342"
            rx="26"
            fill="url(#mp-gMain)"
            filter="url(#mp-softShadow)"
          />
          {/* glossy top */}
          <rect
            x="5"
            y="4"
            width="262"
            height="96"
            rx="22"
            fill="url(#mp-glossTop)"
          />
          {/* inner rim */}
          <rect
            x="4"
            y="4"
            width="264"
            height="338"
            rx="24"
            fill="none"
            stroke="url(#mp-rim)"
            strokeWidth="2"
            opacity=".9"
          />

          {/* ======= TOP SECTION (exact-like) ======= */}
          <g filter="url(#mp-softShadow)">
            <circle
              cx="72"
              cy="17"
              r="10"
              fill="url(#mp-topTag)"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="17"
              r="10"
              fill="url(#mp-topTag)"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <rect
              x="72"
              y="-3"
              width="128"
              height="40"
              rx="18"
              fill="url(#mp-topTag)"
              stroke="white"
              strokeOpacity=".45"
              strokeWidth="1"
            />
            <rect
              x="75"
              y="-1"
              width="122"
              height="18"
              rx="12"
              fill="url(#mp-topTagGloss)"
              opacity=".9"
            />
            <text
              x="136"
              y="23"
              textAnchor="middle"
              fontSize="16"
              fontFamily="Poppins, system-ui, sans-serif"
              fontStyle="italic"
              fontWeight="600"
              fill="#714b02"
            >
              {title}
            </text>
          </g>

          {/* purple multiplier chip */}
          <g filter="url(#mp-softShadow)">
            <rect
              x="90"
              y="61"
              width="92"
              height="44"
              rx="22"
              fill="#000"
              opacity=".18"
            />
            <rect
              x="94"
              y="68"
              width="84"
              height="30"
              rx="14"
              fill="url(#mp-chip)"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="1"
            />
            <rect
              x="97"
              y="70"
              width="78"
              height="12"
              rx="8"
              fill="url(#mp-chipGloss)"
              opacity=".85"
            />
            <text
              x="136"
              y="88"
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

          {/* ===== inner white content panel ===== */}
          {/* Remounted each pulse via key; animation applied inline so it always restarts */}
          <g
            key={pulseId}
            id={`${idp}-inner-panel`}
            filter="url(#mp-softShadow)"
            style={{
              transformOrigin: "50% 50%",
              animation:
                pulseId > 0
                  ? `${animName} ${PULSE_MS}ms ease-in-out 1`
                  : undefined,
            }}
          >
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="url(#mp-inner)"
              filter="url(#mp-innerShadow)"
            />
            <rect
              x="31"
              y="113"
              width="210"
              height="188"
              rx="20"
              fill="none"
              stroke="white"
              strokeOpacity=".35"
              strokeWidth="2"
            />
          </g>

          {/* watermark: mango + slice + leaf (faint) */}
          <g opacity=".18" transform="translate(74,148)">
            <radialGradient id="mp-mg" cx="55%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFD4A8" />
              <stop offset="50%" stopColor="#FFB45C" />
              <stop offset="100%" stopColor="#FF8F2D" />
            </radialGradient>
            <ellipse cx="60" cy="58" rx="44" ry="36" fill="url(#mp-mg)" />
            <linearGradient id="mp-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9BE076" />
              <stop offset="100%" stopColor="#4EAF52" />
            </linearGradient>
            <path
              d="M70 22c18-8 36 2 38 8-18 8-36-2-38-8Z"
              fill="url(#mp-leaf)"
            />
            <linearGradient id="mp-slice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF1AD" />
              <stop offset="100%" stopColor="#FFD768" />
            </linearGradient>
            <ellipse
              cx="92"
              cy="82"
              rx="32"
              ry="24"
              fill="url(#mp-slice)"
              stroke="#FFC241"
              strokeWidth="4"
            />
            <g stroke="#FFE493" strokeWidth="4" opacity=".85">
              <path d="M72 82h40M72 92h40M72 72h40" />
              <path d="M82 64v36M92 60v44M102 64v36" />
            </g>
          </g>

          {/* ===== Pot/My text ===== */}
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

          {/* Divider (crisp, always visible) */}
          <g>
            <rect
              x="54"
              y={midY - 0.75}
              width="164"
              height="1.5"
              fill="#000"
              opacity=".45"
            />
            <rect
              x="54"
              y={midY - 1.2}
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
            {`My: ${fmt(mine)}`}
          </text>

          {/* ======= BOTTOM SECTION (exact-like) ======= */}
          <ellipse
            cx="136"
            cy="346"
            rx="76"
            ry="12"
            fill="#000"
            opacity=".22"
          />
          <g>
            <circle cx="88" cy="340" r="18" fill="url(#mp-gMain)" />
            <circle cx="136" cy="342" r="20" fill="url(#mp-gMain)" />
            <circle cx="184" cy="340" r="18" fill="url(#mp-gMain)" />
            <g opacity=".8" filter="url(#mp-edgeGlow)">
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
              <circle cx="176" cy="330" r="2" fill="#fff" />
              <circle cx="136" cy="332" r="2.3" fill="#fff" />
            </g>
          </g>

          <circle cx="12" cy="334" r="2" fill="#fff" opacity=".7" />
          <circle cx="260" cy="16" r="3" fill="#fff" opacity=".7" />
        </svg>

        {/* ===== Emoji overlay (flies from panel center to pot) ===== */}
        <div className="pointer-events-none absolute inset-0 overflow-visible">
          {burstIds.map((id, i) => {
            const startJitterX = rand(-6, 6);
            const startJitterY = rand(-4, 4);
            const endLeft = 50 + rand(-12, 12); // land near bottom center
            const endTop = 93 + rand(-3, 2);
            const delay = i * 30;
            const size = 18 + rand(-2, 10);

            return (
              <span
                key={id}
                className="absolute emoji-fly"
                style={
                  {
                    left: `${startLeftPct + startJitterX}%`,
                    top: `${startTopPct + startJitterY}%`,
                    // @ts-ignore
                    "--end-left": `${endLeft}%`,
                    // @ts-ignore
                    "--end-top": `${endTop}%`,
                    // @ts-ignore
                    "--emoji-dur": `${EMOJI_MS}ms`,
                    animationDelay: `${delay}ms`,
                    fontSize: `${size}px`,
                    lineHeight: 1,
                    transform: "translate(-50%, -50%)",
                  } as React.CSSProperties
                }
              >
                {emoji}
              </span>
            );
          })}
        </div>
      </div>

      {/* panel pulse keyframes (dynamic per pulseId) + emoji flight */}
      <style jsx>{`
        @keyframes ${animName} {
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
            transform: translate(-50%, -50%) scale(0.9) rotate(18deg);
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

export default MangoPot;
