// app/(auth)/settings/profile/page.tsx
"use client";

/* ─────────────────────────────────────────────────────────────
  page: profile + verification status
  - real backend driven progress
  - pending kyc => under review state
─────────────────────────────────────────────────────────────── */
import AccountSummary from "@/components/profile/AccountSummary";
import AddProfileForm from "@/components/profile/AddProfileForm";
import VerificationSteps from "@/components/profile/VerificationSteps";
import VerifyEmailCard from "@/components/profile/VerifyEmailCard";
import { useGetMyKycQuery } from "@/redux/features/auth/authApi";
import { go } from "@/redux/features/kyc/kycSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function ProfilePage() {
  const d = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state: any) => state.auth);
  const { data } = useGetMyKycQuery();

  const kyc = data?.kyc;

  const emailVerified = !!user?.email_verified;

  const basicInfoDone = Boolean(
    kyc?.first_name &&
    kyc?.last_name &&
    kyc?.date_of_birth &&
    kyc?.country_of_birth &&
    kyc?.gender &&
    kyc?.residential_address,
  );

  const kycRequested = !!user?.kyc_request || kyc?.status === "pending";
  const kycVerified = !!user?.kyc_verified || kyc?.status === "approved";
  const kycUnderReview =
    (!kycVerified && !!user?.kyc_request) || kyc?.status === "pending";

  const step1Done = emailVerified && basicInfoDone;
  const step2Done = kycRequested || kycVerified;
  const step3Done = kycVerified;

  const completed = [step1Done, step2Done, step3Done].filter(Boolean).length;

  const startKyc = () => {
    if (!step1Done) return;
    if (kycUnderReview || kycVerified) return;

    d(go("start"));
    router.push("/kyc");
  };

  return (
    <div className="mx-auto max-w-3xl px-3 py-4 md:px-6 md:py-6">
      <AccountSummary
        status={
          kycVerified
            ? "verified"
            : kycUnderReview
              ? "under_review"
              : "not_verified"
        }
        completed={completed}
        total={3}
        depositLimitUSD={kycVerified ? Infinity : step1Done ? 10000 : 0}
      />

      <VerificationSteps
        sections={[
          {
            id: "step1",
            title: "Confirm email and phone number. Add personal details",
            openByDefault: !step1Done,
            content: (
              <div className="space-y-4">
                {!emailVerified && <VerifyEmailCard onSuccess={() => {}} />}
                {!basicInfoDone && <AddProfileForm onSuccess={() => {}} />}
              </div>
            ),
            done: step1Done,
          },
          {
            id: "step2",
            title: "Provide a document confirming your name",
            openByDefault: step1Done && !step2Done,
            content: (
              <div className="space-y-3 text-neutral-300">
                <p className="text-sm">
                  Upload a valid government-issued document to continue
                  verification.
                </p>

                <button
                  onClick={startKyc}
                  disabled={!step1Done || kycVerified || kycUnderReview}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {kycVerified
                    ? "KYC completed"
                    : kycUnderReview
                      ? "Under review"
                      : kycRequested
                        ? "Continue KYC"
                        : "Complete now"}
                </button>

                {kycUnderReview && (
                  <div className="rounded-xl border border-yellow-800/40 bg-yellow-500/10 p-3 text-sm text-yellow-300">
                    Your documents have been submitted successfully and are now
                    under review.
                  </div>
                )}
              </div>
            ),
            done: step2Done,
          },
          {
            id: "step3",
            title: "Provide proof of your place of residence",
            openByDefault: step2Done && !step3Done,
            content: (
              <div className="space-y-4">
                <button
                  disabled
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-500"
                >
                  {step3Done ? "Completed" : "Available after review"}
                </button>
              </div>
            ),
            done: step3Done,
          },
        ]}
      />
    </div>
  );
}
