// FILE: components/dashboard/HeaderBar.tsx
"use client";
import { Bell, RotateCcw } from "lucide-react";

export function HeaderBar() {
  return (
    <header className="flex items-center justify-between px-4 pt-6 pb-3">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 animate-spin-slow rounded-full border-2 border-white/20 border-t-white/80" />
        <h1 className="text-lg font-semibold tracking-tight">Capitalise</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-full p-2 hover:bg-white/5"
          aria-label="refresh"
        >
          <RotateCcw className="h-5 w-5 opacity-80" />
        </button>
        <button
          className="relative rounded-full p-2 hover:bg-white/5"
          aria-label="notifications"
        >
          <Bell className="h-5 w-5 opacity-80" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400" />
        </button>
      </div>
    </header>
  );
}
