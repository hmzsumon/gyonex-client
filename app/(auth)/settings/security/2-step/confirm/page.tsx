"use client";

import { useState } from "react";

/* ── six box OTP input ────────────────────────────────────── */
export default function TwoStepConfirmPage() {
  const [otp, setOtp] = useState("");

  const onBox = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(0, 1);
    const arr = otp.split("");
    arr[i] = digit;
    const next = arr.join("").slice(0, 6);
    setOtp(next);

    if (digit) {
      const el = document.getElementById(
        `otp-${i + 1}`
      ) as HTMLInputElement | null;
      el?.focus();
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 pb-8 pt-4">
      <div className="px-4">
        <button className="mb-4 text-sm text-neutral-300">← Back</button>
        <h1 className="text-2xl font-bold text-neutral-100">
          Confirm the change 2-Step verification
        </h1>
        <p className="mt-3 text-neutral-300">
          Enter the code we sent to:{" "}
          <span className="font-medium">z****m@gmail.com</span>
        </p>
      </div>

      <div className="flex justify-between gap-2 px-4">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            maxLength={1}
            inputMode="numeric"
            className="h-14 w-12 rounded-lg border border-neutral-800 bg-neutral-900/60 text-center text-2xl font-semibold text-neutral-100 outline-none focus:ring-2 focus:ring-emerald-600/40"
            onChange={(e) => onBox(i, e.target.value)}
          />
        ))}
      </div>

      <div className="px-4 text-emerald-400 underline">Get a new code</div>
      <div className="px-4 text-emerald-400 underline">
        I didn't receive a code
      </div>
    </div>
  );
}
