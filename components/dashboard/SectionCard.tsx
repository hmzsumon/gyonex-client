// FILE: components/dashboard/SectionCard.tsx
"use client";
import { ReactNode } from "react";
export function SectionCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className=" mt-4 rounded-lg border border-white/10 bg-[#111418] p-3 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
