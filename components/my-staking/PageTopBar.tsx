"use client";

import { PiggyBank } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageTopBar({ title }: { title: string }) {
  const router = useRouter();

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

      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
          <PiggyBank className="h-4 w-4 text-white/90" />
        </div>
        <h1 className="text-base font-semibold tracking-wide">{title}</h1>
      </div>

      <div className="h-10 w-10" />
    </div>
  );
}
