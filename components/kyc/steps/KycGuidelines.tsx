/* ── 06: Dos & Don'ts (visual hint box) ────────────────────── */
"use client";

import { go } from "@/redux/features/kyc/kycSlice";
import { useDispatch } from "react-redux";

export default function KycGuidelines() {
  const d = useDispatch();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">3. Take photo of ID document</h2>

      <div className="rounded-xl border border-emerald-800/40 bg-emerald-900/10 p-4">
        <div className="font-medium text-emerald-400">Do</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-neutral-300 space-y-1">
          <li>Photo is clear and sharp</li>
          <li>Details can be read clearly</li>
          <li>All 4 corners of the document are visible</li>
        </ul>
      </div>

      <div className="rounded-xl border border-red-800/40 bg-red-900/10 p-4">
        <div className="font-medium text-red-400">Don’t</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-neutral-300 space-y-1">
          <li>Photo is blurry / not focused</li>
          <li>Too dark or overexposed</li>
          <li>Not all corners are visible</li>
        </ul>
      </div>

      <button
        onClick={() => d(go("upload"))}
        className="w-full rounded-xl border border-dashed border-neutral-700 bg-neutral-900 px-4 py-12 text-neutral-400"
      >
        Tap to start uploading
      </button>
    </div>
  );
}
