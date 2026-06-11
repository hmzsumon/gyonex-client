// components/ui/FullscreenLoader.tsx
"use client";

/* ── Types ───────────────────────────────────────────────────────────── */
import React, { useEffect, useRef, useState } from "react";

type AssetKind = "img" | "audio" | "video" | "fetch" | "font";
type AssetInput =
  | string
  | {
      /** Absolute/relative URL */
      src: string;
      /** Kind auto-inferred from extension if omitted */
      kind?: AssetKind;
      /** If true (default), any failure keeps loader stuck and logs error */
      critical?: boolean;
      /** Optional fetch options (for kind="fetch") */
      request?: RequestInit;
    };

type Props = {
  /** Control visibility manually (optional). If omitted, it auto-hides on completion. */
  show?: boolean;
  /** Image/Audio/Video/Any URLs to preload */
  assets?: AssetInput[];
  /** Minimum time to keep loader visible (ms) to avoid flash. */
  minDurationMs?: number;
  /** Called when loading finishes (all *critical* assets loaded + min duration). */
  onDone?: () => void;
  /** Optional brand/logo node to show above the bar. */
  logo?: React.ReactNode;
  /** z-index for the overlay. */
  zIndex?: number;
  /** Smooth/eased progress */
  smooth?: boolean;
};

/* ── Helpers ─────────────────────────────────────────────────────────── */
const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

function inferKind(src: string): AssetKind {
  const q = src.split("?")[0].toLowerCase();
  if (/\.(png|jpg|jpeg|gif|webp|svg|avif)$/.test(q)) return "img";
  if (/\.(mp3|wav|ogg|m4a)$/.test(q)) return "audio";
  if (/\.(mp4|webm|ogg)$/.test(q)) return "video";
  if (/\.(woff2?|ttf|otf|eot)$/i.test(q)) return "fetch"; // fonts → fetch HEAD/GET
  if (/\.(json|txt|pdf|bin|glb|wasm)$/i.test(q)) return "fetch";
  return "fetch";
}

function normalizeAssets(assets: AssetInput[]): {
  src: string;
  kind: AssetKind;
  critical: boolean;
  request?: RequestInit;
}[] {
  return (assets || []).map((a) => {
    if (typeof a === "string")
      return { src: a, kind: inferKind(a), critical: true as const };
    return {
      src: a.src,
      kind: a.kind ?? inferKind(a.src),
      critical: a.critical ?? true,
      request: a.request,
    };
  });
}

