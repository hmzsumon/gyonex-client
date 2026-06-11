"use client";
export default function SubmitButton({
  disabled,
  loading,
  onClick,
  children,
}: {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  children: any;
}) {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className="rounded-lg w-full bg-green-600/90 hover:bg-green-600 text-black font-semibold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Submitting…" : children}
    </button>
  );
}
