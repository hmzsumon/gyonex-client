import Link from "next/link";

/* ──────────────────────────────────────────────────────────────────────────
   AccountsTabs — Open / Pending / Closed (visual only)
────────────────────────────────────────────────────────────────────────── */
export default function AccountsTabs() {
  return (
    <div className="mt-6 border-b border-neutral-800">
      <div className="flex gap-6 text-sm">
        <Link href="/positions" className="pb-3 ">
          <button className="pb-3  border-white">Open</button>
        </Link>

        <Link
          href="/closed-positions"
          className="pb-3 border-b-2 border-transparent"
        >
          <button className="pb-3 border-b-2 border-transparent border-white">
            Pending
          </button>
        </Link>
      </div>
    </div>
  );
}
