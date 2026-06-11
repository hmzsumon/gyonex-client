"use client";

import HistoryCard from "@/components/transactions/HistoryCard";
import { useGetMyDepositsQuery } from "@/redux/features/deposit/depositApi";
import Image from "next/image";
import toast from "react-hot-toast";

const DepositHistory = () => {
  const { data, isLoading, isError, isSuccess, error } =
    useGetMyDepositsQuery(undefined);
  const { deposits } = data || [];

  return (
    <div className="flex flex-col gap-1 bg-white min-h-[80vh] ">
      {deposits && deposits.length > 0 ? (
        <>
          {deposits.map((deposit: any) => (
            <HistoryCard
              key={deposit._id}
              type="Deposit"
              status={deposit.status}
              amount={deposit.amount}
              currency={deposit.currency}
              method={deposit.method}
              time={deposit.createdAt}
              orderId={deposit._id}
              onCopy={(value: string) => {
                navigator.clipboard.writeText(value);
                toast.success("Copied to clipboard");
              }}
              record={deposit}
            />
          ))}
        </>
      ) : (
        <div className="text-center flex items-center justify-center min-h-[80vh]">
          <div>
            <Image
              src="/images/no-data.gif"
              width={200}
              height={200}
              alt="No Data"
              className="mx-auto"
            />
            <p className="text-gray-500 text-sm font-semibold">
              No Records found
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositHistory;
