"use client";

import ReactPhoneInput from "react-phone-input-2";

/* ── props ─────────────────────────────────────────────────── */
type Props = {
  value: string;
  onChange: (val: string) => void;
  country?: string; // ISO2 (e.g., "bd", "us")
};

/* ── component ─────────────────────────────────────────────── */
export default function PhoneInput({ value, onChange, country }: Props) {
  return (
    <div className="[&_.form-control]:!bg-neutral-900/60 [&_.form-control]:!text-neutral-200 [&_.form-control]:!border-neutral-800 [&_.flag-dropdown.open]:!bg-neutral-900 [&_.selected-flag:hover]:!bg-neutral-900 [&_.country-list]:!bg-neutral-900 [&_.country-list]:!border-neutral-800 [&_.country-list]:!text-neutral-200">
      <ReactPhoneInput
        country={country || "bd"} // default
        value={value}
        onChange={(val) => onChange(val)}
        inputStyle={{
          width: "100%",
          background: "transparent",
          color: "inherit",
          borderRadius: "0.5rem",
          border: "1px solid rgba(64,64,64,.9)",
          height: "40px",
        }}
        buttonStyle={{
          background: "transparent",
          border: "1px solid rgba(64,64,64,.9)",
          borderRight: "none",
          borderRadius: "0.5rem 0 0 0.5rem",
        }}
        dropdownStyle={{
          background: "#0a0a0a",
          color: "#e5e7eb",
          border: "1px solid rgba(64,64,64,.9)",
        }}
        containerClass="w-full"
        enableSearch
        disableCountryCode={false}
        disableDropdown={false}
        countryCodeEditable={false}
      />
    </div>
  );
}
