/* ─────────────────────────────────────────────────────────────
  KYC FLOW ORCHESTRATOR
  - Single place that switches screen based on redux step
  - Header + progress ring + close/back actions
─────────────────────────────────────────────────────────────── */
"use client";

import { go, resetKyc } from "@/redux/features/kyc/kycSlice";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import KycAgreement from "./steps/KycAgreement";
import KycEditName from "./steps/KycEditName";
import KycGuidelines from "./steps/KycGuidelines";
import KycIdentity from "./steps/KycIdentity";
import KycStart from "./steps/KycStart";
import KycUnderReview from "./steps/KycUnderReview";
import KycUpload from "./steps/KycUpload";

export default function KycFlow() {
  const router = useRouter();
  const dispatch = useDispatch();
  const step = useSelector((s: any) => s.kyc.step);

  console.log("KYC screens typeof:", {
    KycStart: typeof KycStart,
    KycEditName: typeof KycEditName,
    KycAgreement: typeof KycAgreement,
    KycIdentity: typeof KycIdentity,
    KycGuidelines: typeof KycGuidelines,
    KycUpload: typeof KycUpload,
    KycUnderReview: typeof KycUnderReview,
  });

  // ── calc progress (fake 5 ticks like in screenshots) ─────────
  const order: Record<string, number> = {
    entry: 0,
    start: 1,
    editName: 2,
    agreement: 3,
    identity: 4,
    guidelines: 5,
    upload: 5,
    underReview: 5,
  };
  const ticks = `${Math.min(order[step] ?? 0, 5)}/5`;

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-neutral-100">
      {/* ── sticky header ─────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-2 py-3 bg-neutral-950/90 backdrop-blur">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-neutral-300 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="text-right">
          <div className="text-xs text-neutral-400">
            Complete the registration process
          </div>
          <div className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-2 py-0.5 text-xs">
            {ticks}
          </div>
        </div>
      </div>

      {/* ── screen switcher ───────────────────────────────────── */}
      <div className="mx-auto w-full max-w-md  pb-10">
        {step === "start" && <KycStart />}
        {step === "editName" && <KycEditName />}
        {step === "agreement" && <KycAgreement />}
        {step === "identity" && <KycIdentity />}
        {step === "guidelines" && <KycGuidelines />}
        {step === "upload" && <KycUpload />}
        {step === "underReview" && <KycUnderReview />}
        {/* entry স্ক্রিন থেকে কল করলে just go('start') করবে */}
        {step === "entry" && (
          <div className="py-10">
            <button
              onClick={() => dispatch(go("start"))}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500"
            >
              Start KYC
            </button>
            <button
              onClick={() => dispatch(resetKyc())}
              className="mt-3 w-full rounded-xl border border-neutral-800 px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-900"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
