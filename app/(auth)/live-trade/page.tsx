// app/(auth)/trade/page.tsx
"use client";

import TradeScreen from "@/components/trade/TradeScreen";
import { useSelectedAccount } from "@/hooks/useSelectedAccount";

export default function Page() {
  const { account, loading } = useSelectedAccount();

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] grid place-items-center">
        <div className="text-neutral-500">Loading markets…</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)]">
      <TradeScreen account={account} />
    </div>
  );
}
