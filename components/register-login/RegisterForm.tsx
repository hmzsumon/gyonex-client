/* ── RegisterForm (auto-fill + lock partnerCode from URL) ──────────────── */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  XCircle,
} from "lucide-react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

/* ── api & ui deps ─────────────────────────────────────────── */
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import { Button, Field, Input } from "./UI";

/* ── schema/types (with name/phone/confirmPassword) ───────── */
import { registerSchema, type RegisterValues } from "./schemas";

/* ── country + phone components (themed) ──────────────────── */
import CountrySelectPro, { iso2FromCountryName } from "./CountrySelectPro";
import PhoneInput from "./PhoneInput";

/* ── helper: read referral code from URL (supports many variants) ───────── */
const getReferralFromParams = (sp: ReadonlyURLSearchParams) => {
  const keys = [
    "referral_code",
    "referralCode",
    "referral",
    "ref",
    "partner_code",
    "partnerCode",
    "code",
  ];

  // ── exact keys first
  for (const k of keys) {
    const v = sp.get(k);
    if (v && v.trim()) return v.trim();
  }

  // ── fuzzy fallback (no for..of; use forEach)
  let found = "";
  sp.forEach((v, k) => {
    if (!found && /ref/i.test(k) && v && v.trim()) {
      found = v.trim();
    }
  });
  return found;
};

/* ── tiny rule badge (tri-state: idle | ok | error) ───────── */
const Rule: React.FC<{ ok?: boolean; children: React.ReactNode }> = ({
  ok,
  children,
}) => {
  const cls =
    ok === undefined
      ? "text-neutral-400"
      : ok
      ? "text-emerald-500"
      : "text-red-500";
  return (
    <div className={`flex items-center gap-2 text-sm ${cls}`}>
      {ok === undefined ? (
        <span className="inline-block h-3 w-3 rounded-full bg-neutral-600" />
      ) : ok ? (
        <CheckCircle2 size={16} />
      ) : (
        <XCircle size={16} />
      )}
      <span>{children}</span>
    </div>
  );
};

