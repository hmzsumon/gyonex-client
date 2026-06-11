// hooks/useSelectedAccount.ts
"use client";

import { useGetMyAiAccountsQuery } from "@/redux/features/ai-account/ai-accountApi";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export function useSelectedAiAccount() {
  const { data, isLoading, isFetching } = useGetMyAiAccountsQuery();
  const selectedId = useSelector(
    (s: RootState) => s.accountUI.selectedAccountId
  );

  const items = data?.items ?? [];

  // পছন্দের fallback অর্ডার:
  // 1) selectedId মেলে
  // 2) real + active
  // 3) demo + active
  // 4) প্রথম আইটেম (যদি কিছুই না মেলে)
  const account = items.find((a) => a._id === selectedId) || items[0] || null;

  return {
    account,
    items,
    loading: (isLoading || isFetching) && !data,
  };
}
