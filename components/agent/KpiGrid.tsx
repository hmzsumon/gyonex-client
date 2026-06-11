// components/agent/KpiGrid.tsx
"use client";

import { UsersRound } from "lucide-react";
import KpiTile from "./KpiTile";

const KpiGrid: React.FC<{
  loading?: boolean;
  countOfReferring: string; // already formatted text
  activeUsers: string;
  totalReferralIncome: string; // $
  level1AiTradeBalance: string; // $
  level1LiveTradeBalance: string; // $
}> = ({
  loading = false,
  countOfReferring,
  totalReferralIncome,
  level1AiTradeBalance,
  level1LiveTradeBalance,
  activeUsers,
}) => {
  const v = (t: string) => (loading ? "…" : t);

  const icon = <UsersRound size={22} className="text-white" />;

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div>
        <div className="grid grid-cols-[40px_1fr] gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-md `}
          >
            <UsersRound size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-neutral-300">Count of referring</p>
            <p className="mt-1 text-xl font-bold text-neutral-100">
              {countOfReferring}/{activeUsers}
            </p>
          </div>
        </div>
      </div>
      <KpiTile
        tone="teal"
        title="Total Referral income"
        value={v(totalReferralIncome)}
        icon="chart"
      />
      <KpiTile
        tone="amber"
        title="1st level Smart trade balance"
        value={v(level1AiTradeBalance)}
        icon="wallet"
      />
      <KpiTile
        tone="green"
        title="1st level Live trade balance"
        value={v(level1LiveTradeBalance)}
        icon="cash"
      />
    </section>
  );
};

export default KpiGrid;
