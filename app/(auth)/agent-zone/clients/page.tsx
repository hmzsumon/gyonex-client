// app/(agent)/AgentDashboardPage.tsx
"use client";

import KpiGrid from "@/components/agent/KpiGrid";
import MetricCardsRow from "@/components/agent/MetricCardsRow";
import { useAgentTeamSummary, type Range } from "@/hooks/useAgentTeamSummary";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

const MyClientsPage: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { kpisText, getMetricsByRange, levels, loading } =
    useAgentTeamSummary();

  const [range, setRange] = useState<Range>("yesterday");
  const metrics = getMetricsByRange(range);

  return (
    <div className="min-h-dvh bg-[#0b0e11]">
      <main className="mx-auto max-w-6xl space-y-4 py-6">
        <h2 className="ml-2 text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200 drop-shadow">
          My Clients
        </h2>

        <KpiGrid
          loading={loading}
          countOfReferring={kpisText.countOfReferring}
          totalReferralIncome={kpisText.totalReferralIncome}
          level1AiTradeBalance={kpisText.level1AiTradeBalance}
          level1LiveTradeBalance={kpisText.level1LiveTradeBalance}
          activeUsers={kpisText.activeUsers}
        />

        <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <MetricCardsRow
            loading={loading}
            deposit={metrics.deposit}
            withdraw={metrics.withdraw}
            netDeposit={metrics.netDeposit}
            aiTradeRoi={metrics.aiTradeRoi ?? 0}
            volume={metrics.volume}
          />
        </section>

        {/* Team users info section */}
        <section className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-200">
            Team Users
          </h3>

          <div className="space-y-2">
            {levels.map((lvl) => (
              <div
                key={lvl.level}
                className="flex items-center justify-between rounded-md bg-neutral-900/90 px-3 py-2"
              >
                <span className="text-sm text-neutral-300">
                  {lvl.ordinalLabel} Level User:{" "}
                  <span className="font-semibold text-neutral-100">
                    {lvl.userCount}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/agent-zone/team/level/${lvl.level}`}
                    className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-900"
                  >
                    More detail <Info size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyClientsPage;
