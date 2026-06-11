"use client";

import { Combobox, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import countries from "world-countries";

/* ── build options (flag + name + iso2) ───────────────────── */
const OPTIONS = countries
  .map((c) => ({
    value: c.name.common,
    label: c.name.common,
    flag: c.flag,
    iso2: (c.cca2 || "").toLowerCase(),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

/* ── props ─────────────────────────────────────────────────── */
type Props = {
  value: string; // external value is always string in your form
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
};

/* ── component ─────────────────────────────────────────────── */
export default function CountrySelectPro({
  value,
  onChange,
  placeholder,
  error,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OPTIONS;
    return OPTIONS.filter(
      (o) => o.label.toLowerCase().includes(q) || o.iso2.includes(q)
    );
  }, [query]);

  const selected = useMemo(
    () => OPTIONS.find((o) => o.value === value) || null,
    [value]
  );

  return (
    <div className="w-full">
      {/* ── trigger/input ───────────────────────────────────── */}
      {/* NOTE: Combobox expects value: string | null and onChange: (string | null) => void */}
      <Combobox
        value={selected?.value ?? null}
        onChange={(v: string | null) => onChange(v ?? "")}
      >
        <div className="relative">
          <div className="relative flex items-center">
            <Combobox.Input
              // val can be string | null; show empty string when null
              displayValue={(val: string | null) => val ?? ""}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder || "Select country"}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 pr-9 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-emerald-600/40"
            />
            <Combobox.Button className="absolute right-2 rounded p-1 text-neutral-400 hover:text-neutral-200">
              <ChevronDown size={16} />
            </Combobox.Button>
          </div>

          {/* ── dropdown ─────────────────────────────────────── */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl outline-none ring-1 ring-emerald-600/20">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-400">
                  No matches
                </div>
              ) : (
                filtered.map((o) => (
                  <Combobox.Option
                    key={o.value}
                    value={o.value}
                    className={({ active }) =>
                      [
                        "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                        active
                          ? "bg-emerald-600/20 text-emerald-300"
                          : "text-neutral-200",
                      ].join(" ")
                    }
                  >
                    <span className="text-base">{o.flag}</span>
                    <span className="flex-1 truncate">{o.label}</span>
                    <span className="text-xs text-neutral-400 uppercase">
                      {o.iso2}
                    </span>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      {/* ── error ───────────────────────────────────────────── */}
      {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

/* ── helper: get ISO2 for phone input ──────────────────────── */
export function iso2FromCountryName(name?: string) {
  if (!name) return "bd";
  return OPTIONS.find((o) => o.value === name)?.iso2 || "bd";
}
