// components/trade/AccountCard.tsx
import { IAccount } from "@/redux/features/account/accountApi";
import Link from "next/link";
import { useState } from "react";
import AccountLiveEquity from "./AccountLiveEquity";
import OpenAccountFab from "./OpenAccountFab";
import OpenAccountWizard from "./wizard/OpenAccountWizard";

export default function AccountCard({
  acc,
  onOpenPicker,
}: {
  acc: IAccount;
  onOpenPicker: () => void;
}) {
  const [openWizard, setOpenWizard] = useState(false);

  return (
    <div className="rounded-lg bg-neutral-950 border border-neutral-800 px-2 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          {acc.type.toUpperCase()} <span className="text-neutral-500">#</span>{" "}
          <span className="font-medium">{acc.accountNumber}</span>
        </div>
        {/* FABs */}
        <OpenAccountFab onClick={() => setOpenWizard(true)} />
      </div>

      {/* chips */}
      <div className="mt-2 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-lg bg-neutral-800">CGFX</span>
        <span className="px-2 py-1 rounded-lg bg-neutral-800 capitalize">
          {acc.name ? acc.name : acc.type}
        </span>
        <span className="px-2 py-1 rounded-lg bg-neutral-800">
          {acc.mode ?? "live"}
        </span>
      </div>

      {/* Live equity */}
      <div className="mt-4 flex items-center justify-between">
        <AccountLiveEquity
          accountId={String(acc._id)}
          baseBalance={Number(acc.balance ?? acc.equity ?? 0)}
          className="w-full"
        />
        {/* If you still want “Switch account” at the right, move it below */}
      </div>

      <div className="mt-2 text-right">
        <button
          className="cursor-pointer text-sm text-neutral-400 underline"
          onClick={onOpenPicker}
        >
          Switch account
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Link href="/live-trade" className="w-full">
          <button className="rounded-lg bg-neutral-800 w-full py-2">
            Live Trade
          </button>
        </Link>
        <Link href="/transfer" className="w-full">
          <button className="rounded-lg bg-neutral-800 w-full py-2">
            Transfer
          </button>
        </Link>

        <button className="rounded-lg bg-neutral-800 w-full py-2">
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
