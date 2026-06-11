"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Info, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import {
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
} from "@/redux/features/auth/authApi";
import { Button, Field } from "./UI";

/* ── schema (code only) ───────────────────────────────────── */
const schema = z.object({
  code: z
    .string()
    .min(4, "Code must be at least 4 chars")
    .max(8, "Max 8 chars"),
});
type Values = z.infer<typeof schema>;

/* ── helper: read email from query ─────────────────────────── */
function useEmailFromQuery() {
  const qp = useSearchParams();
  const raw = qp.get("email") ?? qp.get("eamil") ?? "";
  return useMemo(() => {
    try {
      const dec = decodeURIComponent(raw);
      const trimmed = dec
        .replace(/^"+|"+$/g, "")
        .trim()
        .toLowerCase();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      return ok ? trimmed : "";
    } catch {
      return "";
    }
  }, [raw]);
}

/* ── helper: mask email like z****m@gmail.com ─────────────── */
function maskEmail(email: string) {
  const [name, domain] = (email || "").split("@");
  if (!domain) return email;
  if (name.length <= 2) return `${name[0] ?? ""}****@${domain}`;
  return `${name[0]}****${name.slice(-1)}@${domain}`;
}

const VerifyEmailForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const router = useRouter();
  const email = useEmailFromQuery();

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendEmail, { isLoading: isResending }] =
    useResendVerificationEmailMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    // ✅ সাবমিটের আগে error না দেখাতে চাইলে onSubmit রাখাই ভাল
    mode: "onSubmit",
    defaultValues: { code: "" },
  });

  /* ── OTP boxes state ────────────────────────────────────── */
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const boxesRef = useRef<Array<HTMLInputElement | null>>([]);
  const code = digits.join("");
  const canSubmit = /^\d{6}$/.test(code) && !!email;
  const [cooldown, setCooldown] = useState(0);

  // RHF 'code' sync (⚠️ validation only when user typed something)
  useEffect(() => {
    setValue("code", code, { shouldValidate: code.length > 0 || isSubmitted });
  }, [code, setValue, isSubmitted]);

  // autofocus first box
  useEffect(() => {
    if (email) boxesRef.current[0]?.focus();
  }, [email]);

  // cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  /* ── box handlers ───────────────────────────────────────── */
  const handleBoxChange = (idx: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < 5) boxesRef.current[idx + 1]?.focus();
  };

  const handleBoxKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = "";
        setDigits(next);
      } else if (idx > 0) {
        boxesRef.current[idx - 1]?.focus();
        const next = [...digits];
        next[idx - 1] = "";
        setDigits(next);
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) boxesRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) boxesRef.current[idx + 1]?.focus();
    if (e.key === "Enter" && canSubmit) submit();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const arr = pasted.split("");
    const next = ["", "", "", "", "", ""].map((_, i) => arr[i] ?? "");
    setDigits(next);
    setTimeout(() => {
      const lastIndex = Math.min(pasted.length, 6) - 1;
      boxesRef.current[lastIndex]?.focus();
    }, 0);
  };

  /* ── submit ─────────────────────────────────────────────── */
  const submit = handleSubmit(async ({ code }) => {
    const tId = toast.loading("Verifying email...");
    try {
      if (!email) throw new Error("Missing email in URL");
      const res = await verifyEmail({ email, code }).unwrap();
      toast.success(res?.message || "Email verified", { id: tId });
      onSuccess?.();
      router.push("/register-login");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Verification failed", {
        id: tId,
      });
    }
  });

  /* ── resend ─────────────────────────────────────────────── */
  const resend = async () => {
    if (!email) return toast.error("Email missing");
    try {
      await resendEmail({ email }).unwrap();
      toast.success("Verification code sent");
      setCooldown(30);
      setDigits(["", "", "", "", "", ""]);
      boxesRef.current[0]?.focus();
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to resend");
    }
  };

  /* ── styles ─────────────────────────────────────────────── */
  const boxBase =
    "h-10 w-10 rounded-md bg-neutral-900 text-center text-lg font-semibold text-neutral-100 outline-none transition";
  const boxOk =
    "border border-neutral-700 focus:ring-2 focus:ring-emerald-600/40";
  const boxErr = "border border-red-500 focus:ring-2 focus:ring-red-500/60";
  // ❗ শুধু টাইপ করা শুরু করলে/সাবমিটের পরেই error দেখাবে
  const hasCodeError =
    !!errors.code?.message && (code.length > 0 || isSubmitted);

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* email preview */}
      <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2">
        <Mail size={16} className="text-neutral-400" />
        <span className="text-sm">
          {email ? email : "No email found in URL"}
        </span>
      </div>

      {/* note */}
      {email && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-700/40 bg-emerald-500/10 px-2 py-2 text-sm text-emerald-300">
          <Info size={16} className="mt-0.5 opacity-90" />
          <p className="text-xs">
            We’ve sent a verification code to{" "}
            <span className="font-medium">{maskEmail(email)}</span>. Please
            check your inbox (and spam folder) and enter the code below.
          </p>
        </div>
      )}

      {/* centered OTP section */}
      <Field
        label="Verification code"
        error={hasCodeError ? errors.code?.message : undefined}
      >
        <div className="mx-auto max-w-[520px] text-center">
          <div className="mb-2 inline-flex items-center gap-2 text-[13px] text-neutral-400">
            <AtSign size={14} />{" "}
            <span>
              Enter the code we sent to:{" "}
              <span className="ml-1 font-medium text-neutral-200">
                {maskEmail(email)}
              </span>
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  boxesRef.current[i] = el;
                }}
                value={digits[i]}
                onChange={(e) => handleBoxChange(i, e.target.value)}
                onKeyDown={(e) => handleBoxKeyDown(i, e)}
                onPaste={handlePaste}
                inputMode="numeric"
                maxLength={1}
                className={`${boxBase} ${hasCodeError ? boxErr : boxOk}`}
              />
            ))}
          </div>

          {/* resend */}
          <button
            type="button"
            onClick={resend}
            disabled={isResending || cooldown > 0}
            className="mt-3 inline-block text-sm font-medium text-yellow-400 underline decoration-yellow-400/60 underline-offset-2 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cooldown > 0 ? `Get a new code in ${cooldown}s` : "Get a new code"}
          </button>

          {/* error text (centered) */}
          {hasCodeError && (
            <div className="mt-2 text-center text-xs font-semibold text-red-500">
              {errors.code?.message}
            </div>
          )}
        </div>
      </Field>

      {/* hidden email (submits with form) */}
      <input type="hidden" name="email" value={email} />

      {/* submit */}
      <Button
        type="submit"
        disabled={isLoading || !canSubmit}
        className="w-full"
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </Button>

      {!email && (
        <p className="text-xs text-amber-400">
          Add ?email=you@example.com to the URL (or ?eamil=...) to verify.
        </p>
      )}
    </form>
  );
};

export default VerifyEmailForm;
