import { LOAN_TYPES } from "./loan.constants";

/* ─────────────────────────────────────────────────────────────
   Common className helper
────────────────────────────────────────────────────────────── */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────────────────────
   Loan package finder
────────────────────────────────────────────────────────────── */
export function getLoanType(key?: string) {
  return LOAN_TYPES.find((item) => item.key === key) || LOAN_TYPES[0];
}

/* ─────────────────────────────────────────────────────────────
   KYC verified checker
   Project এ field name আলাদা থাকলেও support করবে।
────────────────────────────────────────────────────────────── */
export function isUserKycVerified(user: any) {
  return Boolean(
    user?.kyc_verified ||
      user?.kycVerified ||
      user?.isKycVerified ||
      user?.kycStatus === "approved" ||
      user?.kyc?.status === "approved",
  );
}
