// app/faq/page.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is the minimum deposit for Smart Trade?",
    a: "You can start Smart Trade with a minimum of $30.",
  },
  {
    q: "What are the withdrawal rules?",
    a: "Network: TRC20, Minimum: $20, Fee: 8%. User→User transfer minimum is $10.",
  },
  {
    q: "How is Smart Trade profit shared?",
    a: "The user receives 60%. From the company portion, upline commissions are distributed.",
  },
  {
    q: "What are the upline commission levels?",
    a: "5 levels: 30%, 25%, 20%, 15%, 10% respectively.",
  },
  {
    q: "Is there a referral bonus?",
    a: "Yes—referrals earn a defined bonus according to the plan.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="mx-auto max-w-3xl px-3 py-6 text-white">
      <h1 className="mb-4 text-2xl font-extrabold tracking-tight">FAQs</h1>

      <div className="space-y-2">
        {faqs.map((item, idx) => {
          const isOpen = open === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60"
            >
              <button
                onClick={() => setOpen(isOpen ? null : idx)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold">{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-sm text-neutral-300">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
