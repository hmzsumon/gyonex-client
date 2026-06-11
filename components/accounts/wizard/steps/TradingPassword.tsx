/* ──────────────────────────────────────────────────────────────────────────
   TradingPassword — final step; same password UX as RegisterForm
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useCreateAccountMutation } from "@/redux/features/account/accountApi";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { WizardState } from "../OpenAccountWizard";

/* ── tiny rule badge (tri-state: idle | ok | error) ─────────────────────── */
const Rule: React.FC<{ ok?: boolean; children: React.ReactNode }> = ({
  ok,
  children,
}) => {
  const cls =
    ok === undefined
      ? "text-neutral-400"
      : ok
      ? "text-emerald-500"
      : "text-red-500";

  return (
    <div className={`flex items-center gap-2 text-sm ${cls}`}>
      {ok === undefined ? (
        <span className="inline-block h-3 w-3 rounded-full bg-neutral-600" />
      ) : ok ? (
        <CheckCircle2 size={16} />
      ) : (
        <XCircle size={16} />
      )}
      <span>{children}</span>
    </div>
  );
};

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
  const [touched, setTouched] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [createAccount, { isLoading }] = useCreateAccountMutation();

  /* ── live stats for password helper (same as RegisterForm) ────────────── */
  const stats = useMemo(
    () => ({
      len: pwd.length >= 8 && pwd.length <= 15,
      lower: /[a-z]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      num: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    }),
    [pwd]
  );

  const isActive = touched || pwd.length > 0;
  const valid =
    stats.len && stats.lower && stats.upper && stats.num && stats.special;

  return (
    <div className="p-4">
      {/* ── helper text ─────────────────────────────────────────────────── */}
      <div className="mb-3 text-sm text-neutral-400">
        Trading password is a password you use to log in to MetaTrader.
      </div>

      {/* ── password input (eye toggle; same UX) ─────────────────────────── */}
      <div className="relative">
        <input
          type={showPwd ? "text" : "password"}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-white outline-none"
          placeholder="e.g. Abc123@"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            if (!touched) setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          autoComplete="new-password"
        />
        <button
          type="button"
          aria-label="Toggle password"
          onClick={() => setShowPwd((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
        >
          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* ── password rules (neutral before interaction) ──────────────────── */}
      <div className="mt-2 space-y-1">
        <Rule ok={isActive ? stats.len : undefined}>
          Between 8–15 characters
        </Rule>
        <Rule ok={isActive ? stats.upper && stats.lower : undefined}>
          At least one upper and one lower case letter
        </Rule>
        <Rule ok={isActive ? stats.num : undefined}>At least one number</Rule>
        <Rule ok={isActive ? stats.special : undefined}>
          At least one special character
        </Rule>
      </div>

      {/* ── note ─────────────────────────────────────────────────────────── */}
      <div className="mt-3 text-xs text-neutral-500">
        Save this password now. For your security, it won’t be sent to your
        email.
      </div>

      {/* ── actions ──────────────────────────────────────────────────────── */}
      <div className="mt-5 flex gap-2">
        <button
          className="flex-1 rounded-xl border border-neutral-800 py-3"
          onClick={onBack}
        >
          Back
        </button>

        <button
          disabled={!valid || isLoading}
          className="flex-1 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 py-3 font-semibold text-neutral-950 disabled:opacity-50"
          onClick={async () => {
            const payload = {
              type: value.type,
              leverage:
                value.leverage === "unlimited" ? 2000 : Number(value.leverage),
              currency: value.currency,
              name: value.nickname,
              mode: value.mode,
              // NOTE: send trading password field if your API expects it, e.g.:
              // tradingPassword: pwd,
            } as any;

            await createAccount(payload).unwrap();
            onClose();
          }}
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>
      </div>
    </div>
  );
}
