/* ── Features Grid ──────────────────────────────────────────────────────────── */

import { BarChart3, Clock, Globe2, Headphones, Lock, Zap } from "lucide-react";
import React from "react";
import Card from "./Card";
import Container from "./Container";
import SectionTitle from "./SectionTitle";

const items = [
  {
    icon: Zap,
    title: "Instant withdrawals",
    desc: "Get your funds quickly with near-instant processing.",
  },
  {
    icon: Lock,
    title: "Advanced security",
    desc: "Multi-layer protection and segregated accounts.",
  },
  {
    icon: BarChart3,
    title: "Low spreads",
    desc: "Institutional-grade pricing across 200+ instruments.",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    desc: "Real humans, ready whenever you need help.",
  },
  {
    icon: Clock,
    title: "No overnight fees",
    desc: "Keep positions open with zero swap on select assets.",
  },
  {
    icon: Globe2,
    title: "Global liquidity",
    desc: "Deep liquidity from top-tier providers.",
  },
];

const FeaturesGrid: React.FC = () => (
  <section id="features" className="bg-neutral-950 py-14 sm:py-20">
    <Container>
      <SectionTitle
        eyebrow="Why Capitalice"
        title="Thrive in the gold, oil, indices, and crypto markets"
        subtitle="Fast, secure, and transparent execution to help you build an edge."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, idx) => (
          <Card key={idx}>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-neutral-800 p-3">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{f.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default FeaturesGrid;
