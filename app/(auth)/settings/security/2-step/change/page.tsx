// app/dashboard/settings/security/change-contact/page.tsx
"use client";

/* ── page: change email / phone / password ────────────────── */
import ChangeEmailForm from "@/components/settings/security/ChangeEmailForm";
import ChangePasswordForm from "@/components/settings/security/ChangePasswordForm";
import ChangePhoneForm from "@/components/settings/security/ChangePhoneForm";
import RadioRow from "@/components/settings/security/RadioRow";
import BottomSheet from "@/components/sheets/BottomSheet";
import { useState } from "react";
import { useSelector } from "react-redux";

type Method = "email" | "phone" | "password";

export default function ChangeContactPage() {
  const { user } = useSelector((s: any) => s.auth);

  // masked for display
  const maskedEmail =
    typeof user?.email === "string"
      ? user.email.replace(
          /(.).+(@.*)/,
          (_: any, a: string, b: string) => `${a}****${b}`
        )
      : "—";
  const maskedPhone =
    typeof user?.phone === "string"
      ? user.phone.replace(
          /^(\+\d{2}|\d{2})\d+(..)$/,
          (_: any, p1: string, p2: string) => `${p1}****${p2}`
        )
      : "—";

  const [method, setMethod] = useState<Method>("phone");
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-8 pt-4">
      <h1 className="px-4 pb-1 text-3xl font-extrabold text-neutral-100">
        Change Security
      </h1>

      <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
        <RadioRow
          label="Email"
          sub={maskedEmail}
          value="email"
          selected={method}
          onChange={setMethod}
          onEdit={(v) => {
            setMethod(v);
            setOpen(true);
          }}
        />
        <RadioRow
          label="Phone"
          sub={maskedPhone}
          value="phone"
          selected={method}
          onChange={setMethod}
          onEdit={(v) => {
            setMethod(v);
            setOpen(true);
          }}
        />
        <RadioRow
          label="Password"
          sub="Change your account password"
          value="password"
          selected={method}
          onChange={setMethod}
          onEdit={(v) => {
            setMethod(v);
            setOpen(true);
          }}
        />
      </div>

      <BottomSheet
        open={open}
        title={
          method === "email"
            ? "Change email"
            : method === "phone"
            ? "Change phone"
            : "Change password"
        }
        onClose={() => setOpen(false)}
      >
        {method === "email" && (
          <ChangeEmailForm onDone={() => setOpen(false)} />
        )}
        {method === "phone" && (
          <ChangePhoneForm onDone={() => setOpen(false)} />
        )}
        {method === "password" && (
          <ChangePasswordForm onDone={() => setOpen(false)} />
        )}
      </BottomSheet>
    </div>
  );
}
