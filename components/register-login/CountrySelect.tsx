"use client";

import { useMemo } from "react";
import countries from "world-countries";

/* ── build options once ────────────────────────────────────── */
const OPTIONS = countries
  .map((c) => ({
    value: c.name.common,
    label: `${c.flag}  ${c.name.common}`,
    iso2: (c.cca2 || "").toLowerCase(), // for phone default
  }))
  .sort((a, b) => a.value.localeCompare(b.value));

/* ── props ─────────────────────────────────────────────────── */
type Props = {
  value: string;
  onChange: (val: string) => void;
  error?: string;
};

/* ── component ─────────────────────────────────────────────── */
export default function CountrySelect({ value, onChange, error }: Props) {
  const options = useMemo(() => OPTIONS, []);
  return (
    <div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-2 focus:ring-emerald-600/40"
        >
          <option value="">Select country</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

/* ── helper: get ISO2 from country name (for phone default) ── */
export function iso2FromCountryName(name: string | undefined) {
  if (!name) return "bd";
  const found = OPTIONS.find((o) => o.value === name);
  return found?.iso2 || "bd";
}
