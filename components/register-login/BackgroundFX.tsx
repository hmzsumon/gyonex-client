/* ── Background FX (hero-like radial glows) ─────────────────────────────────── */
import React from "react";

const BackgroundFX: React.FC = () => (
  <>
    <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(900px_540px_at_82%_18%,rgba(16,185,129,0.12),transparent_60%)]" />
    <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(820px_520px_at_90%_78%,rgba(34,211,238,0.10),transparent_60%)]" />
    <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(1400px_700px_at_-8%_50%,rgba(0,0,0,0.55),transparent_70%)]" />
  </>
);

export default BackgroundFX;
