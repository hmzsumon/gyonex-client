/* ── Hero ───────────────────────────────────────────────────────────────────── */

import heroImage from "@/public/images/hero/crypto_img_1.png";
import { Clock, Headphones, PlayCircle, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import React from "react";
import Button from "./Button";
import Container from "./Container";

const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-neutral-950">
    <Container className="grid grid-cols-1 items-center gap-10 pt-6 pb-10 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
          Upgrade the way
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            {" "}
            you trade
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-neutral-300">
          Trade with a reliable platform and benefit from better-than-market
          conditions.
        </p>
        <div className="grid grid-cols-2 mt-4 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2">
          <Button className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950">
            Start now
          </Button>
          <Button
            className="border border-neutral-800 bg-neutral-900 text-neutral-200"
            icon={PlayCircle}
          >
            Take a tour
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-neutral-400 sm:grid-cols-4">
          {[
            { icon: Zap, label: "Ultra-fast execution" },
            { icon: Headphones, label: "24/7 support" },
            { icon: Clock, label: "No overnight fees" },
            { icon: ShieldCheck, label: "Bank-grade security" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <Image
          src={heroImage}
          alt="Hero Image"
          className="mx-auto rounded-lg shadow-l w-80 object-cover"
        />
      </div>
    </Container>
  </section>
);

export default Hero;
