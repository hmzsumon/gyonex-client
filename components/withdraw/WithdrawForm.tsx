/* ── Component: WithdrawForm ────────────────────────────────────────────── */
"use client";
import React, { useMemo, useState } from "react";

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="mb-1 block text-sm text-white/80">{children}</label>
);
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <h3 className="text-sm font-semibold text-white/90">{children}</h3>;

export default function WithdrawForm({
  min = 100,
  max = 25000,
  available,
  disabled,
  onSubmit,
}: {
  min?: number;
  max?: number;
  available: number;
  disabled?: boolean;
  onSubmit: (amount: number, txPass: string) => void;
}) {
  const [amount, setAmount] = useState<string>("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);

  const n = Number(amount || 0);
  const amountErr = !amount
    ? "Enter amount"
    : n < min || n > max
    ? `Amount must be ${min} ~ ${max}`
    : n > available
    ? "Insufficient balance"
    : "";

  const isValid = useMemo(
    () => !amountErr && pass.length >= 6,
    [amountErr, pass]
  );

  return (
    <div className="mt-6 rounded-xl border border-[#00493B] bg-[#031A15] p-4">
      <SectionTitle>Withdrawal Amount:</SectionTitle>

      <div className="mt-3">
        <FieldLabel>
          Amount{" "}
          <span className="opacity-70">
            {min} ~ {max.toLocaleString()}
          </span>
        </FieldLabel>
        <input
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 7))
          }
          inputMode="numeric"
          placeholder="0"
          className="w-full rounded-lg border border-[#00493B] bg-[#01241D] px-3 py-2 outline-none focus:ring-2 focus:ring-[#1c6b5a]"
        />
        {amountErr && <p className="mt-1 text-xs text-red-400">{amountErr}</p>}
      </div>

      <div className="mt-3">
        <FieldLabel>Transaction Password</FieldLabel>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Transaction Password"
            className="w-full rounded-lg border border-[#00493B] bg-[#01241D] px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#1c6b5a]"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
            aria-label="Toggle password"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-white/80"
            >
              {show ? (
                <path d="M12 4.5C4.73 4.5 1 12 1 12s3.73 7.5 11 7.5S23 12 23 12 19.27 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
              ) : (
                <path d="M12 6c3.86 0 7.16 2.23 8.82 5.5-.46.92-1.08 1.76-1.82 2.5l1.41 1.41C22.09 13.88 23 12 23 12S19.27 4.5 12 4.5c-1.08 0-2.1.14-3.06.41l1.64 1.64C11.08 6.18 11.53 6 12 6zM2.1 2.1L.69 3.51 4.2 7.02C2.69 8.12 1.5 9.46 1 10.5c0 0 3.73 7.5 11 7.5 1.56 0 3.03-.28 4.37-.79l2.62 2.62 1.41-1.41L2.1 2.1z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={!isValid || disabled}
        onClick={() => onSubmit(Number(amount), pass)}
        className="mt-4 w-full rounded-lg bg-white/20 py-3 font-medium text-white transition
                   enabled:bg-emerald-600 enabled:hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
}
