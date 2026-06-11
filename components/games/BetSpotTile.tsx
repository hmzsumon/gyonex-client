import React from "react";

type Gradient = { start: string; mid?: string; end: string };

type TileFrame = {
  outer?: Gradient; // পাতলা বাইরের ফ্রেম
  inner?: Gradient; // পাতলা ভিতরের ফ্রেম
  thickness?: number; // px (ডিফল্ট 3)
  gap?: number; // px (ডিফল্ট 2)
};

export type BetSpotTileProps = {
  width?: number; // ডিফল্ট 180
  height?: number; // ডিফল্ট 220
  radius?: number; // ডিফল্ট 18

  bg?: Gradient; // ভেতরের পার্পল/গ্রিন/ইত্যাদি ব্যাকগ্রাউন্ড
  frame?: TileFrame; // পাতলা বর্ডার কনফিগ (gold look)

  // কন্টেন্ট (একটা দিলেই যথেষ্ট)
  emoji?: string;
  icon?: React.ReactNode; // react-icons/lucide JSX
  src?: string; // png/webp/svg
  iconSize?: number; // না দিলে অটো

  // UI অ্যাকসেন্টস
  multiplier?: string; // যেমন "X 2.9" (ঐচ্ছিক, না দিলে দেখাবে না)
  amount?: number; // বটমে বেট অ্যামাউন্ট (ঐচ্ছিক)
  format?: "raw" | "short";
  currency?: string; // "$" | "" ইত্যাদি
  amountColor?: string;

  // ইন্টারঅ্যাকশন
  selected?: boolean; // সিলেক্টেড গ্লো + হালকা স্কেল
  hoverLift?: boolean; // hover এ লিফট
  droppable?: boolean; // drop-zone স্টাইল
  onClick?: () => void;
  onDrop?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLButtonElement>) => void;

  // ওভারলে: ছোট ছোট চিপ দেখানোর জন্য
  chipOverlay?: React.ReactNode;

  className?: string;
  disabled?: boolean;
};

const short = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(0) + "b";
  if (a >= 1e6) return (n / 1e6).toFixed(0) + "m";
  if (a >= 1e3) return (n / 1e3).toFixed(0) + "k";
  return String(n);
};

const grad = (g?: Gradient) =>
  g
    ? `linear-gradient(180deg, ${g.start} 0%, ${g.mid ?? g.start} 50%, ${
        g.end
      } 100%)`
    : "transparent";

