// app/(agent)/AgentDashboardPage.tsx
"use client";

import InvitationMethod from "@/components/agent/InvitationMethod";
import KpiGrid from "@/components/agent/KpiGrid";
import MetricCardsRow from "@/components/agent/MetricCardsRow";
import { useAgentTeamSummary, type Range } from "@/hooks/useAgentTeamSummary";
import { useState } from "react";
import { useSelector } from "react-redux";

const AgentDashboardPage: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { kpisText, getMetricsByRange, levels, loading } =
    useAgentTeamSummary();

  // referral link
  const host = typeof window !== "undefined" ? window.location.host : "";
  const referralLink =
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    host +
    `/register-login?tab=create&referral_code=${user?.customerId}`;
  const shortReferralLink = referralLink.slice(0, 22) + "...";

  const [range, setRange] = useState<Range>("yesterday");
  const metrics = getMetricsByRange(range);

  return (
    <div className="min-h-dvh bg-[#0b0e11]">
      <main className="mx-auto max-w-6xl space-y-4 py-6">
        <h2 className="ml-2 text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200 drop-shadow">
          Agent Dashboard
        </h2>

        <section>
          <InvitationMethod
            code={user?.customerId}
            fullCode={user?.customerId}
            link={shortReferralLink}
            fullLink={referralLink}
          />
        </section>

        <KpiGrid
          loading={loading}
          countOfReferring={String(levels[0]?.users?.length) ?? 0}
          activeUsers={String(levels[0]?.activeUsers) ?? 0}
          totalReferralIncome={kpisText.totalReferralIncome}
          level1AiTradeBalance={String(levels[0]?.aiTradeBalance) ?? 0}
          level1LiveTradeBalance={String(levels[0]?.liveTradeBalance) ?? 0}
        />

        <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <MetricCardsRow
            loading={loading}
            deposit={levels[0]?.deposit ? levels[0]?.deposit : 0}
            withdraw={levels[0]?.withdraw ? levels[0]?.withdraw : 0}
            netDeposit={metrics.netDeposit}
            aiTradeRoi={levels[0]?.aiTradeCommission ?? 0}
            volume={levels[0]?.liveTradeCommission ?? 0}
          />
        </section>
      </main>
    </div>
  );
};

export default AgentDashboardPage;
