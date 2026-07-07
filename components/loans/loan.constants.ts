import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Banknote,
  CreditCard,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Loan package config
   KYC verified user এর জন্য form simple রাখা হয়েছে।
────────────────────────────────────────────────────────────── */
export type LoanTypeConfig = {
  key: string;
  label: string;
  rate: string;
  icon: LucideIcon;
  short: string;
  color: string;
  maxDays: number;
  defaultDays: number;
  desc: string;
};

export const LOAN_TYPES: LoanTypeConfig[] = [
  {
    key: "trading",
    label: "Trading Loan",
    rate: "6%/mo",
    icon: TrendingUp,
    short: "T",
    color: "#3B82F6",
    maxDays: 50,
    defaultDays: 50,
    desc: "Trading capital support",
  },
  {
    key: "house",
    label: "Home Loan",
    rate: "6%/mo",
    icon: CreditCard,
    short: "H",
    color: "#10D980",
    maxDays: 90,
    defaultDays: 90,
    desc: "Home related support",
  },
  {
    key: "business",
    label: "Business Loan",
    rate: "6%/mo",
    icon: Banknote,
    short: "B",
    color: "#8B5CF6",
    maxDays: 120,
    defaultDays: 120,
    desc: "Business growth fund",
  },
  {
    key: "study",
    label: "Student Loan",
    rate: "6%/mo",
    icon: FileCheck2,
    short: "S",
    color: "#06B6D4",
    maxDays: 90,
    defaultDays: 90,
    desc: "Study and tuition help",
  },
  {
    key: "land",
    label: "Land Loan",
    rate: "6%/mo",
    icon: ShieldCheck,
    short: "L",
    color: "#F5B731",
    maxDays: 180,
    defaultDays: 90,
    desc: "Longer repayment option",
  },
  {
    key: "emergency",
    label: "Emergency",
    rate: "6%/mo",
    icon: AlertTriangle,
    short: "E",
    color: "#F04B55",
    maxDays: 30,
    defaultDays: 14,
    desc: "Fast emergency request",
  },
];

/* ─────────────────────────────────────────────────────────────
   Loan status theme
────────────────────────────────────────────────────────────── */
export const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: {
    label: "Under Review",
    color: "#F5B731",
    bg: "rgba(245,183,49,0.12)",
  },
  active: {
    label: "Active",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
  },
  completed: {
    label: "Completed",
    color: "#09D47D",
    bg: "rgba(9,212,125,0.12)",
  },
  rejected: {
    label: "Rejected",
    color: "#F04B55",
    bg: "rgba(240,75,85,0.12)",
  },
  defaulted: {
    label: "Defaulted",
    color: "#F04B55",
    bg: "rgba(240,75,85,0.12)",
  },
};

export const STATUS_FILTERS = [
  "all",
  "pending",
  "active",
  "completed",
  "rejected",
  "defaulted",
];
