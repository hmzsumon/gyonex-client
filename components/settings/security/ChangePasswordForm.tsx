// components/settings/security/ChangePasswordForm.tsx
"use client";

import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const getApiError = (e: any) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.error ||
  e?.message ||
  "Something went wrong";

type FormVals = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordForm({ onDone }: { onDone: () => void }) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [show, setShow] = useState({ old: false, next: false, confirm: false });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormVals>();

  const newPwd = watch("newPassword");

  const submit = handleSubmit(
    async ({ oldPassword, newPassword, confirmPassword }) => {
      clearErrors("root");
      if (newPassword !== confirmPassword) {
        setError("confirmPassword", { message: "Passwords do not match" });
        return;
      }
      if (
        newPassword.length < 8 ||
        newPassword.length > 15 ||
        !/[a-z]/.test(newPassword) ||
        !/[A-Z]/.test(newPassword) ||
        !/\d/.test(newPassword) ||
        !/[^A-Za-z0-9]/.test(newPassword)
      ) {
        setError("newPassword", {
          message: "8–15 chars incl. upper, lower, number & special",
        });
        return;
      }

      try {
        await changePassword({ oldPassword, newPassword }).unwrap();
        toast.success("Password changed successfully");
        onDone();
      } catch (err) {
        setError("root", { message: getApiError(err) });
      }
    }
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      {"root" in errors && (errors as any).root?.message ? (
        <div className="rounded-lg border border-red-800/50 bg-red-900/10 px-3 py-2 text-sm text-red-300">
          {(errors as any).root.message}
        </div>
      ) : null}

      {/* old password */}
      <label className="block text-sm">
        <span className="text-neutral-400">Current password</span>
        <div className="relative">
          <input
            type={show.old ? "text" : "password"}
            {...register("oldPassword", {
              required: "Current password is required",
            })}
            className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-emerald-600/40"
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, old: !s.old }))}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
          >
            {show.old ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.oldPassword ? (
          <span className="text-xs text-red-500">
            {errors.oldPassword.message}
          </span>
        ) : null}
      </label>

      {/* new password */}
      <label className="block text-sm">
        <span className="text-neutral-400">New password</span>
        <div className="relative">
          <input
            type={show.next ? "text" : "password"}
            {...register("newPassword", {
              required: "New password is required",
            })}
            className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-emerald-600/40"
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
          >
            {show.next ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.newPassword ? (
          <span className="text-xs text-red-500">
            {errors.newPassword.message}
          </span>
        ) : (
          <p className="mt-1 text-xs text-neutral-500">
            8–15 chars with upper, lower, number & special
          </p>
        )}
      </label>

      {/* confirm */}
      <label className="block text-sm">
        <span className="text-neutral-400">Confirm new password</span>
        <div className="relative">
          <input
            type={show.confirm ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (val) => val === newPwd || "Passwords do not match",
            })}
            className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-emerald-600/40"
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
          >
            {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <span className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {isLoading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
