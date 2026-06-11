"use client";

import type { PriceDir } from "@/hooks/usePriceFlashMap";
import { useState } from "react";
import LiveAccountWrapper from "../accounts/LiveAccountWrapper";
import AiAccountsPage from "../ai-accounts/AiAccountPage";
import Activities from "./Activities";
import CryptoTabContent from "./CryptoTabContent";

type TabKey = "crypto" | "account" | "activities";

// ✅ Dashboard header এ পাঠানোর জন্য snapshot টাইপ
export type PortfolioSnapshot = {
  total: number;
  dir: PriceDir;
  flash: boolean;
  loading: boolean;
};

export default function WalletTabs({
  onPortfolioChange,
}: {
  onPortfolioChange?: (snap: PortfolioSnapshot) => void;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("crypto");

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex gap-6">
          <TabButton
            label="Crypto"
            isActive={activeTab === "crypto"}
            onClick={() => setActiveTab("crypto")}
          />
          <TabButton
            label="Account"
            isActive={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          />

          <TabButton
            label="Activities"
            isActive={activeTab === "activities"}
            onClick={() => setActiveTab("activities")}
          />
        </div>

        {/* ডান দিকের আইকন অংশ চাইলে কাস্টমাইজ করো */}
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <button className="hover:text-zinc-200 transition-colors">
            {/* search icon / svg */}
            🔍
          </button>
          <button className="hover:text-zinc-200 transition-colors">
            {/* notification icon / svg */}
            🕒
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mt-4">
        {/* ✅ ডিজাইন একই রেখে CryptoTabContent সবসময় mounted রাখা হলো */}
        <div className={activeTab === "crypto" ? "block" : "hidden"}>
          <CryptoTabContent onPortfolioChange={onPortfolioChange} />
        </div>

        {activeTab === "account" && <AccountTabContent />}
        {activeTab === "activities" && <Activities />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-1 text-sm transition-colors ${
        isActive
          ? "text-white font-semibold"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-yellow-400" />
      )}
    </button>
  );
}

/* ----- এই দুইটা কম্পোনেন্টে তুমি নিজের আসল UI বসিয়ে দাও ----- */

function AccountTabContent() {
  return (
    <div className="text-zinc-100  space-y-4">
      {/* Account related component / UI */}
      <div className="border border-zinc-800 ">
        <AiAccountsPage />
      </div>
      <div className="border border-zinc-800 ">
        <LiveAccountWrapper />
      </div>
    </div>
  );
}

function ActivitiesTabContent() {
  return (
    <div className="text-zinc-100 text-sm">
      {/* Activities related component / UI */}
      Activities tab content goes here...
    </div>
  );
}
