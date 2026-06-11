/* ── Card ───────────────────────────────────────────────────────────────────── */
import React, { ReactNode } from "react";

export interface CardProps {
  children?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm backdrop-blur ${className}`}
  >
    {children}
  </div>
);

export default Card;
