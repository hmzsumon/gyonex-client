/* ── Highlights Bar ─────────────────────────────────────────────────────────── */

import { Globe2, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";
import React from "react";
import Container from "./Container";

const HighlightsBar: React.FC = () => (
  <section className="border-y border-neutral-900 bg-neutral-950/60">
    <Container className="grid grid-cols-2 gap-6 py-6 text-sm text-neutral-300 sm:grid-cols-4">
      {[
        { icon: TrendingUp, label: "Tight spreads" },
        { icon: Globe2, label: "Global market access" },
        { icon: Smartphone, label: "Mobile first" },
        { icon: ShieldCheck, label: "Funds protection" },
      ].map((i, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <i.icon className="h-5 w-5 text-white" />
          <span>{i.label}</span>
        </div>
      ))}
    </Container>
  </section>
);

export default HighlightsBar;
