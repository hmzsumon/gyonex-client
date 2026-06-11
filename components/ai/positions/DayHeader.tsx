"use client";

export default function DayHeader({ date }: { date: Date }) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 3600 * 1000);

  const label =
    date.toDateString() === today.toDateString()
      ? "Today"
      : date.toDateString() === yesterday.toDateString()
      ? "Yesterday"
      : date.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

  return (
    <div className="mt-3 mb-1 text-xs font-medium text-neutral-400">
      {label}
    </div>
  );
}
