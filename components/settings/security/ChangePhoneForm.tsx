// components/settings/security/ChangePhoneForm.tsx
"use client";

import { useChangePhoneMutation } from "@/redux/features/auth/authApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const getApiError = (e: any) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.error ||
  e?.message ||
  "Something went wrong";

export default function ChangePhoneForm({ onDone }: { onDone: () => void }) {
  const [changePhone, { isLoading }] = useChangePhoneMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<{ phone: string }>();

  const submit = handleSubmit(async ({ phone }) => {
    clearErrors("root");
    try {
      const cleaned = phone.replace(/[^\d+]/g, "");
      await changePhone({ phone: cleaned }).unwrap();
      toast.success("Phone updated successfully");
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
        <span className="text-neutral-400">New phone</span>
        <input
          type="tel"
          placeholder="+8801XXXXXXX"
          {...register("phone", {
            required: "Phone is required",
            minLength: { value: 7, message: "Too short" },
          })}
          className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/40"
        />
        {errors.phone ? (
          <span className="text-xs text-red-500">{errors.phone.message}</span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {isLoading ? "Saving…" : "Save phone"}
      </button>

      <p className="text-xs text-neutral-500">
        We may send an OTP to verify your new number.
      </p>
    </form>
  );
}
