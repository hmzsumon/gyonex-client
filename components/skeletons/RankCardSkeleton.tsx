/* ────────── comments ────────── */
/* Skeleton placeholder for a rank card with subtle shimmer */
/* ────────── comments ────────── */
export default function RankCardSkeleton() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0B0F19] p-5 overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/10" />
          <div className="h-4 w-24 rounded bg-white/10" />
        </div>
        <div className="h-3 w-20 rounded bg-white/10" />
      </div>
      <div className="mt-3 h-3 w-3/4 rounded bg-white/10" />
      <div className="mt-5 space-y-3">
        <div className="h-2 w-full rounded bg-white/10" />
        <div className="h-2 w-full rounded bg-white/10" />
        <div className="h-3 w-28 rounded bg-white/10" />
      </div>
      <div className="mt-5 h-9 w-full rounded-xl bg-white/10" />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
