// components/profile/AccountSummary.tsx
"use client";

/* ─────────────────────────────────────────────────────────────
  card: account summary
  - not verified
  - under review
  - verified
─────────────────────────────────────────────────────────────── */
import { AlertCircle, BadgeCheck, Clock3, DollarSign } from "lucide-react";

type StatusType = "not_verified" | "under_review" | "verified";

export default function AccountSummary({
  status,
  completed,
  total,
  depositLimitUSD,
}: {
  status: StatusType;
  completed: number;
  total: number;
  depositLimitUSD: number;
}) {
  const statusMeta =
    status === "verified"
      ? {
          icon: <BadgeCheck className="h-7 w-7 text-emerald-400" />,
          title: "Verified",
          subtitle: `${completed}/${total} steps complete`,
          tone: "border-emerald-800/40 bg-emerald-500/10 text-emerald-400",
        }
      : status === "under_review"
        ? {
            icon: <Clock3 className="h-7 w-7 text-yellow-400" />,
            title: "Under review",
            subtitle: "Your KYC documents are being reviewed",
            tone: "border-yellow-800/40 bg-yellow-500/10 text-yellow-400",
          }
        : {
            icon: <AlertCircle className="h-7 w-7 text-red-400" />,
            title: "Not verified",
            subtitle: `${completed}/${total} steps complete`,
            tone: "border-red-800/40 bg-red-500/10 text-red-400",
          };

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${statusMeta.tone}`}
          >
            {statusMeta.icon}
          </div>

          <div>
            <div className="text-sm text-neutral-400">Status</div>
            <div
              className={`text-2xl font-bold ${statusMeta.tone.includes("yellow") ? "text-yellow-400" : statusMeta.tone.includes("emerald") ? "text-emerald-400" : "text-red-400"}`}
            >
              {statusMeta.title}
            </div>
            <div className="text-sm text-neutral-400">
              {statusMeta.subtitle}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800">
            <DollarSign className="h-7 w-7 text-neutral-300" />
          </div>

          <div>
            <div className="text-sm text-neutral-400">Deposit limit</div>
            <div className="text-2xl font-bold text-white">
              {depositLimitUSD === Infinity
                ? "Unlimited"
                : `${depositLimitUSD} USD`}
            </div>
            <div className="text-sm text-neutral-400">
              Verify your account to unlock limits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
