/* ── Opportunity Section ────────────────────────────────────────────────────── */

import paul from "@/public/images/akex.jpeg";
import Image from "next/image";
import React from "react";
import Card from "./Card";
import Container from "./Container";
import SectionTitle from "./SectionTitle";

const OpportunitySection2: React.FC = () => (
  <section className="bg-neutral-950 py-14">
    <Container className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <Card className="p-0">
        <Image
          src={paul}
          alt="Trading app screenshot"
          className="h-72 w-full rounded-2xl object-cover md:h-96"
        />
      </Card>
      <div>
        <SectionTitle
          align="left"
          title="Akex Kim"
          subtitle="Hi there, I am the  CEO at Upbit Trade Singapore."
        />
      </div>
    </Container>
  </section>
);

export default OpportunitySection2;
