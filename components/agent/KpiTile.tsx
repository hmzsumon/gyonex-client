/* ── KPI Tile ─────────────────────────────────────────────────────────────── */

"use client";

import { BadgeDollarSign, Landmark, LineChart, UsersRound } from "lucide-react";

type Props = {
  tone: "slate" | "teal" | "amber" | "green";
  title: string;
  value: string;
  icon?: "users" | "chart" | "wallet" | "cash";
};

const toneMap: Record<Props["tone"], string> = {
  slate: "bg-neutral-800",
  teal: "bg-teal-600",
  amber: "bg-amber-500",
  green: "bg-emerald-600",
};

const IconView: React.FC<{ icon?: Props["icon"] }> = ({ icon }) => {
  if (icon === "users") return <UsersRound size={22} className="text-white" />;
  if (icon === "chart") return <LineChart size={22} className="text-white" />;
  if (icon === "wallet") return <Landmark size={22} className="text-white" />;
  return <BadgeDollarSign size={22} className="text-white" />;
};

const KpiTile: React.FC<Props> = ({ tone, title, value, icon }) => {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-md ${toneMap[tone]}`}
      >
        <IconView icon={icon} />
      </div>
      <div>
        <p className="text-sm text-neutral-300">{title}</p>
        <p className="mt-1 text-xl font-bold text-neutral-100">{value}</p>
      </div>
    </div>
  );
};

export default KpiTile;
