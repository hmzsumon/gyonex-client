// components/profile/VerifyPhoneCard.tsx
"use client";

/* ── step: verify phone (OTP 6 boxes + resend timer) ──────── */
import { useEffect, useState } from "react";

export default function VerifyPhoneCard({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState<string>("");
  const [sec, setSec] = useState(60);

  useEffect(() => {
    if (sec <= 0) return;
    const t = setTimeout(() => setSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec]);

  const onChangeBox = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const arr = otp.split("");
    arr[i] = v;
    setOtp(arr.join("").slice(0, 6));
    const next = document.getElementById(
      `otp-${i + 1}`
    ) as HTMLInputElement | null;
    if (v && next) next.focus();
  };

  const verify = async () => {
    if (otp.length === 6) onSuccess(); // TODO: call API then success
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="text-2xl font-extrabold text-white">
        Confirm phone number
      </div>
      <p className="mt-1 text-sm text-neutral-400">
        Enter the 6-digit code we sent.
      </p>

      <div className="mt-4 flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            inputMode="numeric"
            maxLength={1}
            value={otp[i] || ""}
            onChange={(e) => onChangeBox(i, e.target.value)}
            className="h-12 w-12 rounded-lg border border-neutral-800 bg-neutral-950 text-center text-xl font-bold text-white focus:ring-2 focus:ring-emerald-600/50"
          />
        ))}
      </div>

      <div className="mt-3 text-sm text-neutral-400">
        Get a new code in{" "}
        <span className="font-semibold text-neutral-200">
          00:{String(sec).padStart(2, "0")}
        </span>
      </div>

      <button
        onClick={verify}
        disabled={otp.length !== 6}
        className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
      >
        Verify phone
      </button>
    </div>
  );
}
