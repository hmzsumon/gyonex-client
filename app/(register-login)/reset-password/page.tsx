// app/reset-password/page.tsx
"use client";

import { useResetForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormVals = { password: string; confirm: string };

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const email = (params.get("email") || "").trim().toLowerCase();
  const router = useRouter();

  const [resetForgotPassword, { isLoading }] = useResetForgotPasswordMutation();
  const [show, setShow] = useState({ p: false, c: false });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormVals>();

  const pwd = watch("password");

  const submit = handleSubmit(async ({ password, confirm }) => {
    if (password !== confirm) {
      setError("confirm", { message: "Passwords do not match" });
      return;
    }
    const tId = toast.loading("Updating password...");
    try {
      await resetForgotPassword({ email, newPassword: password }).unwrap();
      toast.success("Password updated", { id: tId });
      router.push("/register-login");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to reset password", { id: tId });
    }
  });

  return (
    <div className="mx-auto max-w-md px-3 py-6">
      <h1 className="mb-1 text-2xl font-bold text-white">
        Create new password
      </h1>
      <p className="mb-4 text-sm text-neutral-400">
        For:{" "}
        <span className="font-medium text-neutral-200">{email || "—"}</span>
      </p>

      <form onSubmit={submit} className="space-y-4">
        {/* new password */}
        <label className="block text-sm">
          <span className="text-neutral-400">New password</span>
          <div className="relative">
            <Shield
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              size={16}
            />
            <input
              type={show.p ? "text" : "password"}
              {...register("password", {
                required: "Required",
                minLength: { value: 8, message: "Min 8 chars" },
              })}
              className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-9 py-2 pr-10 outline-none focus:ring-2 focus:ring-emerald-600/40"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, p: !s.p }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
            >
              {show.p ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          ) : null}
        </label>

        {/* confirm */}
        <label className="block text-sm">
          <span className="text-neutral-400">Confirm new password</span>
          <div className="relative">
            <Shield
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              size={16}
            />
            <input
              type={show.c ? "text" : "password"}
              {...register("confirm", {
                required: "Required",
                validate: (v) => v === pwd || "Passwords do not match",
              })}
              className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-9 py-2 pr-10 outline-none focus:ring-2 focus:ring-emerald-600/40"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, c: !s.c }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
            >
              {show.c ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirm ? (
            <span className="text-xs text-red-500">
              {errors.confirm.message}
            </span>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {isLoading ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
