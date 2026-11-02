"use client";

import LoanEligibilityHero from "@/components/loans/LoanEligibilityHero";
import LoanStatCard from "@/components/loans/LoanStatCard";
import LoanTabSwitch from "@/components/loans/LoanTabSwitch";
import MyLoansPanel from "@/components/loans/MyLoansPanel";
import RepayLoanModal from "@/components/loans/RepayLoanModal";
import SmartLoanApplyForm from "@/components/loans/SmartLoanApplyForm";
import { isUserKycVerified } from "@/components/loans/loan.helpers";
import { formatUSD } from "@/lib/format";
import { useGetMyLoansQuery } from "@/redux/features/loan/loanApi";
import { AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock3, FileCheck2, HandCoins } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

/* ─────────────────────────────────────────────────────────────
   Main loan page
   Component-based UI for easy future updates.
────────────────────────────────────────────────────────────── */
export default function LoansPage() {
  const [tab, setTab] = useState<"list" | "apply">("apply");
  const [filterStatus, setFilterStatus] = useState("all");
  const [repayId, setRepayId] = useState<string | null>(null);
  const { user } = useSelector((state: any) => state.auth);

  const { data: loanData, isLoading, isError, refetch } = useGetMyLoansQuery(undefined, {
    pollingInterval: 15000,
  });

  /* ────────── Loan data mapping ────────── */
  const loans = loanData?.data?.loans || [];
  const summary = loanData?.data?.summary || {};
  const usdtBal = Number(user?.m_balance || user?.usdtBalance || 0);

  /* ────────── KYC based eligibility ──────────
     Balance will not block loan application. Admin can review and edit amount.
  ────────────────────────────────────────────── */
  const eligible = true;
  const maxLoan = Math.max(usdtBal, 100000);
  const isKycVerified = isUserKycVerified(user);

  const filteredLoans =
    filterStatus === "all"
      ? loans
      : loans.filter((loan: any) => loan.status === filterStatus);

  const applicationBlocked = summary.canApply === false || Number(summary.activeLoans || 0) > 0 || loans.some((loan: any) => ["pending", "approved", "active", "defaulted"].includes(loan.status));
  const visibleTab = applicationBlocked ? "list" : tab;
  const repayLoan = loans.find((loan: any) => loan._id === repayId);

  if (isLoading || !loanData) return <div className="mx-auto max-w-7xl p-6 text-white/60">{isError ? <p role="alert">Could not load your loans. <button onClick={() => refetch()} className="text-emerald-300">Retry</button></p> : "Loading your loans…"}</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4 pb-10 md:p-6">
      {/* ────────── Hero + KYC status ────────── */}
      {!applicationBlocked && <LoanEligibilityHero
        eligible={eligible}
        isKycVerified={isKycVerified}
        maxLoan={maxLoan}
        usdtBal={usdtBal}
        onApply={() => setTab("apply")}
      />}

      {/* ────────── KPI cards ────────── */}
      {!applicationBlocked && <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <LoanStatCard
          label="Active Loans"
          value={String(summary.activeLoans || 0)}
          icon={Clock3}
          tone="blue"
          onClick={() => {
            setTab("list");
            setFilterStatus("active");
          }}
        />
        <LoanStatCard
          label="Under Review"
          value={String(summary.pendingLoans || 0)}
          icon={FileCheck2}
          tone="yellow"
          onClick={() => {
            setTab("list");
            setFilterStatus("pending");
          }}
        />
        <LoanStatCard
          label="Total Borrowed"
          value={formatUSD(summary.totalBorrowed || 0)}
          icon={HandCoins}
          tone="green"
          onClick={() => setTab("list")}
        />
        <LoanStatCard
          label="Total Repaid"
          value={formatUSD(summary.totalRepaid || 0)}
          icon={CheckCircle2}
          tone="green"
          onClick={() => setTab("list")}
        />
      </div>}

      {applicationBlocked && <div><h1 className="text-2xl font-bold text-white">My Loans</h1><p className="mt-2 text-sm text-white/50">{summary.hasOutstandingLoan ? "Repay your existing loan before applying for another loan." : "Your loan application is under review."}</p></div>}

      {/* ────────── Tab switch ────────── */}
      <LoanTabSwitch tab={visibleTab} setTab={setTab} allowApply={!applicationBlocked} />

      {/* ────────── Apply tab ────────── */}
      {visibleTab === "apply" && !applicationBlocked && (
        <SmartLoanApplyForm
          eligible={eligible}
          isKycVerified={isKycVerified}
          maxLoan={maxLoan}
          usdtBal={usdtBal}
          onSuccess={() => {
            setTab("list");
            setFilterStatus("pending");
          }}
        />
      )}

      {/* ────────── My loans tab ────────── */}
      {visibleTab === "list" && (
        <MyLoansPanel
          loans={loans}
          filteredLoans={filteredLoans}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          isLoading={isLoading}
          onApply={() => setTab("apply")}
          allowApply={!applicationBlocked}
          onRepay={setRepayId}
        />
      )}

      {/* ────────── Repay modal ────────── */}
      <AnimatePresence>
        {repayId && repayLoan && (
          <RepayLoanModal loan={repayLoan} onClose={() => setRepayId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
