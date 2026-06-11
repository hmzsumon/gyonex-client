/* ── Component: WalletCarousel (slider) ─────────────────────────────────── */
"use client";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import WalletCard, { BoundWallet } from "./WalletCard";

export default function WalletCarousel({
  items,
  selectedId,
  onSelect,
}: {
  items: BoundWallet[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    const cardWidth = 272; // ≈ w-64 + gap
    el.scrollBy({
      left: (dir === "next" ? 1 : -1) * cardWidth,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <div className="relative mt-3">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 py-1"
      >
        {items.map((w) => (
          <WalletCard
            key={w.id}
            w={w}
            selected={selectedId === w.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 hover:bg-black/60"
            aria-label="Prev"
          >
            <FaAngleLeft />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 hover:bg-black/60"
            aria-label="Next"
          >
            <FaAngleRight />
          </button>
        </>
      )}
    </div>
  );
}
