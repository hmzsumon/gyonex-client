"use client";

import AccountSelect from "@/components/transfer/AccountSelect";
import AmountInput from "@/components/transfer/AmountInput";
import SubmitButton from "@/components/transfer/SubmitButton";
import {
  LiteAccount,
  useCreateTransferMutation,
  useListMyAccountsLiteQuery,
} from "@/redux/features/transfer/transferApi";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type AccType = "standard" | "pro" | undefined;

const getMinForType = (t: AccType) =>
  t === "pro" ? 500 : t === "standard" ? 200 : 0;

export default function TransferForm() {
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth);

  const { data, isLoading, isError } = useListMyAccountsLiteQuery();
  const accounts: LiteAccount[] = data?.items || [];

  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const fromAcc = useMemo(
    () => accounts.find((a) => a.id === fromId),
    [accounts, fromId]
  );
  const toAcc = useMemo(
    () => accounts.find((a) => a.id === toId),
    [accounts, toId]
  );

  const mainBalance = Number(user?.m_balance || 0);
  const mainCurrency = user?.currency || "USD";

  const [submit, { isLoading: isSubmitting }] = useCreateTransferMutation();

  // from side currency/balance (unchanged)
  const fromCurrency =
    fromId === "main" ? mainCurrency : fromAcc?.currency || "USD";
  const fromBalance =
    fromId === "main" ? mainBalance : Number(fromAcc?.balance || 0);

  // ✅ মিনিমাম amount এখন TO account-এর type অনুযায়ী
  const toAccountType = (toAcc?.type as AccType) ?? undefined;
  const minAmountRequired = getMinForType(toAccountType);

  const canSubmit =
    !!fromId &&
    !!toId &&
    fromId !== toId &&
    amount > 0 &&
    amount >= minAmountRequired && // <-- new rule based on TO account type
    fromBalance >= amount;

  async function onSubmit() {
    if (!canSubmit) {
      if (!fromId || !toId) {
        toast.error("Please select both accounts");
        return;
      }
      if (fromId === toId) {
        toast.error("From and To accounts cannot be the same");
        return;
      }
      if (amount <= 0) {
        toast.error("Enter a valid amount");
        return;
      }
      if (amount < minAmountRequired) {
        toast.error(
          `Minimum amount for the destination (${
            toAccountType || "N/A"
          }) is ${fromCurrency} ${minAmountRequired.toFixed(2)}`
        );
        return;
      }
      if (fromBalance < amount) {
        toast.error("Insufficient balance");
        return;
      }
      toast.error("Please complete the form correctly");
      return;
    }

    try {
      await submit({ fromId, toId, amount }).unwrap();
      toast.success("Transfer completed");
      setAmount(0);
      router.push("/accounts");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Transfer failed");
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        Loading accounts…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-red-400">
        Failed to load accounts
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 space-y-4">
      <div className="text-lg font-bold text-neutral-200">Transfer</div>

      {/* From */}
      <AccountSelect
        label="Transfer out account"
        accounts={accounts}
        value={fromId}
        onChange={(v) => {
          setFromId(v);
          if (v === toId) setToId("");

          setAmount(0);
        }}
      />

      <div className="text-sm text-neutral-400">
        Available amount:&nbsp;
        <span className="text-neutral-200">
          {fromCurrency} {fromBalance.toFixed(2)}
        </span>
      </div>

      {/* To */}
      <AccountSelect
        label="Transfer in account"
        accounts={accounts}
        value={toId}
        excludeId={fromId}
        onChange={(v) => {
          setToId(v);
          // destination বদলালে min পরিবর্তন হতে পারে, UX ভাল রাখতে amount adjust/reset করতে পারেন
          // এখানে শুধু reset করলাম:
          // setAmount(0);
        }}
      />

      {/* ✅ TO account ভিত্তিক মিনিমাম ইনফো */}
      {minAmountRequired > 0 && (
        <div className="text-xs text-neutral-500">
          Minimum for destination ({toAccountType}):{" "}
          <span className="text-neutral-300">
            {fromCurrency} {minAmountRequired.toFixed(2)}
          </span>
        </div>
      )}

      <AmountInput
        currency={fromCurrency}
        value={amount}
        onChange={setAmount}
        max={fromBalance}
        // যদি AmountInput মিনিমাম সাপোর্ট করে, পাস করুন:
        min={minAmountRequired}
      />

      <div className="pt-1">
        <SubmitButton
          disabled={!canSubmit || isSubmitting}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Submit
        </SubmitButton>
      </div>

      <div className="text-xs text-neutral-500">
        If the margin ratio is less than 150%, it will not be executed.
      </div>
    </div>
  );
}
