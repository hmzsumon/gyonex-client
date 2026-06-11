/* ── CTA Section ────────────────────────────────────────────────────────────── */

import { ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";
import Card from "./Card";
import Container from "./Container";

const CTASection: React.FC = () => (
  <section className="bg-neutral-950 pb-16">
    <Container>
      <Card className="flex flex-col items-center justify-between gap-6 border-0 bg-gradient-to-br from-neutral-900 to-black p-8 sm:flex-row">
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Trade with a trusted Exchanger today
          </h3>
          <p className="mt-1 text-sm text-neutral-300">
            Start your journey with better-than-market conditions and 100+
            instruments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800">
            Try the demo
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
            icon={ArrowRight}
          >
            Register
          </Button>
        </div>
      </Card>
    </Container>
  </section>
);

export default CTASection;
