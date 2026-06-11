/* ────────── SecurityVerifyDrawer (RTK Query, 6-box UI, fixed refs + error styles) ────────── */

"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  useSendOtpToUserEmailMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiAtSign } from "react-icons/fi";
import PulseLoader from "react-spinners/PulseLoader";

type VerifyContext =
  | "transfer"
  | "withdraw"
  | "password_change"
  | "email_change"
  | "set_new_pin"
  | "generic";

interface SecurityVerifyDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
  context?: VerifyContext;
  onVerified: () => void;
  onCancel?: () => void;
  autoSendOnOpen?: boolean;
  title?: string;
}

/* ────────── helper: z****m@gmail.com ────────── */
function maskEmail(email: string) {
  const [name, domain] = (email || "").split("@");
  if (!domain) return email;
  if (name.length <= 2) return `${name[0] ?? ""}****@${domain}`;
  return `${name[0]}****${name.slice(-1)}@${domain}`;
}

export default function SecurityVerifyDrawer({
  open,
  setOpen,
  email,
  context = "generic",
  onVerified,
  onCancel,
  autoSendOnOpen = true,
  title = "Security Verify",
}: SecurityVerifyDrawerProps) {
  const [sendOtpToUserEmail, { isLoading: sending }] =
    useSendOtpToUserEmailMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const boxesRef = useRef<Array<HTMLInputElement | null>>([]);
  const [err, setErr] = useState<string>("");
  const [cooldown, setCooldown] = useState(0);

  const code = digits.join("");
  const canConfirm = /^\d{6}$/.test(code);
  const hasError = !!err;

  /* ────────── onOpen: focus + auto-send ────────── */
  useEffect(() => {
    if (open) {
      boxesRef.current[0]?.focus();
      if (autoSendOnOpen) doResend(true);
    } else {
      setDigits(["", "", "", "", "", ""]);
      setErr("");
      setCooldown(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ────────── cooldown timer ────────── */
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  /* ────────── input handlers ────────── */
  const handleBoxChange = (idx: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < 5) boxesRef.current[idx + 1]?.focus();
    if (hasError) setErr(""); // typing হলে error clear
  };

  const handleKeyDown = (
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
    if (e.key === "Enter") submit();
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
    if (hasError) setErr("");
  };

  /* ────────── actions ────────── */
  const submit = async () => {
    if (!canConfirm) {
      setErr("Enter the 6-digit code");
      return;
    }
    try {
      await verifyOtp({ email, otp: code, context }).unwrap();
      // toast.success("Code verified");
      setOpen(false);
      onVerified();
    } catch (e: any) {
      const msg =
        (e as fetchBaseQueryError)?.data?.message ||
        (e as fetchBaseQueryError)?.data?.error ||
        "Verification failed";
      setErr(msg);
      toast.error(msg);
    }
  };

  const doResend = async (silent = false) => {
    if (!email) {
      if (!silent) toast.error("Email is required.");
      return;
    }
    try {
      await sendOtpToUserEmail({ email }).unwrap();
      if (!silent) toast.success("Verification code sent");
      setCooldown(30);
    } catch (e: any) {
      const msg =
        (e as fetchBaseQueryError)?.data?.message ||
        (e as fetchBaseQueryError)?.data?.error ||
        "Failed to send code";
      if (!silent) toast.error(msg);
    }
  };

  /* ────────── styles ────────── */
  const boxBase =
    "h-12 w-12 rounded-md bg-neutral-900 text-center text-lg font-semibold text-neutral-100 outline-none transition";
  const boxOk =
    "border border-neutral-700 focus:ring-2 focus:ring-emerald-600/40";
  const boxErr = "border border-red-500 focus:ring-2 focus:ring-red-500/60";

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[85vh] rounded-t-3xl bg-neutral-900 px-3 pb-4">
        <div className="mx-auto w-full px-2 py-3">
          <DrawerHeader className="px-1">
            <DrawerTitle className="text-center text-sm text-neutral-100">
              {title}
            </DrawerTitle>

            {/* ────────── header (screenshot-like) ────────── */}
            <div className="mt-3 flex items-center gap-2 text-sm text-neutral-300">
              <FiAtSign className="text-neutral-400" />
              <div>
                <div className="text-[13px] text-neutral-400">
                  Enter the code we sent to:
                </div>
                <div className="font-semibold text-neutral-100">
                  {maskEmail(email)}
                </div>
              </div>
            </div>
          </DrawerHeader>
        </div>

        {/* ────────── six boxes ────────── */}
        <div className="px-4">
          <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  // ✅ ref callback must return void
                  boxesRef.current[i] = el;
                }}
                value={digits[i]}
                onChange={(e) => handleBoxChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                inputMode="numeric"
                maxLength={1}
                className={`${boxBase} ${hasError ? boxErr : boxOk}`}
              />
            ))}
          </div>

          {/* ────────── error text ────────── */}
          {!!err && (
            <div className="mt-2 text-xs font-semibold text-red-500">{err}</div>
          )}

          {/* ────────── resend link ────────── */}
          <button
            type="button"
            onClick={() => doResend(false)}
            disabled={sending || cooldown > 0}
            className="mt-3 text-left text-sm font-medium text-yellow-400 underline decoration-yellow-400/60 underline-offset-2 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cooldown > 0 ? `Get a new code in ${cooldown}s` : "Get a new code"}
          </button>

          {/* ────────── confirm ────────── */}
          <Button
            className="mt-4 w-full bg-emerald-500 text-neutral-900 font-semibold
             shadow-[0_0_0_1px_rgba(16,185,129,.25)]
             hover:bg-emerald-400 active:bg-emerald-500/90
             focus:outline-none focus:ring-2 focus:ring-emerald-500/40
             disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!canConfirm || verifying}
            onClick={submit}
          >
            {verifying ? <PulseLoader color="white" size={8} /> : "Confirm"}
          </Button>
        </div>

        <DrawerFooter className="px-4 py-2">
          <DrawerClose asChild>
            <Button
              className="w-full bg-transparent text-neutral-300 border border-neutral-700
                 hover:bg-neutral-800 hover:text-neutral-100
                 focus:outline-none focus:ring-2 focus:ring-neutral-600/40"
              onClick={() => onCancel?.()}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
