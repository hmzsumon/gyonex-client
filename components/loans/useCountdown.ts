"use client";

import { useCallback, useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Live countdown hook
────────────────────────────────────────────────────────────── */
export function useCountdown(dueDate?: string) {
  const calc = useCallback(() => {
    if (!dueDate) {
      return { days: 0, hours: 0, mins: 0, secs: 0, isOverdue: false };
    }

    const due = new Date(dueDate).getTime();
    const now = Date.now();
    const ms = Math.max(0, due - now);

    return {
      days: Math.floor(ms / 86400000),
      hours: Math.floor((ms % 86400000) / 3600000),
      mins: Math.floor((ms % 3600000) / 60000),
      secs: Math.floor((ms % 60000) / 1000),
      isOverdue: due < now && ms === 0,
    };
  }, [dueDate]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    setTime(calc());
    const id = window.setInterval(() => setTime(calc()), 1000);
    return () => window.clearInterval(id);
  }, [calc]);

  return time;
}
