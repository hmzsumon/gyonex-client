/* ────────── WithdrawPage (uses SecurityVerifyDrawer + RTK Query) ────────── */

"use client";

import SecurityVerifyDrawer from "@/components/security/SecurityVerifyDrawer";
import {
  useGetMyKycQuery,
  useLoadUserQuery,
} from "@/redux/features/auth/authApi";
import { useCreateWithdrawRequestMutation } from "@/redux/features/withdraw/withdrawApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { useSelector } from "react-redux";

/* অ্যাডমিন per-user মান সেট না করলে এই ডিফল্টটা ব্যবহার হয় */
const DEFAULT_REQUIRED_MEMBERS = 3;

export default function WithdrawPage() {
  const { user } = useSelector((state: any) => state.auth);

  const router = useRouter();

  /* ────────── team activation gate ──────────
     এই শর্ত সব ইউজারের জন্য নয়। অ্যাডমিন প্যানেল থেকে যাদের
     require_team_activation = true করা হয়েছে, শুধু তাদের ক্ষেত্রেই।
     কতজন লাগবে সেটাও per-user (required_team_members)।
  ─────────────────────────────────────────── */
  const teamRuleEnabled = user?.require_team_activation === true;
  const requiredMembers = Number(
    user?.required_team_members ?? DEFAULT_REQUIRED_MEMBERS,
  );
  const activatedMembers = user?.addNewMember ?? 0;
  const remainingToActivate = Math.max(0, requiredMembers - activatedMembers);

  /* ────────── KYC gate ──────────
     Redux-এর user স্টেট বাসি হতে পারে (approve হওয়ার পর ইউজার
     রি-লগইন না করলে), তাই load-user আর /kyc/me দুইটাই রিফেচ করে
     সবচেয়ে টাটকা status নিচ্ছি।
  ─────────────────────────────── */
  useLoadUserQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: kycData, isLoading: kycLoading } = useGetMyKycQuery();

  const kycDocStatus: string | undefined = kycData?.kyc?.status;

  const kycStatus: "approved" | "pending" | "rejected" | "not_started" =
    user?.kyc_verified || kycDocStatus === "approved"
      ? "approved"
      : kycDocStatus === "pending" || user?.kyc_request
        ? "pending"
        : kycDocStatus === "rejected"
          ? "rejected"
          : "not_started";

  const needsKyc = kycStatus !== "approved";

  const needsTeam = teamRuleEnabled && activatedMembers < requiredMembers;

  const isWithdrawBlocked = needsKyc || needsTeam;

  // Create request
  const [createWithdrawRequest, { isLoading: isCreateLoading }] =
    useCreateWithdrawRequestMutation();

  // Local form state
  const [amount, setAmount] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [network, setNetwork] = useState<"TRC20" | "BEP20">("TRC20");
  const [amountError, setAmountError] = useState<string>("");

  // OTP Drawer
  const [verifyOpen, setVerifyOpen] = useState(false);

  // Derived
  const minWithdraw = 50;
  const feeRate = 0.08;
  const availableBalance = useMemo(
    () => Math.max(0, user?.m_balance || 0),
    [user?.m_balance],
  );

  // balance < 200 হলে ইনপুট থেকে টাইপ নিষিদ্ধ
  const canTypeCustomAmount = availableBalance >= 200;

  // preset amounts
  const presetAmounts = [50, 100, 200, 250, 300, 500];

  const withdrawFee = useMemo(() => {
    const n = parseFloat(amount || "0");
    return isNaN(n) ? 0 : +(n * feeRate).toFixed(2);
  }, [amount]);

  const actualReceipt = useMemo(() => {
    const n = parseFloat(amount || "0");
    return isNaN(n) ? 0 : +(n - n * feeRate).toFixed(2);
  }, [amount]);

  // Handlers
  const handleAmountChange = (value: string) => {
    setAmount(value);
    const parsed = parseFloat(value);

    if (!value) return setAmountError("");
    if (isNaN(parsed) || parsed <= 0)
      return setAmountError("Enter a valid amount");
    if (parsed < minWithdraw)
      return setAmountError(`Minimum withdrawal amount is ${minWithdraw} USDT`);
    if (parsed > availableBalance)
      return setAmountError("Amount exceeds available balance");

    setAmountError("");
  };

  // preset button click handler
  const handlePresetClick = (value: number) => {
    // ব্যালেন্স যদি কম হয়, কিছু করবে না (সেফটি)
    if (availableBalance < value) return;

    const asString = value.toString();
    handleAmountChange(asString);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !!amountError) {
      toast.error(amountError || `Enter amount (min $${minWithdraw})`);
      return;
    }
    if (!walletAddress) {
      toast.error("Please enter your wallet address");
      return;
    }
    if (user?.is_withdraw_block) {
      toast.error("Please contact customer support");
      return;
    }

    /* 🔒 KYC না থাকলে OTP পাঠানোর আগেই থামিয়ে দিই */
    if (needsKyc) {
      if (kycStatus === "pending") {
        toast.error("Your KYC is under review. Please wait for approval.");
        return;
      }
      toast.error("Please complete your KYC verification first.");
      router.push("/settings/profile");
      return;
    }

    if (needsTeam) {
      toast.error(
        `Activate ${remainingToActivate} more member(s) to unlock withdrawals.`,
      );
      return;
    }

    // open OTP drawer, which sends the code & verifies
    setVerifyOpen(true);
  };

  // Called by drawer after OTP verify success
  const handleRequestWithdraw = () => {
    const payload = {
      amount: parseFloat(amount),
      withdrawAddress: walletAddress,
      network,
      withdrawFee,
      receiptAmount: actualReceipt,
    };

    createWithdrawRequest(payload)
      .unwrap()
      .then(() => {
        toast.success("Withdrawal request created successfully!");
        setAmount("");
        setWalletAddress("");
      })
      .catch((err: any) => {
        const data = (err as fetchBaseQueryError)?.data as any;

        toast.error(
          data?.message || data?.error || "Unable to create withdraw request",
        );

        /* সার্ভার KYC গেটে আটকালে সরাসরি KYC পেজে পাঠাই */
        if (data?.code === "KYC_REQUIRED" && data?.kycStatus !== "pending") {
          router.push("/settings/profile");
        }
      });
  };

  const currentAmountNum = parseFloat(amount || "0");

  // UI
  return (
    <div className="min-h-screen bg-neutral-950 px-3 py-5 md:px-6 md:py-8">
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto w-full max-w-2xl"
      >
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 ring-1 ring-emerald-800/10">
          {/* Header */}
          <div className="relative border-b border-neutral-800 bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 text-neutral-950">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/dashboard"
                className="inline-flex items-center self-start rounded-lg bg-black/10 px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-black/20"
              >
                <FiArrowLeft className="mr-2" /> Back
              </Link>

              <h1 className="mx-auto rounded-xl bg-white/20 px-4 py-1 text-center text-base font-extrabold tracking-wide text-white shadow-sm sm:mx-0 sm:text-lg">
                Withdraw USDT
              </h1>

              <div className="hidden w-[88px] sm:block" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
              <span className="inline-flex items-center justify-between gap-2 rounded-full border border-emerald-700/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100 sm:justify-center sm:text-[13px]">
                <span className="inline-flex items-center gap-1">
                  <FiClock className="opacity-90" /> Min:
                </span>
                <strong className="text-white/95">${minWithdraw}</strong>
              </span>

              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-700/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100 sm:text-[13px]">
                Fee: <strong className="text-white/95">8%</strong>
              </span>

              <span className="col-span-2 inline-flex items-center justify-between gap-2 rounded-full border border-emerald-700/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100 sm:col-span-1 sm:justify-center sm:text-[13px]">
                <span>Available:</span>
                <strong className="text-white/95">
                  ${availableBalance.toFixed(2)}
                </strong>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-200">
                  Amount (USDT)
                </label>

                {/* Preset amount buttons */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {presetAmounts.map((preset) => {
                    const disabled = availableBalance < preset;
                    const isActive = currentAmountNum === preset;

                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={disabled}
                        onClick={() => handlePresetClick(preset)}
                        className={[
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                          disabled
                            ? "cursor-not-allowed border-neutral-800 text-neutral-500 opacity-60"
                            : isActive
                              ? "border-emerald-600 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-600/40"
                              : "border-neutral-700 bg-neutral-900/70 text-neutral-200 hover:border-neutral-500",
                        ].join(" ")}
                      >
                        {preset === 200 ? "200+" : preset}
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    readOnly={!canTypeCustomAmount}
                    onChange={(e) => {
                      // balance < 200 হলে টাইপ allow করবে না
                      if (!canTypeCustomAmount) return;
                      handleAmountChange(e.target.value);
                    }}
                    placeholder={
                      canTypeCustomAmount
                        ? `${minWithdraw} or more`
                        : "Select 50, 100, 200 or 250,300,500+"
                    }
                    className={`w-full rounded-lg border border-neutral-800 bg-neutral-900/70 px-9 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-emerald-600/40 ${
                      !canTypeCustomAmount
                        ? "cursor-not-allowed bg-neutral-900/80"
                        : ""
                    }`}
                    step="0.01"
                    min={minWithdraw}
                  />
                </div>

                {amount && !amountError && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-300 md:grid-cols-3">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-1.5">
                      Fee (8%):{" "}
                      <span className="font-semibold text-emerald-300">
                        ${withdrawFee}
                      </span>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-1.5">
                      You receive:{" "}
                      <span className="font-semibold text-emerald-300">
                        ${actualReceipt}
                      </span>
                    </div>
                    <div className="col-span-2 hidden rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 md:block">
                      Network: <span className="font-semibold">{network}</span>
                    </div>
                  </div>
                )}

                {!!amountError && (
                  <p className="mt-1 flex items-center text-xs text-red-500">
                    <FiAlertCircle className="mr-1" /> {amountError}
                  </p>
                )}
              </div>

              {/* network */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-200">
                  Select network
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["TRC20", "BEP20"] as const).map((n) => {
                    const active = network === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNetwork(n)}
                        className={[
                          "rounded-xl border px-4 py-2 text-sm transition",
                          active
                            ? "border-emerald-700/50 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-700/30"
                            : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700",
                        ].join(" ")}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* wallet addr */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-200">
                  {network} wallet address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={`Paste ${network} address`}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900/70 px-3 py-2.5 font-mono text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-emerald-600/40"
                  required
                />
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={
                  !amount ||
                  !!amountError ||
                  !walletAddress ||
                  user?.is_withdraw_block ||
                  !availableBalance ||
                  isCreateLoading ||
                  kycLoading ||
                  isWithdrawBlocked
                }
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreateLoading ? "Processing…" : "Request withdrawal"}
              </button>

              {/* ────────── KYC gate notice ────────── */}
              {needsKyc && (
                <BlockNotice
                  title={
                    kycStatus === "pending"
                      ? "KYC verification under review"
                      : kycStatus === "rejected"
                        ? "KYC verification was rejected"
                        : "KYC verification required"
                  }
                  body={
                    kycStatus === "pending"
                      ? "We are reviewing your documents. Withdrawals will unlock automatically once your KYC is approved."
                      : kycStatus === "rejected"
                        ? "Your documents could not be verified. Please re-submit them to unlock withdrawals."
                        : "Withdrawals are available to verified accounts only. Complete your KYC verification to continue."
                  }
                  ctaLabel={
                    kycStatus === "pending"
                      ? undefined
                      : kycStatus === "rejected"
                        ? "Re-submit KYC"
                        : "Complete KYC Now"
                  }
                  ctaHref="/settings/profile"
                />
              )}

              {/* ────────── team activation notice ────────── */}
              {!needsKyc && needsTeam && (
                <BlockNotice
                  title="Team requirement not met"
                  body={`Activate ${remainingToActivate} more member(s) to unlock withdrawals. (${activatedMembers}/${requiredMembers} completed)`}
                  ctaLabel="Invite friends"
                  ctaHref="/team"
                />
              )}

              {user?.is_withdraw_block && (
                <p className="mt-1 flex items-center text-xs text-red-500">
                  <FiAlertCircle className="mr-1" />
                  Please contact customer support
                </p>
              )}
            </motion.form>

            {/* notes */}
            <div className="mt-6 overflow-hidden rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-4 py-2">
                <FiInfo className="text-emerald-300" />
                <h4 className="text-sm font-semibold text-neutral-200">
                  Withdrawal guidelines
                </h4>
              </div>
              <div className="space-y-3 p-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-700/40 bg-emerald-500/10 text-xs font-bold text-emerald-300">
                    1
                  </span>
                  <div>
                    <div className="font-medium text-neutral-200">
                      Minimum withdrawal
                    </div>
                    <div className="text-neutral-400">
                      ${minWithdraw} USDT required for all withdrawals.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-700/40 bg-emerald-500/10 text-xs font-bold text-emerald-300">
                    2
                  </span>
                  <div>
                    <div className="font-medium text-neutral-200">
                      Network fees
                    </div>
                    <div className="text-neutral-400">
                      8% flat fee applies to all {network} transactions.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-700/40 bg-emerald-500/10 text-xs font-bold text-emerald-300">
                    3
                  </span>
                  <div>
                    <div className="font-medium text-neutral-200">
                      Processing time
                    </div>
                    <div className="text-neutral-400">
                      Typically completes within 1min–24 hours (depends on
                      network).
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-700/40 bg-emerald-500/10 text-xs font-bold text-emerald-300">
                    <FiCheck />
                  </span>
                  <div>
                    <div className="font-medium text-neutral-200">
                      Address verification
                    </div>
                    <div className="text-neutral-400">
                      Ensure your {network} address is correct. Transactions
                      cannot be reversed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /notes */}
          </div>
        </div>
      </motion.div>

      {/* OTP Drawer */}
      <SecurityVerifyDrawer
        open={verifyOpen}
        setOpen={setVerifyOpen}
        email={user?.email}
        context="withdraw"
        onVerified={handleRequestWithdraw}
        autoSendOnOpen={true}
        title="Verify Withdrawal"
      />
    </div>
  );
}

/* ────────── reusable block notice ────────── */
function BlockNotice({
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref: string;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-red-500/10 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-amber-500/15 p-2 text-amber-300">
          <FiAlertCircle className="text-base" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-100">{title}</p>

          <p className="mt-1 text-xs leading-relaxed text-amber-200/90">
            {body}
          </p>

          {ctaLabel && (
            <div className="mt-3">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20"
              >
                {ctaLabel}
                <FiArrowRight className="text-sm" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
