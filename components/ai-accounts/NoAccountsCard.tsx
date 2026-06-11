import { useState } from "react";
import OpenAccountFab from "./OpenAccountFab";
import OpenAccountWizard from "./wizard/OpenAccountWizard";

/* ──────────────────────────────────────────────────────────────────────────
   NoAccountsCard — matches your screenshot (Open / Restore)
────────────────────────────────────────────────────────────────────────── */
export default function NoAccountsCard({ onOpen }: { onOpen: () => void }) {
  const [openWizard, setOpenWizard] = useState(false);
  return (
    <div className="mt-4 rounded-2xl bg-neutral-900 border border-neutral-800 p-5">
      <div className="text-xl font-semibold">No active accounts</div>
      <div className="text-neutral-400 text-sm mt-1">
        Open a new account or restore an archived one.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <div className="flex flex-col items-center justify-center rounded-full bg-neutral-800 w-20 h-20 mx-auto">
          {/* FABs */}
          <OpenAccountFab onClick={() => setOpenWizard(true)} />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 text-center text-sm text-neutral-400">
        <div>Open account</div>
      </div>

      <OpenAccountWizard
        open={openWizard}
        onClose={() => setOpenWizard(false)}
      />
    </div>
  );
}
