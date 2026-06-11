"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  symbol: string;
  iconSrc?: string;
};

const TopBar = ({ title, symbol, iconSrc }: Props) => {
  const router = useRouter();
  const src = iconSrc || "/images/icons/default-coin.png";

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="h-10 w-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center"
        aria-label="Back"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </button>

      {/* ✅ center: icon + title */}
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
          <Image
            src={src}
            alt={symbol}
            width={28}
            height={28}
            className="h-6 w-6 object-contain"
          />
        </div>
        <h1 className="text-base font-semibold tracking-wide">{title}</h1>
      </div>

      <button
        className="h-10 w-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center"
        aria-label="Help"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 18h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.09 9a3 3 0 115.82 1c0 2-3 2-3 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.35"
          />
        </svg>
      </button>
    </div>
  );
};

export default TopBar;
