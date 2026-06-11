/* ── file: utils/helpers.ts ─────────────────────────────────────────────────── */
export const errorMessage = (e: unknown): string => {
  if (typeof e === "string") return e;
  if (e && typeof e === "object" && "data" in e) {
    const data: any = (e as any).data;
    return data?.message || JSON.stringify(data);
  }
  return "Unexpected error";
};
