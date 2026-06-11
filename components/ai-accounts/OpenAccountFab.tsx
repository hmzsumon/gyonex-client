/* ──────────────────────────────────────────────────────────────────────────
   OpenAccountFab — floating plus button
────────────────────────────────────────────────────────────────────────── */
export default function OpenAccountFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 text-xl"
      aria-label="Open account"
      title="Open account"
    >
      +
    </button>
  );
}
