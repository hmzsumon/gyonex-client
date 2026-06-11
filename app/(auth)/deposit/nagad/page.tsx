"use client";
import {
  useCreateDepositWithBDTMutation,
  useGetPaymentMethodsQuery,
} from "@/redux/features/deposit/depositApi";
import { useEffect, useMemo, useState } from "react";

import { fetchBaseQueryError } from "@/redux/services/helpers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";

const presetAmounts = [300, 500, 1000, 2000, 5000, 10000];

const methodName = "Nagad";

export default function BkashPage() {
  const router = useRouter();
  const [
    createDepositWithBDT,
    {
      isLoading: isCreating,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
      error: createError,
    },
  ] = useCreateDepositWithBDTMutation();

  const { data, isLoading, isError } = useGetPaymentMethodsQuery(undefined);
  const { paymentMethods } = data || {};

  const [amount, setAmount] = useState<number | "">("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    | {
        _id: string;
        methodName: string;
        methodType?: string;
        accountNumber?: string;
      }
    | undefined
  >(undefined);
  console.log("Payment Method:", paymentMethod);

  /* ────────── Filter Payment Methods by methodName= "Bkash" ────────── */
  useEffect(() => {
    if (paymentMethods) {
      const bkashMethod = paymentMethods.find(
        (method: { methodName: string }) => method.methodName === "Nagad"
      );
      if (bkashMethod) {
        setPaymentMethod(bkashMethod);
      }
    }
  }, [paymentMethods]);

  const [txnId, setTxnId] = useState("");

  const min = 300;
  const max = 20000;

  const amountError =
    amount !== "" && (Number(amount) < min || Number(amount) > max)
      ? `Amount must be between ${min} and ${max} BDT`
      : "";

  const isValid = useMemo(() => {
    if (amount === "" || !!amountError) return false;
    if (!txnId.trim()) return false;
    return true;
  }, [amount, amountError, txnId]);

  const copyAgent = () => {
    if (paymentMethod?.accountNumber) {
      navigator.clipboard
        .writeText(paymentMethod.accountNumber)
        .catch(() => {});
    }
  };

  /* ────────── Submit Handler ────────── */

  const handleSubmit = async () => {
    if (!isValid) return;

    const data = {
      amount: Number(amount),
      customerNumber,
      txnId,
      methodId: paymentMethod?._id,
    };

    console.log("Submitting data:", data);

    // Call your API or payment processing function here
    createDepositWithBDT(data);
  };

  /* ────────── useEffect for deposit ────────── */

  useEffect(() => {
    if (isCreateError) {
      toast.error((createError as fetchBaseQueryError).data?.error);
    }
    if (isCreateSuccess) {
      toast.success("Deposit created successfully!");
    }
  }, [isCreateError, isCreateSuccess]);

  return (
    <div>
      <div className="mt-2">
        <button
          className="text-gray-100 text-sm hover:underline flex items-center gap-1"
          onClick={() => router.back()}
        >
          <FaAngleLeft />
          Back
        </button>
      </div>
      <div className=" min-h-screen bg-transparent text-white flex items-start justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-[#00493B] bg-[#01241D] shadow-xl">
          {/* Top notice bar */}
          <div className="rounded-t-lg bg-[#2F69B1] px-4 py-3 text-sm">
            <p className="leading-snug">
              <b>Before making a request</b>, please transfer funds within 10
              minutes using the payment details specified below.
            </p>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Header row: name + agent number + copy */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                {paymentMethod?.methodType === "agent" ? (
                  <h2 className="text-base font-semibold">নগদ এজেন্ট নম্বর</h2>
                ) : (
                  <h2 className="text-base font-semibold">
                    নগদ পার্সোনাল নম্বর
                  </h2>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <span className="font-mono tracking-wide">
                    {paymentMethod?.accountNumber}
                  </span>
                  <button
                    onClick={copyAgent}
                    className="inline-flex items-center gap-1 rounded border border-[#2a7565] px-2 py-0.5 text-xs hover:bg-[#00493B]"
                    title="Copy number"
                  >
                    {/* copy icon */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>
              {/* small helper icons */}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Amount{" "}
                <span className="text-gray-300">
                  (Min {min.toFixed(2)} / Max {max.toLocaleString()} BDT)
                </span>
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={min}
                  max={max}
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="w-full rounded border border-[#00493B] bg-[#031a15] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2a7565]"
                />
                <div className="flex flex-wrap gap-2">
                  {presetAmounts.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className="rounded border border-[#2a7565] bg-transparent px-3 py-2 text-sm hover:bg-[#00493B]"
                    >
                      {v.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              {amountError ? (
                <p className="text-xs text-red-400">{amountError}</p>
              ) : (
                <p className="text-xs text-gray-400">
                  Example: 500, 1000, 2000…
                </p>
              )}
            </div>

            {/* Last two digits of your bKash account number */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">
                আপনার বিকাশ অ্যাকাউন্ট নম্বর :
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  placeholder="01"
                  className="w-full rounded border border-[#00493B] bg-[#031a15] px-3 py-2 text-sm text-center outline-none focus:ring-2 focus:ring-[#2a7565]"
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label className="text-sm font-semibold">
                  Transaction ID :
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={20}
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="e.g., 7AB12C3D45"
                  className="w-full rounded border border-[#00493B] bg-[#031a15] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2a7565]"
                />
              </div>
            </div>

            {/* Footer note */}
            <p className="text-xs leading-relaxed text-gray-300">
              Please recheck all information that is written in the deposit
              fields. If the relevant payment information like: [TxID, Txn ID,
              TrxID, UTR, Reference No.] is wrong – the transaction can be
              delayed.
            </p>

            {/* Confirm */}
            <button
              disabled={!isValid}
              className="mt-2 w-full rounded bg-[#4CAF50] py-3 text-center text-sm font-semibold text-white transition
                       enabled:hover:bg-[#3ea145] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
