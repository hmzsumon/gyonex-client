/* ──────────────────────────────────────────────────────────────────────────
   AccountCard — shows single account (chips + balance + actions)
────────────────────────────────────────────────────────────────────────── */

import {
  IAccount,
  useAddFundToAiAccountMutation,
} from "@/redux/features/ai-account/ai-accountApi";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AiAccountLiveEquity from "../ai/AiAccoountLiveEquity";
import AiAccountDetailsPage from "./AiAccountDetailsPage";
import OpenAccountFab from "./OpenAccountFab";
import OpenAccountWizard from "./wizard/OpenAccountWizard";

export default function AccountCard({
  acc,
  onOpenPicker,
}: {
  acc: IAccount;
  onOpenPicker: () => void;
}) {
  const [addFund, { isLoading: isAddingFund }] =
    useAddFundToAiAccountMutation();
  const { user } = useSelector((s: any) => s.auth);
  const nedAmount = Number(acc.planPrice - (acc.balance ?? 0));
  const [openWizard, setOpenWizard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  /* ── Show details page ── */
  if (showDetails) {
    return (
      <AiAccountDetailsPage acc={acc} onBack={() => setShowDetails(false)} />
    );
  }

  const handleAddFunds = async () => {
    if (nedAmount <= 0) {
      toast.error("This account is already fully funded.");
      return;
    }

    const toastId = toast.loading("Adding funds to your Smart Trade account...");

    try {
      const res: any = await addFund({
        id: String(acc._id),
        amount: nedAmount,
      }).unwrap();

      const msg =
        res?.message ||
        `Successfully added ${nedAmount} USDT to your Smart Trade account.`;

      toast.success(msg, { id: toastId });
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to add funds. Please try again.";
      toast.error(msg, { id: toastId });
    }
  };

  return (
    <div className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          ST <span className="text-neutral-500">#</span>{" "}
          <span className="font-medium">{acc.accountNumber}</span>
        </div>
        {/* FABs */}
        <OpenAccountFab onClick={() => setOpenWizard(true)} />
      </div>

      {/* ── chips row ── */}
      <div className="mt-2 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-lg bg-neutral-800">GX</span>
        <span className="px-2 py-1 rounded-lg bg-neutral-800">ST</span>
        <span className="px-2 py-1 rounded-lg capitalize bg-neutral-800">
          {acc.plan}
        </span>
      </div>

      {/* ── Inactive alert ── */}
      {acc.status !== "active" && (
        <div>
          <div className="mt-3 text-center rounded-lg bg-yellow-800/20 px-3 py-2 text-xs text-yellow-300 border border-yellow-700">
            <h2>
              This account is {acc.status}. Please add{" "}
              <span className="font-semibold text-yellow-200">
                ({nedAmount} USDT)
              </span>{" "}
              funds to activate your account.
            </h2>
          </div>
          {/* ── Button for adding funds ── */}
          <div className="mt-2 text-center">
            <button
              className="w-full rounded-lg bg-yellow-600/80 px-4 py-2 text-sm font-medium text-yellow-100 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={user?.m_balance <= 0 || isAddingFund}
              onClick={handleAddFunds}
            >
              {isAddingFund ? "Adding..." : "Add Funds"}
            </button>
          </div>
        </div>
      )}

      {/* Live equity */}
      <div className="mt-4 flex items-center justify-between">
        <AiAccountLiveEquity
          accountId={String(acc._id)}
          plan={acc.plan}
          baseBalance={Number(acc.balance ?? acc.equity ?? 0)}
          className="w-full"
        />
        {/* If you still want “Switch account” at the right, move it below */}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Link href="/withdraw" className="w-full">
          <button className="rounded-lg w-full bg-neutral-800 py-2">
            Withdraw
          </button>
        </Link>

        <button
          className="rounded-lg w-full bg-neutral-800 py-2"
          onClick={onOpenPicker}
        >
          Switch account
        </button>

        <button
          className="rounded-lg bg-neutral-800 py-2"
          onClick={() => setShowDetails(true)}
        >
          Details
        </button>
      </div>

      <OpenAccountWizard
        open={openWizard}
        onClose={() => setOpenWizard(false)}
      />
    </div>
  );
}
