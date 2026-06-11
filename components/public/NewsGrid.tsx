// components/NewsGrid.tsx
import trade1 from "@/public/images/trade_01.jpg";
import trade2 from "@/public/images/trade_02.jpg";
import trade3 from "@/public/images/trade_03.jpg";
import { ArrowRight } from "lucide-react";
import Image from "next/image"; // <-- next/image
import React from "react";
import Button from "./Button";
import Card from "./Card";
import Container from "./Container";
import SectionTitle from "./SectionTitle";

const items = [
  { title: "Can trade manually and can also do Smart trade", img: trade1 },
  { title: "Upbit Trade Affiliate Guide & Program", img: trade2 },
  { title: "Instant withdrawals: fast and convenient processing", img: trade3 },
];

const NewsGrid: React.FC = () => (
  <section id="news" className="bg-neutral-950 py-16">
    <Container>
      <SectionTitle
        title="Keep up with Upbit Trade"
        subtitle="Stay tuned for product improvements, promotions, events, and updates."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => (
          <Card key={n.title} className="p-0">
            {/* Image wrapper to support fill */}
            <div className="relative h-44 w-full overflow-hidden rounded-2xl">
              <Image
                src={n.img}
                alt="news"
                fill
                className="object-cover"
                placeholder="blur"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>

            <div className="p-5">
              <h4 className="font-semibold text-white">{n.title}</h4>
              <div className="mt-4">
                <Button
                  className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800"
                  icon={ArrowRight}
                >
                  Read more
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default NewsGrid;
