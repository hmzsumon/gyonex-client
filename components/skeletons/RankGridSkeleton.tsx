/* ────────── comments ────────── */
/* Grid of skeleton cards matching the real grid layout */
/* ────────── comments ────────── */
import RankCardSkeleton from "./RankCardSkeleton";

export default function RankGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <RankCardSkeleton key={i} />
      ))}
    </div>
  );
}
