/* ── 04: Data use agreement ────────────────────────────────── */
"use client";

import { go, setAgree } from "@/redux/features/kyc/kycSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function KycAgreement() {
  const d = useDispatch();
  const agreed = useSelector((s: RootState) => s.kyc.agreeDataUse);
  const [ok, setOk] = useState(agreed);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Data use agreement</h1>
      <p className="text-neutral-400">
        To continue, we need your consent to process your personal data,
        including biometrics.
      </p>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={ok}
          onChange={(e) => setOk(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900"
        />
        <span className="text-neutral-300">
          I confirm that I have read the Privacy Notice and give my consent to
          the processing of my personal data, including biometrics.
        </span>
      </label>

      <button
        disabled={!ok}
        onClick={() => {
          d(setAgree(true));
          d(go("identity"));
        }}
        className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-neutral-900 disabled:opacity-50"
      >
        Submit document
      </button>
    </div>
  );
}
