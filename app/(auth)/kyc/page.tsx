// app/dashboard/settings/kyc/page.tsx
"use client";

/* ── page: dedicated KYC screen (full flow) ────────────────── */
import KycFlow from "@/components/kyc/KycFlow";
import { go } from "@/redux/features/kyc/kycSlice";
import type { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function KycPage() {
  const d = useDispatch();
  const step = useSelector((s: RootState) => s.kyc.step);

  /* ── direct land করলে যেন start স্টেপ দেখা যায় ─────────── */
  useEffect(() => {
    if (step === "entry") d(go("start"));
  }, [step, d]);

  return <KycFlow />;
}
