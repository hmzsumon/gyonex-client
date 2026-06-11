"use client";
import { useAddUserPaymentMethodMutation } from "@/redux/features/auth/authApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

type WalletGroup = "bkash" | "nagad";

const BindWalletPage: React.FC = () => {
  const [addUserPaymentMethod, { isLoading, isSuccess, isError, error }] =
    useAddUserPaymentMethodMutation();

  const [group, setGroup] = useState<WalletGroup>("bkash");
  const [fullName, setFullName] = useState("");
  const [account, setAccount] = useState("");
  const [txPass, setTxPass] = useState("");
  const [txPass2, setTxPass2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const ewalletType = group === "bkash" ? "BKash" : "Nagad";

  // simple validations
  const nameErr = fullName.trim().length < 3 ? "Enter payee full name" : "";
  const accErr =
    group === "bkash" || group === "nagad"
      ? /^\d{11}$/.test(account)
        ? ""
        : "11-digit account number required"
      : "";
  const passErr = txPass.length < 6 ? "Min 6 characters" : "";
  const matchErr =
    txPass && txPass2 && txPass !== txPass2 ? "Passwords do not match" : "";

  const isValid = useMemo(
    () =>
      !nameErr &&
      !accErr &&
      !passErr &&
      !matchErr &&
      fullName &&
      account &&
      txPass &&
      txPass2,
    [nameErr, accErr, passErr, matchErr, fullName, account, txPass, txPass2]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const data = {
      name: fullName,
      method: group,
      accountNumber: account,
    };
    console.log(data);

    try {
      await addUserPaymentMethod(data).unwrap();
      toast.success("E-wallet bound successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        (error as fetchBaseQueryError).data?.error || "Something went wrong!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#0f4d3f] px-4 py-3 text-[#ffd54a]">
        <button
          type="button"
          className="rounded p-1 hover:bg-black/10"
          aria-label="Back"
          onClick={() => history.back()}
        >
          {/* back arrow */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Bind E-wallet</h1>
      </div>

      <form onSubmit={onSubmit} className="mx-auto w-full max-w-md px-4 py-5">
        {/* Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Select group */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Select E-wallet group
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGroup("bkash")}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition
                 ${
                   group === "bkash"
                     ? "border-pink-500 bg-pink-50 ring-2 ring-pink-300"
                     : "border-slate-200 hover:bg-slate-50"
                 }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded bg-white shadow">
                  <span className="text-pink-600 font-bold text-xs">bK</span>
                </div>
                <span className="text-sm">bKash</span>
              </button>

              <button
                type="button"
                onClick={() => setGroup("nagad")}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition
                 ${
                   group === "nagad"
                     ? "border-amber-500 bg-amber-50 ring-2 ring-amber-300"
                     : "border-slate-200 hover:bg-slate-50"
                 }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded bg-white shadow">
                  <span className="text-amber-600 font-bold text-xs">Ng</span>
                </div>
                <span className="text-sm">Nagad</span>
              </button>
            </div>
          </div>

          {/* E-wallet type (readonly) */}
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              E-wallet type
            </label>
            <input
              value={ewalletType}
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Full name */}
          <div className="mt-4">
            <div className="mb-1 flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">
                * Full name of the payee
              </label>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                {/* user icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
              </span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <p className="mt-2 text-[13px] leading-5 text-red-600">
              Please ensure the name you provide matches exactly with the name
              registered with your financial provider to avoid failure. Once the
              name is submitted, it cannot be changed.
            </p>
            {nameErr && <p className="mt-1 text-xs text-red-500">{nameErr}</p>}
          </div>

          {/* Account number */}
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              * {ewalletType} account number
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                {/* card/phone icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M17 1H7C5.9 1 5 1.9 5 3v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z" />
                </svg>
              </span>
              <input
                value={account}
                onChange={(e) =>
                  setAccount(e.target.value.replace(/\D/g, "").slice(0, 11))
                }
                inputMode="numeric"
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>
            {accErr && <p className="mt-1 text-xs text-red-500">{accErr}</p>}
          </div>

          {/* Password section title */}
          <p className="mt-4 text-[13px] font-medium text-red-600">
            Please set up your transaction password.
          </p>

          {/* Set transaction password */}
          <div className="mt-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              * Set transaction password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                {/* lock */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M12 17a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 17zm6-7h-1V7a5 5 0 0 0-10 0v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-8 0V7a2 2 0 0 1 4 0v3H10z" />
                </svg>
              </span>
              <input
                type={show1 ? "text" : "password"}
                value={txPass}
                onChange={(e) => setTxPass(e.target.value)}
                placeholder="******"
                className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 pr-10 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
              <button
                type="button"
                onClick={() => setShow1((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-600 hover:bg-slate-100"
                aria-label="Toggle password"
              >
                {show1 ? (
                  // eye-off
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M12 6c3.86 0 7.16 2.23 8.82 5.5-.46.92-1.08 1.76-1.82 2.5l1.41 1.41C22.09 13.88 23 12 23 12S19.27 4.5 12 4.5c-1.08 0-2.1.14-3.06.41l1.64 1.64C11.08 6.18 11.53 6 12 6zM2.1 2.1L.69 3.51 4.2 7.02C2.69 8.12 1.5 9.46 1 10.5c0 0 3.73 7.5 11 7.5 1.56 0 3.03-.28 4.37-.79l2.62 2.62 1.41-1.41L2.1 2.1zM12 16c-2.21 0-4-1.79-4-4 0-.55.11-1.07.31-1.54l1.5 1.5c-.03.17-.05.35-.05.54 0 1.66 1.34 3 3 3 .19 0 .37-.02.54-.05l1.5 1.5c-.47.2-.99.31-1.54.31z" />
                  </svg>
                ) : (
                  // eye
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M12 4.5C4.73 4.5 1 12 1 12s3.73 7.5 11 7.5S23 12 23 12 19.27 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                  </svg>
                )}
              </button>
            </div>
            {passErr && <p className="mt-1 text-xs text-red-500">{passErr}</p>}
          </div>

          {/* Confirm password */}
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              * Confirm password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M12 17a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 17zm6-7h-1V7a5 5 0 0 0-10 0v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-8 0V7a2 2 0 0 1 4 0v3H10z" />
                </svg>
              </span>
              <input
                type={show2 ? "text" : "password"}
                value={txPass2}
                onChange={(e) => setTxPass2(e.target.value)}
                placeholder="******"
                className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 pr-10 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
              <button
                type="button"
                onClick={() => setShow2((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-600 hover:bg-slate-100"
                aria-label="Toggle password"
              >
                {show2 ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M12 6c3.86 0 7.16 2.23 8.82 5.5-.46.92-1.08 1.76-1.82 2.5l1.41 1.41C22.09 13.88 23 12 23 12S19.27 4.5 12 4.5c-1.08 0-2.1.14-3.06.41l1.64 1.64C11.08 6.18 11.53 6 12 6zM2.1 2.1L.69 3.51 4.2 7.02C2.69 8.12 1.5 9.46 1 10.5c0 0 3.73 7.5 11 7.5 1.56 0 3.03-.28 4.37-.79l2.62 2.62 1.41-1.41L2.1 2.1z" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M12 4.5C4.73 4.5 1 12 1 12s3.73 7.5 11 7.5S23 12 23 12 19.27 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                  </svg>
                )}
              </button>
            </div>
            {matchErr && (
              <p className="mt-1 text-xs text-red-500">{matchErr}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className="mt-5 w-full rounded-lg bg-[#d9d9d9] py-3 text-base font-medium text-slate-800 transition
                       enabled:bg-[#0f4d3f] enabled:text-white enabled:hover:bg-[#0b3d31]
                       disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BindWalletPage;
