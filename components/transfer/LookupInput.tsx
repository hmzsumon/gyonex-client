/* ────────── LookupInput (email or userId) ────────── */
"use client";

export default function LookupInput({
  mode,
  value,
  onChange,
  onClear,
  disabled,
  error,
}: {
  mode: "auto" | "email" | "customerId";
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  disabled?: boolean;
  error?: string;
}) {
  const placeholder =
    mode === "email"
      ? "Enter Email"
      : mode === "customerId"
      ? "Enter User ID"
      : "Enter Email or User ID";

  return (
    <div>
      <label className="mb-2 ml-1 block text-sm font-medium text-blue-gray-300">
        Email or User ID
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-lg border border-blue-gray-800 bg-transparent px-2 py-2 text-sm placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {!!value && !disabled && (
          <button
            type="button"
            aria-label="Clear"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-red-700 px-2 py-0.5 text-xs text-red-400 hover:bg-red-900/30"
          >
            X
          </button>
        )}
      </div>
      {!!error && <small className="text-xs text-red-500">{error}</small>}
    </div>
  );
}
