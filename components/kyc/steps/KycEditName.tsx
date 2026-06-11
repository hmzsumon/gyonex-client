/* ── 03: Edit Name form ────────────────────────────────────── */
"use client";

import { go, setName } from "@/redux/features/kyc/kycSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function KycEditName() {
  const d = useDispatch();
  const { firstName, lastName } = useSelector((s: RootState) => s.kyc);
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);

  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        d(setName({ first, last }));
        d(go("agreement"));
      }}
      className="space-y-4"
    >
      <h1 className="text-3xl font-extrabold">Edit your name</h1>

      <label className="block text-sm">
        <span className="text-neutral-400">First Name</span>
        <input
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/40"
        />
      </label>

      <label className="block text-sm">
        <span className="text-neutral-400">Last Name</span>
        <input
          value={last}
          onChange={(e) => setLast(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/40"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-neutral-900 hover:bg-yellow-300"
      >
        Save
      </button>
    </form>
  );
}
