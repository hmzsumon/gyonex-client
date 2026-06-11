/* components/dashboard/SelectedAccountCard.tsx */
"use client";

import { usePositionSocket } from "@/hooks/ai/usePositionSocket";
import { useSelectedAiAccount } from "@/hooks/useSelectedAiAccount";
import PositionsPanel from "../ai/positions/PositionsPanel";
import AccountCard from "./AccountCard";
import NoAccountsCard from "./NoAccountsCard";

export default function SelectedAccountCard({
  onOpenPicker,
}: {
  onOpenPicker: () => void;
}) {
  const { account, loading } = useSelectedAiAccount();
  // ✅ socket hooks: listen + join account-room
  usePositionSocket();

  if (loading) {
    return (
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4">
        <div className="animate-pulse text-neutral-500">Loading account…</div>
      </div>
    );
  }

  if (!account) return <NoAccountsCard onOpen={onOpenPicker} />;

  return (
    <div>
      <AccountCard acc={account} onOpenPicker={onOpenPicker} />
      <PositionsPanel />
    </div>
  );
}
