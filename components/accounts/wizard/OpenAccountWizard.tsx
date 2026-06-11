/* ──────────────────────────────────────────────────────────────────────────
   OpenAccountWizard — multi-step modal (Plan → Setup → Password)
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useState } from "react";
import PlanCarousel from "./steps/PlanCarousel";
import SetupAccount from "./steps/SetupAccount";
import TradingPassword from "./steps/TradingPassword";

export type WizardState = {
  mode: "real" | "demo";
  type: "standard" | "pro";
  currency: "USD" | "BDT";
  execution: "market" | "instant";
  leverage: number | "unlimited";
  platform: "MT5";
  nickname?: string;
  tradingPassword?: string;
};

export default function OpenAccountWizard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<WizardState>({
    mode: "real",
    type: "standard",
    currency: "USD",
    execution: "market",
    leverage: 500,
    platform: "MT5",
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-950 text-white w-full max-w-lg rounded-2xl border border-neutral-800 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="text-lg font-semibold">
            {step === 1
              ? "Open account"
              : step === 2
              ? "Set up your account"
              : "Trading password"}
          </div>
          <button onClick={onClose} className="opacity-70">
            ✕
          </button>
        </div>

        {/* steps */}
        {step === 1 && (
          <PlanCarousel
            value={state.type}
            onContinue={(type) => {
              setState((s) => ({ ...s, type }));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <SetupAccount
            value={state}
            onChange={(v) => setState(v)}
            onContinue={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <TradingPassword
            value={state}
            onChange={(v) => setState(v)}
            onBack={() => setStep(2)}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
