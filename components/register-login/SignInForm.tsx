"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import Link from "next/link";
import { Button, Field, Input } from "./UI";
import { signInSchema, type SignInValues } from "./schemas";

const SignInForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginUserMutation();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const submit = handleSubmit(async (values) => {
    const tId = toast.loading("Signing in...");
    try {
      const res = await login(values).unwrap();
      toast.success("Signed in", { id: tId });
      onSuccess?.();
      router.push("/dashboard");
    } catch (e: any) {
      console.log(e);
      if (e?.status === 420) {
        // ── redirect to verify page with email ─────────────────
        const email = values.email.trim().toLowerCase();
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
      toast.error(e?.data?.error || "Unable to sign in", { id: tId });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Your email address" error={errors.email?.message}>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="pl-9"
          />
        </div>
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <Input
            type={show ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="pl-9 pr-9"
          />
          <button
            type="button"
            aria-label="Toggle password"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-200"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {/* ────────── Forgot password ────────── */}
        <Link href="/forgot-password" className="flex items-center justify-end">
          <button
            type="button"
            className="text-xs font-medium text-neutral-400 hover:text-neutral-200"
          >
            Forgot password?
          </button>
        </Link>
      </Field>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Loading..." : "Continue"}
      </Button>
    </form>
  );
};

export default SignInForm;