/* ── component ─────────────────────────────────────────────── */
const RegisterForm: React.FC<{
  onSuccess?: () => void;
  referralCode?: string; // optional prop; URL takes precedence if present
}> = ({ onSuccess, referralCode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);

  // ── compute referral code from URL (memoized)
  const codeFromUrl = useMemo(
    () => getReferralFromParams(searchParams),
    [searchParams]
  );

  // ── final referral to use (URL > prop > empty)
  const effectiveReferral = codeFromUrl || referralCode || "";
  const lockPartnerCode = Boolean(codeFromUrl); // lock only if came from URL

  // console.debug("RegisterForm: effectiveReferral =", { codeFromUrl, referralCode, effectiveReferral });

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields, submitCount },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      country: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      partnerCode: "",
      notUSTaxPayer: false,
    },
  });

  /* ── write partnerCode into form when available ─────────── */
  useEffect(() => {
    if (effectiveReferral) {
      setValue("partnerCode", effectiveReferral, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [effectiveReferral, setValue]);

  /* ── live stats for password helper ──────────────────────── */
  const pwd = watch("password", "");
  const countryValue = watch("country");
  const isPwdActive =
    !!touchedFields.password || pwd.length > 0 || submitCount > 0;

  const pwdStats = useMemo(
    () => ({
      len: pwd.length >= 8 && pwd.length <= 15,
      lower: /[a-z]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      num: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    }),
    [pwd]
  );

  /* ── submit ──────────────────────────────────────────────── */
  const submit = handleSubmit(async (values) => {
    const tId = toast.loading("Creating account...");
    try {
      await registerUser(values).unwrap();
      toast.success("Account created", { id: tId });
      onSuccess?.();

      // ── redirect to verify page with email ─────────────────
      const email = values.email.trim().toLowerCase();
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (e: any) {
      toast.error(e?.data?.error || "Registration failed", { id: tId });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* ── name ────────────────────────────────────────────── */}
      <Field label="Full name" error={errors.name?.message}>
        <Input
          type="text"
          placeholder="John Doe"
          {...register("name")}
          autoComplete="name"
        />
      </Field>

      {/* ── country (smart combobox: flag + search) ─────────── */}
      <Field
        label="Country / Region of residence"
        error={errors.country?.message}
      >
        <CountrySelectPro
          value={countryValue}
          onChange={(val) => setValue("country", val, { shouldValidate: true })}
          placeholder="Select country"
        />
      </Field>

      {/* ── phone with flag + dial code (linked to country) ─── */}
      <Field
        label="Phone number (with country code)"
        error={errors.phone?.message}
      >
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              country={iso2FromCountryName(countryValue)}
            />
          )}
        />
      </Field>

      {/* ── email ───────────────────────────────────────────── */}
      <Field label="Your email address" error={errors.email?.message}>
        <Input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          autoComplete="email"
        />
      </Field>

      {/* ── password ────────────────────────────────────────── */}
      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Input
            type={showPwd ? "text" : "password"}
            placeholder="e.g. Abc123@"
            {...register("password")}
            className="pr-9"
            autoComplete="new-password"
          />
          <button
            type="button"
            aria-label="Toggle password"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* ── password rules (neutral before interaction) ───── */}
        <div className="mt-2 space-y-1">
          <Rule ok={isPwdActive ? pwdStats.len : undefined}>
            Between 8–15 characters
          </Rule>
          <Rule ok={isPwdActive ? pwdStats.upper && pwdStats.lower : undefined}>
            At least one upper and one lower case letter
          </Rule>
          <Rule ok={isPwdActive ? pwdStats.num : undefined}>
            At least one number
          </Rule>
          <Rule ok={isPwdActive ? pwdStats.special : undefined}>
            At least one special character
          </Rule>
        </div>
      </Field>

      {/* ── confirm password ────────────────────────────────── */}
      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        <div className="relative">
          <Input
            type={showCPwd ? "text" : "password"}
            placeholder="e.g. Abc123@"
            {...register("confirmPassword")}
            className="pr-9"
            autoComplete="new-password"
          />
          <button
            type="button"
            aria-label="Toggle confirm password"
            onClick={() => setShowCPwd((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
          >
            {showCPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      {/* ── partner code (auto-filled + readOnly when URL has code) ────────── */}
      <details className="rounded-lg border border-neutral-800 p-3 open:bg-neutral-900/40">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-200">
          <span>
            {lockPartnerCode
              ? "Partner code (auto-filled from link)"
              : "Partner code (optional)"}
          </span>
          {lockPartnerCode ? (
            <Lock size={16} className="text-neutral-400" />
          ) : (
            <ChevronDown size={16} />
          )}
        </summary>

        <div className="pt-3">
          <Input
            placeholder="Enter partner code"
            {...register("partnerCode")}
            readOnly={lockPartnerCode} /* ── lock editing ── */
            className={
              lockPartnerCode ? "cursor-not-allowed opacity-90" : undefined
            }
            title={
              lockPartnerCode ? "Pre-filled from referral link" : undefined
            }
          />
          {lockPartnerCode ? (
            <p className="mt-1 text-xs text-neutral-400">
              This code was pre-filled from your referral link.
            </p>
          ) : null}
        </div>
      </details>

      {/* ── declaration ─────────────────────────────────────── */}
      <label className="flex items-start gap-3 text-sm text-neutral-300">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border border-neutral-700 bg-neutral-900"
          {...register("notUSTaxPayer")}
        />
        <span>
          I declare and confirm that I am not a citizen or resident of the US
          for tax purposes.
        </span>
      </label>
      {errors.notUSTaxPayer?.message ? (
        <p className="-mt-2 text-sm text-red-500">
          {errors.notUSTaxPayer.message}
        </p>
      ) : null}

      {/* ── submit ──────────────────────────────────────────── */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
