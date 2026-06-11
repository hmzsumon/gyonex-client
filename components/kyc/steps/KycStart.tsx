/* ── 02: Document verification (intro + name preview + CTA) ── */
"use client";

import { go } from "@/redux/features/kyc/kycSlice";
import { useDispatch, useSelector } from "react-redux";

export default function KycStart() {
  const d = useDispatch();
  const { residenceCountry, firstName, lastName } = useSelector(
    (s: any) => s.kyc
  );

  const { user } = useSelector((s: any) => s.auth);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Document verification</h1>
        <p className="mt-2 text-neutral-400">
          On the next screen we’ll ask you to upload one or two documents to
          confirm your name and country/region of residence. Your current place
          of residence is
        </p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-sm">
          <span className="text-xl">🇧🇩</span>
          <span>{residenceCountry}</span>
        </div>
      </div>

      <div>
        <div className="text-sm text-neutral-400">Check your name:</div>
        <div className="mt-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2">
          {user?.name}
        </div>
        <button
          onClick={() => d(go("editName"))}
          className="mt-2 text-emerald-400 hover:text-emerald-300"
        >
          Edit
        </button>
      </div>

      <button
        onClick={() => d(go("agreement"))}
        className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-neutral-900 hover:bg-yellow-300"
      >
        Upload documents
      </button>
    </div>
  );
}
