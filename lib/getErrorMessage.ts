// lib/getErrorMessage.ts
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

function isFBQError(err: unknown): err is FetchBaseQueryError {
  return typeof err === "object" && err !== null && "status" in err;
}

export function getErrorMessage(err: unknown): string {
  const fallback = "Something went wrong";
  if (isFBQError(err)) {
    // API সাধারণত data:{ message?:string; error?:string } দেয়
    const data = (err as any).data;
    if (data && typeof data === "object") {
      return (data.message as string) ?? (data.error as string) ?? fallback;
    }
    return fallback;
  }
  // SerializedError বা সাধারন Error
  if (typeof err === "object" && err && "message" in err) {
    const m = (err as SerializedError & { message?: string }).message;
    if (m) return m;
  }
  if (typeof err === "string") return err;
  return fallback;
}
