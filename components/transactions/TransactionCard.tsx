"use client";

import { useState } from "react";

/* ── type: single transaction record ────────────────────────────────────── */
export interface TransactionRecord {
  unique_id: string;
  isCashIn: boolean;
  purpose: string;
  amount: number;
  description?: string;
  createdAt: string | Date;
  currency?: string; // optional, fallback to USDT
}

/* ── props: only record ─────────────────────────────────────────────────── */
interface TransactionCardProps {
  record: TransactionRecord;
}

const TransactionCard = ({ record }: TransactionCardProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const isSuccess = !!record.isCashIn;
  const resultColor = isSuccess ? "text-green-600" : "text-red-500";
  const currency = record.currency || "USDT";

  return (
    <div className="border-b py-3 px-4 text-gray-800">
      {/* ── summary header ───────────────────────────────────────────────── */}
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setShowDetail(!showDetail)}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <button
              className={`${
                isSuccess ? "bg-green-500" : "bg-red-500"
              } flex w-[80px] items-center justify-center rounded py-1 text-xs text-white`}
            >
              {isSuccess ? "Cash In" : "Cash Out"}
            </button>
          </div>

          <div className="text-xs">
            <p className="space-x-2 font-semibold">
              <span>{record.unique_id}</span>
            </p>
            <p className="text-xs text-gray-500">
              {new Date(record.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className={`text-xs font-bold ${resultColor}`}>{record.purpose}</p>
          <p className={`${resultColor} text-xs font-bold`}>
            {Number.isFinite(record.amount)
              ? Math.abs(record.amount).toFixed(2)
              : "---"}{" "}
            {currency}
          </p>
        </div>
      </div>

      {/* ── details ──────────────────────────────────────────────────────── */}
      {showDetail && (
        <div className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Record Id</span>
            <span>{record.unique_id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span>
              {Number.isFinite(record.amount)
                ? record.amount.toFixed(2)
                : "0.00"}{" "}
              {currency}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Purpose</span>
            <span>{record.purpose}</span>
          </div>

          {record.description ? (
            <div className="flex flex-col justify-between gap-1">
              <span className="text-gray-500">Description</span>
              <span className="self-end text-[.70rem]">
                {record.description}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between">
            <span className={resultColor}>Status</span>
            <span className={resultColor}>
              {isSuccess ? "Cash In" : "Cash Out"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Trade time</span>
            <span>
              {new Date(record.createdAt).toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
