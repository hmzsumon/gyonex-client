/* ──────────────────────────────────────────────────────────────────────────
   AccountPickerSheet — bottom sheet with Real / Demo / Archived tabs
   Select → highlight and save to Redux (persists)
────────────────────────────────────────────────────────────────────────── */
"use client";

import {
  IAccount,
  useGetMyAiAccountsQuery,
} from "@/redux/features/ai-account/ai-accountApi";
import {
  AccountTab,
  setAccountTab,
  setSelectedAccountId,
} from "@/redux/features/ai-account/ai-accountUISlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

export default function AccountPickerSheet({
  open,
  onClose,
  onOpenCreate,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCreate: () => void;
}) {
  const { data } = useGetMyAiAccountsQuery();
  const dispatch = useDispatch();
  const currentTab = useSelector((s: RootState) => s.aiAccountUI.currentTab);
  const selectedId = useSelector(
    (s: RootState) => s.accountUI.selectedAccountId
  );

  if (!open) return null;
  const items = (data?.items ?? []) as IAccount[];

  const filtered = items.filter((a) => a.status === currentTab);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl">
        {/* header */}
        <div className="p-4 flex items-center justify-between">
          <div className="text-xl font-semibold"> AI Accounts</div>
        </div>

        {/* tabs */}
        <div className="px-4 flex gap-8 border-b border-neutral-800">
          {(["active", "inactive", "closed"] as AccountTab[]).map((t) => (
            <button
              key={t}
              onClick={() => dispatch(setAccountTab(t))}
              className={`py-3 text-sm ${
                currentTab === t
                  ? "border-b-2 border-white"
                  : "text-neutral-400"
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* list */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-sm text-neutral-400">No accounts found.</div>
          )}

          {filtered.map((acc) => {
            const selected = acc._id === selectedId;
            return (
              <button
                key={acc._id}
                onClick={() => {
                  dispatch(setSelectedAccountId(acc._id));
                  onClose();
                }}
                className={`w-full text-left rounded-2xl px-4 py-3 border ${
                  selected
                    ? "border-green-500 ring-1 ring-green-500/50 bg-neutral-900"
                    : "border-neutral-800 bg-neutral-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-medium capitalize">
                    {acc.mode} Account
                  </div>
                  <div className="text-sm">
                    {acc.balance.toFixed(2)} {acc.currency}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-[#0f2f18] text-[#69db7c] capitalize">
                    {acc.plan}
                  </span>
                  <span className="px-2 py-1 rounded bg-[#0f2f18] text-[#69db7c]">
                    # {acc.accountNumber}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* drag handle visual */}
        <div className="py-2 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}