const BetSpotTile: React.FC<BetSpotTileProps> = ({
  width = 180,
  height = 220,
  radius = 18,

  bg = { start: "#6D177D", mid: "#7C1DB1", end: "#4C0E6B" },
  frame = {
    outer: { start: "#FFE08A", mid: "#FFD256", end: "#FFA629" },
    inner: { start: "#FFF3B5", mid: "#FFD867", end: "#FFA93A" },
    thickness: 3,
    gap: 2,
  },

  emoji,
  icon,
  src,
  iconSize,

  multiplier,
  amount,
  format = "raw",
  currency = "$",
  amountColor = "#FFE26C",

  selected = false,
  hoverLift = true,
  droppable = false,
  onClick,
  onDrop,
  onDragOver,

  chipOverlay,
  className = "",
  disabled = false,
}) => {
  const iconPx = iconSize ?? Math.round(Math.min(width, height) * 0.42);
  const label =
    amount === undefined
      ? ""
      : format === "short"
      ? `${currency}${short(amount)}`
      : `${currency}${amount}`;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onDrop={(e) => {
        if (!droppable) return;
        e.preventDefault();
        onDrop?.(e);
      }}
      onDragOver={(e) => {
        if (!droppable) return;
        e.preventDefault();
        onDragOver?.(e);
      }}
      className={[
        "relative inline-block select-none",
        "transition-transform duration-150",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        hoverLift && !disabled ? "hover:-translate-y-0.5" : "",
        selected ? "scale-[1.02]" : "",
        droppable ? "outline-dashed outline-1 outline-transparent" : "",
        className,
      ].join(" ")}
      style={{ width, height, borderRadius: radius }}
    >
      {/* soft outer shadow */}
      <span
        className="absolute inset-0 rounded-[inherit]"
        style={{ boxShadow: "0 10px 22px rgba(0,0,0,.28)" }}
      />

      {/* thin outer frame (gold) */}
      <span
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: grad(frame.outer) }}
      />

      {/* thin inner frame */}
      <span
        className="absolute rounded-[inherit]"
        style={{
          inset: frame.thickness ?? 3,
          background: grad(frame.inner),
        }}
      />

      {/* content panel (purple/green etc) */}
      <span
        className="absolute rounded-[inherit]"
        style={{
          inset: (frame.thickness ?? 3) * 2 + (frame.gap ?? 2),
          background: grad(bg),
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.35), inset 0 -10px 18px rgba(0,0,0,.25)",
        }}
      />

      {/* glossy top strip */}
      <span
        className="absolute rounded-[inherit] pointer-events-none"
        style={{
          left: (frame.thickness ?? 3) * 2 + (frame.gap ?? 2),
          right: (frame.thickness ?? 3) * 2 + (frame.gap ?? 2),
          top: (frame.thickness ?? 3) * 2 + (frame.gap ?? 2),
          height: Math.round(height * 0.16),
          borderRadius:
            radius - ((frame.thickness ?? 3) * 2 + (frame.gap ?? 2)),
          background:
            "linear-gradient(180deg, rgba(255,255,255,.30), rgba(255,255,255,0))",
          opacity: 0.9,
        }}
      />

      {/* multiplier pill (optional) */}
      {multiplier && (
        <span
          className="absolute left-1/2 -translate-x-1/2 top-3 px-4 py-[6px] rounded-full text-white font-extrabold text-[14px]"
          style={{
            background:
              "linear-gradient(180deg,#b36cff_0%,#8e39f5_54%,#6a17da_100%)",
            boxShadow:
              "0 6px 10px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.45)",
          }}
        >
          {multiplier}
        </span>
      )}

      {/* icon / emoji / image */}
      <div
        className="absolute grid place-items-center"
        style={{
          inset: (frame.thickness ?? 3) * 2 + (frame.gap ?? 2),
          paddingTop: multiplier ? 28 : 16,
          paddingBottom: 40,
          borderRadius:
            radius - ((frame.thickness ?? 3) * 2 + (frame.gap ?? 2)),
        }}
      >
        {src ? (
          <img
            src={src}
            width={iconPx}
            height={iconPx}
            className="object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,.35)]"
            alt=""
          />
        ) : emoji ? (
          <span
            style={{ fontSize: iconPx, lineHeight: 1 }}
            className="drop-shadow-[0_6px_10px_rgba(0,0,0,.35)]"
          >
            {emoji}
          </span>
        ) : icon ? (
          <span style={{ fontSize: iconPx }} className="text-white">
            {icon}
          </span>
        ) : null}
      </div>

      {/* bottom amount (optional) */}
      {amount !== undefined && (
        <div
          className="absolute bottom-2 w-full text-center font-extrabold"
          style={{
            color: amountColor,
            textShadow: "0 2px 0 rgba(0,0,0,.35), 0 4px 10px rgba(0,0,0,.25)",
            fontSize: Math.round(Math.min(width, height) * 0.2),
          }}
        >
          {label}
        </div>
      )}

      {/* chip overlay (small stack / counters) */}
      {chipOverlay && (
        <div className="absolute right-2 bottom-8">{chipOverlay}</div>
      )}

      {/* selected glow ring */}
      {selected && (
        <span
          className="absolute rounded-[inherit] pointer-events-none"
          style={{
            inset: -2,
            boxShadow:
              "0 0 0 3px rgba(16,185,129,.55), 0 10px 22px rgba(0,0,0,.28)",
          }}
        />
      )}
    </button>
  );
};

export default BetSpotTile;
