/* ──────────────────────────────────────────────────────────────────────────
   Accounts Page — add SelectedAccountCard + AccountPickerSheet
────────────────────────────────────────────────────────────────────────── */
"use client";

import AccountPickerSheet from "@/components/ai-accounts/AccountPickerSheet";
import PromoCard from "@/components/ai-accounts/PromoCard";
import SelectedAccountCard from "@/components/ai-accounts/SelectedAccountCard";

import { setSelectedAccountId } from "@/redux/features/account/accountUISlice";
import { useGetMyAiAccountsQuery } from "@/redux/features/ai-account/ai-accountApi";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AiAccountsPage() {
  const { data, isLoading } = useGetMyAiAccountsQuery();
  const [openPicker, setOpenPicker] = useState(false);

  const dispatch = useDispatch();
  const selectedId = useSelector(
    (s: RootState) => s.accountUI.selectedAccountId,
  );

  useEffect(() => {
    const items = data?.items ?? [];
    if (!selectedId && items.length) {
      const firstReal =
        items.find((a) => a.status === "active" && a.mode === "ai") || items[0];
      dispatch(setSelectedAccountId(firstReal._id));
    }
  }, [data, selectedId, dispatch]);

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      <div className="max-w-4xl mx-auto  pb-24">
        <div className="pt-6">
          <h1 className="text-xl ml-2 font-bold">Smart Trade Accounts</h1>
        </div>

        <PromoCard />

        <div className="mt-4">
          {isLoading ? (
            <div className="rounded-2xl bg-neutral-900 p-6 border border-neutral-800">
              Loading...
            </div>
          ) : (
            <SelectedAccountCard onOpenPicker={() => setOpenPicker(true)} />
          )}
        </div>

        {/* Sheets */}
        <AccountPickerSheet
          open={openPicker}
          onClose={() => setOpenPicker(false)}
          onOpenCreate={() => {
            setOpenPicker(false);
          }}
        />
      </div>
    </div>
  );
}
