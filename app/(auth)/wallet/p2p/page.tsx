/* ────────── TransferPage (with Cancel + split components) ────────── */

"use client";

import RechargeInstructions from "@/components/RechargeInstructions";
import { TransferDrawer } from "@/components/transfer/TransferDrawer";
import { formatBalance } from "@/lib/functions";
import { useFindUserByQueryMutation } from "@/redux/features/auth/authApi";
import { useSendMutation } from "@/redux/features/send/sendApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import { Card } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

/* pieces */
import ActionBar from "@/components/transfer/ActionBar";
import AmountField from "@/components/transfer/AmountField";
import LookupInput from "@/components/transfer/LookupInput";
import LookupModeToggle from "@/components/transfer/LookupModeToggle";
import PreviewBlock from "@/components/transfer/PreviewBlock";

/* ────────── consts ────────── */
const tips = [
  "Minimum transfer amount is 10 USDT.",
  "You can transfer only to valid registered users of this platform.",
  "Once transferred, the balance cannot be reversed or refunded.",
  "Double-check the receiver’s User ID before confirming.",
  "A 5% fee is charged. Gross = Receive + Fee.",
  "You must have sufficient balance to cover the gross amount.",
  "Suspicious or fraudulent transfers may lead to suspension.",
];
const FEE_RATE = 0.05; // 5% fee
const PRESET_AMOUNTS = [10, 15, 30, 50, 100, 200];

