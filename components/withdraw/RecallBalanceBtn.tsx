/* ── Component: RecallBalanceBtn ────────────────────────────────────────── */
"use client";

export default function RecallBalanceBtn({
  loading,
  onClick,
}: {
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-[#00493B] bg-[#031A15] px-4 py-2 text-sm hover:bg-[#073328]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className={`fill-white ${loading ? "animate-spin" : ""}`}
      >
        <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5 0 1.38-.56 2.63-1.46 3.54l1.42 1.42A6.96 6.96 0 0 0 19 13c0-3.87-3.13-7-7-7zM6.46 8.46 5.04 7.04A6.96 6.96 0 0 0 5 13c0 3.87 3.13 7 7 7v3l4-4-4-4v3c-2.76 0-5-2.24-5-5 0-1.38.56-2.63 1.46-3.54z" />
      </svg>
      Recall Balance
    </button>
  );
}
