/* ================================================
   FILE: app/components/OpenAccountWizard.tsx
   DESC: 2-step wizard → (1) Select Plan → (2) Confirm & Create
================================================= */
"use client";

import {
  IAiPlan,
  useGetAiPlansQuery,
} from "@/redux/features/ai-account/ai-accountApi";
import { useMemo, useState } from "react";
import ConfirmAccount from "./steps/ConfirmAccount";
import PlanCarousel from "./steps/PlanCarousel";

export type WizardState = {
  mode: "ai";
  type: string;
  currency: "USD" | "BDT";
  nickname?: string;
  amount: number;
};

export default function OpenAccountWizard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading } = useGetAiPlansQuery(undefined, {
    skip: !open,
  });

  const plans = useMemo<IAiPlan[]>(() => data?.items ?? [], [data?.items]);

  const [step, setStep] = useState<1 | 2>(1);
  const [state, setState] = useState<WizardState>({
    mode: "ai",
    type: "",
    currency: "USD",
    amount: 0,
  });

  if (!open) return null;

  const handleClose = () => {
    setStep(1);
    setState({
      mode: "ai",
      type: plans[0]?.key ?? "",
      currency: "USD",
      amount: plans[0]?.amount ?? 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-950 text-white w-full max-w-lg rounded-2xl border border-neutral-800 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="text-lg font-semibold">
            {step === 1 ? "Open account" : "Confirm details"}
          </div>
          <button onClick={handleClose} className="opacity-70">
            ✕
          </button>
        </div>

        {/* loading */}
        {isLoading && (
          <div className="p-6 text-center text-sm text-neutral-400">
            Loading plans...
          </div>
        )}

        {/* empty */}
        {!isLoading && plans.length === 0 && (
          <div className="p-6 text-center text-sm text-red-400">
            No Smart Trade plans found
          </div>
        )}

        {/* steps */}
        {!isLoading && plans.length > 0 && step === 1 && (
          <PlanCarousel
            value={state.type || plans[0].key}
            cards={plans}
            onContinue={(selectedPlan) => {
              setState((prev) => ({
                ...prev,
                type: selectedPlan.key,
                amount: selectedPlan.amount,
              }));
              setStep(2);
            }}
          />
        )}

        {!isLoading && plans.length > 0 && step === 2 && (
          <ConfirmAccount
            state={state}
            plans={plans}
            onBack={() => setStep(1)}
            onConfirm={() => handleClose()}
          />
        )}
      </div>
    </div>
  );
}
