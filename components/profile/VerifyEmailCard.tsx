// components/profile/VerifyEmailCard.tsx
"use client";

/* ─────────────────────────────────────────────────────────────
  step: verify email card
  - real resend verification mutation use করে
  - already verified হলে smart state দেখায়
─────────────────────────────────────────────────────────────── */
import { useResendVerificationEmailMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function VerifyEmailCard({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { user } = useSelector((state: any) => state.auth);
  const [resendVerificationEmail, { isLoading }] =
    useResendVerificationEmailMutation();

  const alreadyVerified = !!user?.email_verified;

  const sendCode = async () => {
    if (alreadyVerified) {
      toast.success("Your email is already verified");
      onSuccess();
      return;
    }

    if (!user?.email) {
      toast.error("Email not found for this account");
      return;
    }

    try {
      await resendVerificationEmail({ email: user.email }).unwrap();
      toast.success("Verification code sent to your email");
    } catch (e: any) {
      toast.error(
        e?.data?.message ||
          e?.data?.error ||
          e?.message ||
          "Failed to send verification code",
      );
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="mb-4">
        <div className="text-2xl font-extrabold text-white">Verify email</div>
        <p className="mt-1 text-sm text-neutral-400">
          {alreadyVerified
            ? "Your email is already verified."
            : "We will send the verification code to your email address."}
        </p>
      </div>

      <button
        type="button"
        onClick={sendCode}
        disabled={isLoading || alreadyVerified}
        className="w-full rounded-xl bg-yellow-400 px-4 py-3 text-center text-base font-semibold text-neutral-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {alreadyVerified
          ? "Email verified"
          : isLoading
            ? "Sending code..."
            : "Send me a code"}
      </button>

      <p className="mt-3 text-xs text-neutral-500">
        All data is encrypted for security
      </p>
    </div>
  );
}
