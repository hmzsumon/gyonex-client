/* ──────────────────────────────────────────────────────────────────────────
   TradingPassword — final step; calls createAccount (RTK Query)
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useCreateAccountMutation } from "@/redux/features/account/accountApi";
import { useState } from "react";
import { WizardState } from "../OpenAccountWizard";

export default function TradingPassword({
  value,
  onChange,
  onBack,
  onClose,
}: {
  value: WizardState;
  onChange: (v: WizardState) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [pwd, setPwd] = useState("");
  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const valid =
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /\d/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd);

  return (
    <div className="p-4">
      <div className="text-sm text-neutral-400 mb-3">
        Trading password is a password you use to log in to MetaTrader.
      </div>

      <input
        type="password"
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 outline-none"
        placeholder="Enter trading password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />

      <ul className="mt-3 text-xs text-neutral-400 space-y-1">
        <li>• Between 8–15 characters</li>
        <li>• At least one upper and one lower case letter</li>
        <li>• At least one number</li>
        <li>• At least one special character</li>
      </ul>

      <div className="text-xs text-neutral-500 mt-3">
        Save this password now. For your security, it won’t be sent to your
        email.
      </div>

      <div className="flex gap-2 mt-5">
        <button
          className="flex-1 py-3 rounded-xl border border-neutral-800"
          onClick={onBack}
        >
          Back
        </button>
        <button
          disabled={!valid || isLoading}
          className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-semibold disabled:opacity-50"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
