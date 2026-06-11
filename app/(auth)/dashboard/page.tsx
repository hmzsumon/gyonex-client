"use client";

/* ── imports ─────────────────────────────────────────────────────────────── */
import LinkButton from "@/components/dashboard/LinkButton";
import PortfolioBalanceHeader from "@/components/dashboard/PortfolioBalanceHeader";
import WalletTabs from "@/components/dashboard/WalletTabs";
import type { PriceDir } from "@/hooks/usePriceFlashMap";
import { useState } from "react";

/* ── types ──────────────────────────────────────────────────────────────── */
type PortfolioSnapshot = {
  total: number;
  dir: PriceDir;
  flash: boolean;
  loading: boolean;
};

export default function DashboardPage() {
  // ✅ portfolio value comes from CryptoTabContent (live)
  const [portfolio, setPortfolio] = useState<PortfolioSnapshot>({
    total: 0,
    dir: "flat",
    flash: false,
    loading: true,
  });

  return (
    <main className="min-h-screen w-full bg-[#0b0e11] pb-24 text-white pt-6">
      <div className="space-y-6 mb-8">
        {/* ✅ Replace Main balance -> Portfolio total (live) */}
        <PortfolioBalanceHeader
          label="Total balance"
          total={portfolio.total}
          loading={portfolio.loading}
        />

        {/* ── Link buttons ───── */}
        <div className="grid grid-cols-3 gap-4">
          <LinkButton href="/deposit" variant="primary">
            Add Funds
          </LinkButton>

          <LinkButton href="/wallet/p2p" variant="secondary">
            Send
          </LinkButton>

          <LinkButton href="/transfer" variant="secondary">
            Transfer
          </LinkButton>
        </div>

        {/* ── Wallet Tabs (CryptoTabContent calculates total) ───── */}
        <div>
          <WalletTabs onPortfolioChange={setPortfolio} />
        </div>
      </div>
    </main>
  );
}