export default function TransferPage() {
  /* ────────── state ────────── */
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth);
  const availableBalance = Number(user?.m_balance || 0);

  const [userId, setUserId] = useState(""); // email or userId
  const [amountText, setAmountText] = useState(""); // typed receive amount
  const amount = Number(amountText) || 0;

  const fee = useMemo(() => (amount > 0 ? amount * FEE_RATE : 0), [amount]);
  const gross = useMemo(() => amount + fee, [amount, fee]); // deducted from sender

  const [amountError, setAmountError] = useState<string>("");
  const [recipient, setRecipient] = useState<any>(null);
  const [recipientError, setRecipientError] = useState("");

  const [viaMode, setViaMode] = useState<"auto" | "email" | "customerId">(
    "email",
  );
  const [viaServer, setViaServer] = useState<"email" | "customerId" | null>(
    null,
  );

  const [isVerify, setIsVerify] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [findUserByQuery, { isLoading: findLoading }] =
    useFindUserByQueryMutation();
  const [
    send,
    {
      isLoading: sendLoading,
      isError: s_isError,
      isSuccess: s_isSuccess,
      error: s_error,
    },
  ] = useSendMutation();

  // balance < 200 হলে ইনপুট থেকে কাস্টম amount টাইপ করা যাবে না
  const canTypeCustomAmount = availableBalance >= 200;

  /* ────────── handlers ────────── */
  const handleChangeUserId = (v: string) => {
    setRecipientError("");
    setUserId(v);
  };

  // common updater: প্রিসেট + ইনপুট দু জায়গাতেই ব্যবহার করব
  const updateAmount = (v: string) => {
    const safe = v.replace(/[^\d.]/g, "");
    setAmountText(safe);
    setAmountError("");
  };

  // ইনপুট থেকে চেঞ্জ (শুধু balance >= 200 হলে allow)
  const handleChangeAmount = (v: string) => {
    if (!canTypeCustomAmount) return;
    updateAmount(v);
  };

  // প্রিসেট বাটন ক্লিক
  const handlePresetClick = (value: number) => {
    if (availableBalance < value) return; // সেফটি
    updateAmount(String(value));
  };

  /* ────────── amount validation ────────── */
  useEffect(() => {
    if (!amountText) return setAmountError("");
    const n = Number(amountText);
    if (!Number.isFinite(n) || n <= 0)
      return setAmountError("Amount must be greater than zero");
    if (n < 5) return setAmountError("Minimum transfer amount is 5 USDT");
    if (gross > availableBalance) {
      return setAmountError(
        `Insufficient balance. Gross ${formatBalance(
          gross,
        )} USDT > Available ${formatBalance(availableBalance)} USDT`,
      );
    }
  }, [amountText, gross, availableBalance]);

  /* ────────── find user (string query + optional via) ────────── */
  const handleFindUser = async () => {
    try {
      const res = await findUserByQuery({
        query: userId,
        via: viaMode !== "auto" ? viaMode : undefined,
      }).unwrap();

      const u = res?.user;
      if (!u) throw new Error("User not found");

      if ((u.customerId || u.customer_id) === user?.customerId) {
        setRecipientError("You cannot send to yourself");
        setRecipient(null);
        setViaServer(null);
        setIsDisable(false);
        return;
      }

      setRecipient(u);
      setViaServer(res.via || (viaMode === "auto" ? null : viaMode));
      setIsDisable(true);
    } catch (err: any) {
      setRecipientError(
        (err as fetchBaseQueryError)?.data?.error || "User not found",
      );
      setRecipient(null);
      setViaServer(null);
      setIsDisable(false);
    }
  };

  /* ────────── cancel (new) ────────── */
  const handleCancel = () => {
    setRecipient(null);
    setIsDisable(false);
    setIsVerify(false);
    setViaServer(null);
    // keep userId & amount as-is (you can clear if you prefer)
  };

  /* ────────── submit ────────── */
  const handleSubmit = () => {
    if (gross > availableBalance)
      return toast.error("Not enough balance to cover amount + fee.");
    if (!recipient) return toast.error("No recipient selected.");

    send({
      recipient_id: recipient.customerId || recipient.customer_id,
      amount,
      fee,
      receive_amount: amount,
      gross_amount: gross,
    });
  };

  /* ────────── post-send ────────── */
  useEffect(() => {
    if (s_isError)
      toast.error(
        (s_error as fetchBaseQueryError)?.data?.error || "Transfer failed",
      );
    if (s_isSuccess) {
      toast.success("Transfer successful");
      setOpenDrawer(false);
      setUserId("");
      setAmountText("");
      setRecipient(null);
      setViaServer(null);
      setIsDisable(false);
      setIsVerify(false);
      router.push("/transactions");
    }
  }, [s_isError, s_error, s_isSuccess, router]);

  /* ────────── disable rule (must have userId + valid amount) ────────── */
  const disableFindBtn =
    !userId || !amountText || !!amountError || findLoading || isDisable;

  return (
    <div className="mx-auto space-y-4 md:w-1/2">
      <Card className="bg-transparent">
        <div>
          <div className="space-y-2">
            <h2 className="text-center text-xl font-bold text-blue-gray-300">
              Transfer USDT
            </h2>
          </div>

          <hr className="my-2 border border-blue-gray-800" />
          <p className="text-center text-xs font-semibold">User To User</p>

          <div className="my-4 space-y-3 text-sm">
            {/* lookup mode */}
            <LookupModeToggle
              mode={viaMode}
              onChange={(m) => setViaMode(m)}
              disabled={isDisable}
            />

            {/* id/email input */}
            <LookupInput
              mode={viaMode}
              value={userId}
              onChange={handleChangeUserId}
              onClear={() => {
                setUserId("");
                setRecipient(null);
                setRecipientError("");
                setViaServer(null);
              }}
              disabled={isDisable}
              error={recipientError}
            />

            {/* amount presets + field */}
            <div className="space-y-2">
              <label className="mb-2 ml-1 block text-sm font-medium text-blue-gray-300">
                Transfer Amount (Receive)
              </label>
              {/* preset chips */}
              <div className="flex flex-wrap gap-2">
                {PRESET_AMOUNTS.map((preset) => {
                  const disabled = availableBalance < preset;
                  const isActive = amount === preset;

                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        handlePresetClick(
                          preset === 200 ? 200 : preset, // 200+ বাটনের জন্য
                        )
                      }
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

              {/* amount field */}
              <AmountField
                value={amountText}
                onChange={handleChangeAmount}
                onClear={() => setAmountText("")}
                disabled={isDisable || !canTypeCustomAmount}
                fee={fee}
                available={availableBalance}
                error={amountError}
              />
            </div>

            {/* preview block (only when recipient selected) */}
            {recipient && (
              <PreviewBlock
                recipient={recipient}
                receive={amount}
                fee={fee}
                gross={gross}
              />
            )}

            {/* actions (Cancel + Security Verify / Proceed) */}
            <ActionBar
              hasRecipient={!!recipient}
              isVerify={isVerify}
              disableFind={disableFindBtn}
              disableProceed={
                sendLoading || !!amountError || gross > availableBalance
              }
              onFind={() =>
                amountError ? toast.error(amountError) : handleFindUser()
              }
              onVerify={() =>
                amountError ? toast.error(amountError) : setOpenDrawer(true)
              }
              onProceed={() => {
                if (amountError) return toast.error(amountError);
                handleSubmit();
              }}
              onCancel={handleCancel}
            />

            {/* resolved by chip */}
            {viaServer && (
              <div className="text-right text-[11px] text-neutral-400">
                Resolved by:{" "}
                <span className="font-medium">
                  {viaServer === "email" ? "Email" : "User ID"}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <RechargeInstructions data={tips} title="Balance Transfer Instructions" />

      <TransferDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        handleConfirm={() => {
          setIsVerify(true);
          setOpenDrawer(false);
        }}
      />
    </div>
  );
}
