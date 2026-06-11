/* ── 05: Verify identity (issuing country + doc type) ──────── */
"use client";

import {
  DocType,
  go,
  setDocType,
  setIssuingCountry,
} from "@/redux/features/kyc/kycSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const DOCS: { key: DocType; label: string }[] = [
  { key: "passport", label: "Passport - Recommended" },
  { key: "driver", label: "Driver's license" },
  { key: "id", label: "ID card - Recommended" },
  { key: "residence", label: "Residence permit" },
  { key: "oldid", label: "Old ID card" },
];

export default function KycIdentity() {
  const d = useDispatch();
  const { issuingCountry, docType } = useSelector((s: RootState) => s.kyc);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Verify identity</h1>

      <div>
        <div className="text-sm font-medium">1. Issuing country / region</div>
        <div className="mt-2 flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2">
          <span>{issuingCountry}</span>
          <button
            onClick={() => d(setIssuingCountry("Bangladesh"))}
            className="text-xs text-neutral-400"
            title="(Mock) tap to keep Bangladesh"
          >
            Change
          </button>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium">
          2. Select your identity document
        </div>
        <div className="mt-2 space-y-2">
          {DOCS.map((x) => (
            <label
              key={x.key}
              className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2"
            >
              <input
                type="radio"
                name="doctype"
                checked={docType === x.key}
                onChange={() => d(setDocType(x.key))}
              />
              <span>{x.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => d(go("guidelines"))}
        className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-neutral-900"
      >
        Next
      </button>
    </div>
  );
}
