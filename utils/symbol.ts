// utils/symbol.ts
export function toStreamKey(raw: string): string {
  return (raw || "").toUpperCase().replace("/", "");
}
