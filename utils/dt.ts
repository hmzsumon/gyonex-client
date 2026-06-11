export function dayHeader(date: Date) {
  const now = new Date();
  const d0 = new Date(now.toDateString());
  const d1 = new Date(date.toDateString());
  const diff = Math.round((d0.getTime() - d1.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}
