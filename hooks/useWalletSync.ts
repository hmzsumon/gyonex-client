// hooks/useWalletSync.ts
"use client";

import { useLazyGetWalletQuery } from "@/redux/features/wallet/walletApi";
import { useEffect } from "react";

/* ── Periodic + focus/visibility sync ─────────────────────────────────── */
export function useWalletSync(intervalMs = 15000) {
  const [trigger] = useLazyGetWalletQuery();

  useEffect(() => {
    let mounted = true;
    const fetchNow = () => mounted && trigger();

    // initial
    fetchNow();

    // interval
    const iv = setInterval(fetchNow, intervalMs);

    // focus/visibility
    const onVis = () => {
      if (document.visibilityState === "visible") fetchNow();
    };
    window.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", fetchNow);

    return () => {
      mounted = false;
      clearInterval(iv);
      window.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", fetchNow);
    };
  }, [trigger, intervalMs]);
}
