/* ── Podcast Promo ──────────────────────────────────────────────────────────── */

import { PlayCircle, Radio } from "lucide-react";
import React from "react";
import Button from "./Button";
import Container from "./Container";

const PodcastPromo: React.FC = () => (
  <section
    id="podcast"
    className="relative overflow-hidden border-y border-neutral-900 bg-neutral-950 py-16"
  >
    <Container className="relative">
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Podcast
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Upbit Trade— Born to Trade
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-neutral-300">
            Hear from pros on market psychology, building discipline, and
            staying prepared. Short, hands-on episodes to keep you sharp.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
            icon={Radio}
          >
            Listen now
          </Button>
          <Button
            className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800"
            icon={PlayCircle}
          >
            Latest episode
          </Button>
        </div>
      </div>
    </Container>
  </section>
);

export default PodcastPromo;
