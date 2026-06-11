// components/ui/PreloadGate.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import FullscreenLoader from "@/components/game-ui/FullscreenLoader";
import React, { useMemo, useState } from "react";

/* ── Types (exported) ─────────────────────────────────────────────────── */
export type AssetKind = "img" | "audio" | "video" | "fetch" | "font";
export type AssetInput =
  | string
  | {
      src: string;
      kind?: AssetKind; // literal types, e.g. "audio"
      critical?: boolean; // default handled inside
      request?: RequestInit; // for kind="fetch"
    };

type Props = {
  assets?: AssetInput[];
  minDurationMs?: number;
  logo?: React.ReactNode;
  smooth?: boolean;
  /** ── বাইরে থেকে গেট কন্ডিশন (যেমন: !authLoading) ─────────────────── */
  waitFor?: boolean;
  onReady?: () => void;
  children: React.ReactNode;
};

/* ── Helpers: normalize assets ─────────────────────────────────────────── */
function inferKind(src: string): AssetKind {
  const q = src.split("?")[0].toLowerCase();
  if (/\.(png|jpg|jpeg|gif|webp|svg|avif)$/.test(q)) return "img";
  if (/\.(mp3|wav|ogg|m4a)$/.test(q)) return "audio";
  if (/\.(mp4|webm|ogg)$/.test(q)) return "video";
  if (/\.(woff2?|ttf|otf|eot)$/i.test(q)) return "fetch";
  if (/\.(json|txt|pdf|bin|glb|wasm)$/i.test(q)) return "fetch";
  return "fetch";
}

function normalize(assets: AssetInput[]) {
  return (assets || []).map((a) =>
    typeof a === "string"
      ? { src: a, kind: inferKind(a), critical: true as const }
      : {
          src: a.src,
          kind: (a.kind ?? inferKind(a.src)) as AssetKind,
          critical: a.critical ?? true,
          request: a.request,
        }
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function PreloadGate({
  assets = [],
  minDurationMs = 1200,
  logo,
  smooth = true,
  waitFor = true,
  onReady,
  children,
}: Props) {
  const [assetsReady, setAssetsReady] = useState(false);
  const list = useMemo(() => normalize(assets), [JSON.stringify(assets)]);
  const allReady = assetsReady && !!waitFor;

  React.useEffect(() => {
    if (allReady) onReady?.();
  }, [allReady, onReady]);

  const showLoader = !allReady;

  return (
    <>
      <FullscreenLoader
        show={showLoader}
        assets={!assetsReady ? list : []}
        minDurationMs={minDurationMs}
        onDone={() => setAssetsReady(true)}
        logo={logo}
        zIndex={9999}
        smooth={smooth}
      />
      {children}
    </>
  );
}
