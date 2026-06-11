// components/profile/AddProfileForm.tsx
"use client";

/* ─────────────────────────────────────────────────────────────
  step: add profile info
  - local state + validation
  - save to kyc model
─────────────────────────────────────────────────────────────── */
import { useSaveKycProfileMutation } from "@/redux/features/auth/authApi";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import CountrySelectPro from "./CountrySelectPro";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ── helper: date to iso ──────────────────────────────────── */
const toIsoDate = (day: string, month: string, year: string) => {
  const monthIndex = MONTHS.indexOf(month) + 1;
  return `${year}-${String(monthIndex).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

/* ── helper: valid dob ────────────────────────────────────── */
const makeDob = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return null;

  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex < 0) return null;

  const dt = new Date(Number(year), monthIndex, Number(day));
  const valid =
    dt.getFullYear() === Number(year) &&
    dt.getMonth() === monthIndex &&
    dt.getDate() === Number(day);

  return valid ? dt : null;
};

/* ── helper: age ──────────────────────────────────────────── */
const getAge = (dob: Date) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

export default function AddProfileForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [saveKycProfile, { isLoading }] = useSaveKycProfileMutation();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [birthCountry, setBirthCountry] = useState("");
  const [gender, setGender] = useState<"Female" | "Male" | "Other" | "">("");
  const [address, setAddress] = useState("");

  const days = useMemo(
    () => Array.from({ length: 31 }, (_, i) => `${i + 1}`),
    [],
  );

  const years = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => `${new Date().getFullYear() - i}`),
    [],
  );

  const dob = makeDob(day, month, year);
  const age = dob ? getAge(dob) : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (first.trim().length < 2) {
      return toast.error("First name must be at least 2 characters");
    }

    if (last.trim().length < 2) {
      return toast.error("Last name must be at least 2 characters");
    }

    if (!dob) {
      return toast.error("Please enter a valid date of birth");
    }

    if (age < 18) {
      return toast.error("You must be at least 18 years old");
    }

    if (!birthCountry.trim()) {
      return toast.error("Please select your country of birth");
    }

    if (!gender) {
      return toast.error("Please select your gender");
    }

    if (address.trim().length < 8) {
      return toast.error("Please enter a valid residential address");
    }

    try {
      await saveKycProfile({
        firstName: first.trim(),
        lastName: last.trim(),
        dateOfBirth: toIsoDate(day, month, year),
        countryOfBirth: birthCountry.trim(),
        gender,
        residentialAddress: address.trim(),
      }).unwrap();

      toast.success("KYC profile saved successfully");
      onSuccess();
    } catch (e: any) {
      toast.error(
        e?.data?.message ||
          e?.data?.error ||
          e?.message ||
          "Failed to save KYC profile",
      );
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-2 py-4"
    >
      <div className="mb-4 text-sm font-extrabold text-white">
        Add profile information
      </div>

      <label className="mb-1 block text-sm text-neutral-300">First Name</label>
      <input
        value={first}
        onChange={(e) => setFirst(e.target.value)}
        placeholder="Your first name as shown on your ID"
        className="text-xs mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
      />

      <label className="mb-1 block text-sm text-neutral-300">Last Name</label>
      <input
        value={last}
        onChange={(e) => setLast(e.target.value)}
        placeholder="Your last name as shown on your ID"
        className="text-xs mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
      />

      <label className="mb-1 block text-sm text-neutral-300">
        Date of birth
      </label>
      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100"
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100"
        >
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <label className="mb-1 block text-sm text-neutral-300">
        Country of birth
      </label>
      <CountrySelectPro
        value={birthCountry}
        onChange={(v) => setBirthCountry(v || "")}
        placeholder="Select country"
      />

      <div className="mt-4">
        <div className="mb-1 text-sm text-neutral-300">Your gender</div>
        <div className="flex items-center gap-6">
          {(["Female", "Male", "Other"] as const).map((g) => (
            <label key={g} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={gender === g}
                onChange={() => setGender(g)}
                className="h-4 w-4 accent-emerald-500"
              />
              <span className="text-neutral-200">{g}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="mt-4 mb-1 block text-sm text-neutral-300">
        Your residential address
      </label>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="City, Street, house (apartment)"
        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
