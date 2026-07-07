"use client";

import { CreditCard } from "lucide-react";
import { STATUS_FILTERS, STATUS_MAP } from "./loan.constants";
import MyLoanCard from "./MyLoanCard";

/* ─────────────────────────────────────────────────────────────
   My Loans list panel
────────────────────────────────────────────────────────────── */
export default function MyLoansPanel({
  loans,
  filteredLoans,
  filterStatus,
  setFilterStatus,
  isLoading,
  onApply,
  onRepay,
}: {
  loans: any[];
  filteredLoans: any[];
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  isLoading: boolean;
  onApply: () => void;
  onRepay: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* ────────── Status filter ────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((status) => {
          const count =
            status === "all"
              ? loans.length
              : loans.filter((loan: any) => loan.status === status).length;
          const active = filterStatus === status;
          const statusTheme = STATUS_MAP[status] || {
            color: "rgba(255,255,255,0.55)",
            bg: "rgba(255,255,255,0.06)",
          };

          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className="shrink-0 rounded-full px-3 py-2 text-[11px] font-black capitalize transition"
              style={{
                background: active ? statusTheme.bg : "rgba(255,255,255,0.04)",
                color: active ? statusTheme.color : "rgba(255,255,255,0.45)",
                border: `1px solid ${
                  active ? `${statusTheme.color}45` : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              {status} {count > 0 ? `(${count})` : ""}
            </button>
          );
        })}
      </div>

      {/* ────────── Loan list ────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-[26px] bg-white/[0.05]" />
          ))}
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-white/15" />
          <h3 className="mt-4 text-lg font-black text-white">
            {filterStatus === "all" ? "No loans yet" : `No ${filterStatus} loans`}
          </h3>
          <p className="mt-2 text-sm text-white/45">
            After applying, the status will appear here as Under Review, Active, or Completed.
          </p>
          <button
            type="button"
            onClick={onApply}
            className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 px-5 py-3 text-sm font-black text-white"
          >
            Apply Loan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLoans.map((loan: any) => (
            <MyLoanCard key={loan._id} loan={loan} onRepay={onRepay} />
          ))}
        </div>
      )}
    </div>
  );
}
