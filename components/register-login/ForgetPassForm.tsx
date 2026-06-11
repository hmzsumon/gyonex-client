// components/auth/ForgotPasswordForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import {
  useSendResetCodeMutation,
  useVerifyResetCodeMutation,
} from "@/redux/features/auth/authApi";
import { Button, Field, Input } from "./UI";

// ── schema ────────────────────────────────────────────────────
export const verifyEmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z
    .string()
    .min(4, "Code must be at least 4 characters")
    .max(8, "Code must be at most 8 characters"),
});
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

// ── component ─────────────────────────────────────────────────
const ForgotPasswordForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const presetEmail = params.get("email") || "";

  const [sendResetCode, { isLoading: sending }] = useSendResetCodeMutation();
  const [verifyResetCode, { isLoading: verifying }] =
    useVerifyResetCodeMutation();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onTouched",
    defaultValues: { email: presetEmail, code: "" },
  });

  const emailVal = watch("email");
  const codeVal = watch("code");
  const disabledGet = useMemo(
    () => !emailVal || !!errors.email,
    [emailVal, errors.email]
  );

  /* ── Get Code ───────────────────────────────────────────── */
  const getCode = async () => {
    if (disabledGet) return;
    const tId = toast.loading("Sending code...");
    try {
      const res = await sendResetCode({
        email: emailVal.trim().toLowerCase(),
      }).unwrap();
      toast.success(res?.message || "Code sent to your email", { id: tId });
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to send code", { id: tId });
    }
  };

  /* ── Verify Code ────────────────────────────────────────── */
  const submit = handleSubmit(async ({ email, code }) => {
    const tId = toast.loading("Verifying code...");
    try {
      const res = await verifyResetCode({
        email: email.trim().toLowerCase(),
        otp: code,
      }).unwrap();
      toast.success(res?.message || "Code verified", { id: tId });
      onSuccess?.();
      // go to reset password with email
      router.push(
        `/reset-password?email=${encodeURIComponent(
          email.trim().toLowerCase()
        )}`
      );
    } catch (e: any) {
      toast.error(e?.data?.message || "Verification failed", { id: tId });
      setError("code", { message: e?.data?.message || "Invalid code" });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* ── email field + get code ──────────────────────────── */}
      <Field label="Email address" error={errors.email?.message}>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className="pl-9 pr-28"
          />
          <button
            type="button"
            onClick={getCode}
            disabled={disabledGet || sending}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            title="Send code to email"
          >
            {sending ? "Sending…" : "Get code"}
          </button>
        </div>
      </Field>

      {/* ── verification code field ──────────────────────────── */}
      <Field label="Verification code" error={errors.code?.message}>
        <div className="relative">
          <ShieldCheck
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            {...register("code")}
            className="pl-9 tracking-widest"
          />
        </div>
      </Field>

      {/* ── submit ───────────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={verifying || !emailVal || !codeVal}
        className="w-full"
      >
        {verifying ? "Verifying..." : "Verify & Continue"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
