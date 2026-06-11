// components/settings/security/ChangeEmailForm.tsx
"use client";

import { useChangeEmailMutation } from "@/redux/features/auth/authApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const getApiError = (e: any) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.error ||
  e?.message ||
  "Something went wrong";

export default function ChangeEmailForm({ onDone }: { onDone: () => void }) {
  const [changeEmail, { isLoading }] = useChangeEmailMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<{ email: string }>();

  const submit = handleSubmit(async ({ email }) => {
    clearErrors("root");
    try {
      await changeEmail({ email }).unwrap();
      toast.success("Email updated successfully");
      onDone();
    } catch (err) {
      setError("root", { message: getApiError(err) });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-3">
      {"root" in errors && (errors as any).root?.message ? (
        <div className="rounded-lg border border-red-800/50 bg-red-900/10 px-3 py-2 text-sm text-red-300">
          {(errors as any).root.message}
        </div>
      ) : null}

      <label className="block text-sm">
        <span className="text-neutral-400">New email address</span>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
          className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/40"
        />
        {errors.email ? (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {isLoading ? "Saving…" : "Save email"}
      </button>

      <p className="text-xs text-neutral-500">
        We’ll send a verification link to your new email.
      </p>
    </form>
  );
}
