/* ── Invite Now Bottom Bar ────────────────────────────────────────────────── */

"use client";

const InviteNowBar: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className="sticky bottom-0 z-30 border-t border-neutral-900/60 bg-neutral-950/80 px-4 py-3 backdrop-blur">
      <button
        type="button"
        onClick={onClick}
        className="mx-auto block w-full rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-neutral-900 hover:opacity-90"
      >
        Invite Now
      </button>
    </div>
  );
};

export default InviteNowBar;