/* ── Component ────────────────────────────────────────────────────────── */
export default function FullscreenLoader({
  show,
  assets = [],
  minDurationMs = 1200,
  onDone,
  logo,
  zIndex = 9999,
  smooth = true,
}: Props) {
  const [internalShow, setInternalShow] = useState<boolean>(true);
  const [rawProgress, setRawProgress] = useState<number>(0); // 0..100
  const rafRef = useRef<number | null>(null);
  const cancelRef = useRef<boolean>(false);

  const list = normalizeAssets(assets);
  const total = list.length;
  const progress = clamp(rawProgress);

  useEffect(() => {
    cancelRef.current = false;
    setRawProgress(0);
    const startedAt = performance.now();

    const cleanup = () => {
      cancelRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    // No assets → behave like before
    if (total === 0) {
      const finish = () => {
        const elapsed = performance.now() - startedAt;
        const wait = Math.max(0, minDurationMs - elapsed);
        setTimeout(() => {
          setRawProgress(100);
          onDone?.();
          setInternalShow(false);
        }, wait);
      };
      if (smooth) {
        let p = 0;
        const tick = () => {
          if (cancelRef.current) return;
          p = clamp(p + Math.random() * 10, 0, 95);
          setRawProgress(p);
          if (p < 95) rafRef.current = requestAnimationFrame(tick);
          else finish();
        };
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finish();
      }
      return cleanup;
    }

    /* ── With assets: success-only progress; any CRITICAL error keeps loader open ── */
    let loadedSuccess = 0;
    let attempted = 0;
    let criticalFailed = 0;
    const failed: string[] = [];
    let targetPercent = 0;

    const updateTarget = () => {
      targetPercent = (loadedSuccess / total) * 100;
      if (!smooth) setRawProgress(targetPercent);
    };

    const maybeFinalize = () => {
      if (attempted < total) return;
      if (criticalFailed === 0) {
        // ✅ All critical ok → finish after minDuration
        const finalize = () => {
          const elapsed = performance.now() - startedAt;
          const wait = Math.max(0, minDurationMs - elapsed);
          setTimeout(() => {
            if (smooth) {
              let p = progress;
              const ease = () => {
                if (cancelRef.current) return;
                p = p + (100 - p) * 0.2;
                setRawProgress(p);
                if (p < 99.5) rafRef.current = requestAnimationFrame(ease);
                else {
                  setRawProgress(100);
                  onDone?.();
                  setInternalShow(false);
                }
              };
              rafRef.current = requestAnimationFrame(ease);
            } else {
              setRawProgress(100);
              onDone?.();
              setInternalShow(false);
            }
          }, wait);
        };
        finalize();
      } else {
        // ❌ Some critical failed → freeze & log; do not hide
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setRawProgress(targetPercent);
        failed.forEach((src) =>
          console.error(
            `[FullscreenLoader] Asset failed to load (critical=${
              list.find((x) => x.src === src)?.critical ?? "?"
            }): ${src}`
          )
        );
        console.error(
          `[FullscreenLoader] ${criticalFailed} critical of ${total} assets failed. Loader will remain visible.`
        );
      }
    };

    const onSuccess = () => {
      loadedSuccess += 1;
      attempted += 1;
      updateTarget();
      maybeFinalize();
    };

    const onError = (itemSrc: string, isCritical: boolean) => {
      attempted += 1;
      if (isCritical) criticalFailed += 1;
      failed.push(itemSrc);
      console.error(
        `[FullscreenLoader] Asset failed to load (not found / network): ${itemSrc}`
      );
      updateTarget();
      maybeFinalize();
    };

    // Smooth easing loop towards targetPercent
    if (smooth) {
      const tick = () => {
        if (cancelRef.current) return;
        setRawProgress((prev) => {
          const next = prev + (targetPercent - prev) * 0.12;
          return Math.abs(next - prev) < 0.05 ? targetPercent : next;
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    // Kick off loads per kind
    const loaders: Array<() => void> = [];

    list.forEach((item) => {
      const { src, kind, critical, request } = item;

      if (kind === "img") {
        const img = new Image();
        img.onload = onSuccess;
        img.onerror = () => onError(src, !!critical);
        img.src = src;
        loaders.push(() => {
          img.onload = null;
          img.onerror = null;
        });
      } else if (kind === "audio") {
        const a = new Audio();
        a.preload = "auto";
        a.addEventListener("canplaythrough", onSuccess, { once: true });
        a.addEventListener("error", () => onError(src, !!critical), {
          once: true,
        });
        a.src = src;
        // Note: auto-play নাও হতে পারে, কিন্তু preload ঠিকঠাক কাজ করবে
        loaders.push(() => {
          a.removeAttribute("src");
          a.load();
        });
      } else if (kind === "video") {
        const v = document.createElement("video");
        v.preload = "auto";
        const done = () => onSuccess();
        v.addEventListener("loadeddata", done, { once: true });
        v.addEventListener("error", () => onError(src, !!critical), {
          once: true,
        });
        v.src = src;
        loaders.push(() => {
          v.removeAttribute("src");
          v.load();
        });
      } else {
        // fetch/font → HEAD first, fallback GET
        (async () => {
          try {
            const head = await fetch(src, {
              method: "HEAD",
              ...(request || {}),
            });
            if (!head.ok) {
              // fallback GET (some servers disallow HEAD)
              const get = await fetch(src, {
                method: "GET",
                ...(request || {}),
              });
              if (!get.ok) throw new Error(`GET ${get.status}`);
            }
            onSuccess();
          } catch {
            onError(src, !!critical);
          }
        })();
      }
    });

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    total,
    minDurationMs,
    smooth,
    // stringify assets for effect key
    JSON.stringify(list.map((x) => ({ s: x.src, k: x.kind, c: x.critical }))),
  ]);

  const visible = show ?? internalShow;
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      aria-live="polite"
      aria-busy="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0b0a0a] bg-[radial-gradient(90%_60%_at_50%_30%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%),radial-gradient(80%_50%_at_50%_80%,rgba(255,215,128,0.06),rgba(0,0,0,0)_60%)] pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-md px-6 py-7 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,.6)]">
        {/* Logo / Title */}
        <div className="mb-5 flex items-center justify-center text-white">
          {logo ?? (
            <div className="font-extrabold tracking-widest text-lg">
              LOADING…
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 transition-[width] duration-200"
            style={{ width: `${progress.toFixed(0)}%` }}
          />
        </div>

        {/* Percentage */}
        <div className="mt-3 text-center text-sm font-semibold text-white/90 tabular-nums">
          {progress.toFixed(0)}%
        </div>

        {/* Tiny helper text */}
        <div className="mt-1 text-center text-xs text-white/50">
          Preparing assets…
        </div>
      </div>
    </div>
  );
}
