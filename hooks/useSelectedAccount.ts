// hooks/useSelectedAccount.ts
"use client";

import { useGetMyAccountsQuery } from "@/redux/features/account/accountApi";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export function useSelectedAccount() {
  const { data, isLoading, isFetching } = useGetMyAccountsQuery();
  const selectedId = useSelector(
    (s: RootState) => s.accountUI.selectedAccountId
  );

  const items = data?.items ?? [];

  // পছন্দের fallback অর্ডার:
  // 1) selectedId মেলে
  // 2) real + active
  // 3) demo + active
  // 4) প্রথম আইটেম (যদি কিছুই না মেলে)
  const account =
    items.find((a) => a._id === selectedId) ||
    items.find((a) => a.mode === "real" && a.status === "active") ||
    items.find((a) => a.mode === "demo" && a.status === "active") ||
    items[0] ||
    null;

  return {
    account,
    items,
    loading: (isLoading || isFetching) && !data,
  };
}
