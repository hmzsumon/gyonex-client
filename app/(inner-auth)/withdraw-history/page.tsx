"use client";
import HistoryCard from "@/components/transactions/HistoryCard";
import { useGetMyWithdrawRequestsQuery } from "@/redux/features/withdraw/withdrawApi";
import Image from "next/image";
import toast from "react-hot-toast";

const WithdrawHistory = () => {
  const { data, isLoading, isError, isSuccess, error } =
    useGetMyWithdrawRequestsQuery(undefined);

  const { withdraws } = data || [];

  return (
    <div className="flex flex-col gap-1 bg-white min-h-[80vh] ">
      {withdraws && withdraws.length > 0 ? (
        <>
          {withdraws.map((withdraw: any) => (
            <HistoryCard
              key={withdraw._id}
              type="Withdraw"
              status={withdraw.status}
              amount={withdraw.amount}
              currency={withdraw.currency}
              method={withdraw.method}
              time={withdraw.createdAt}
              orderId={withdraw._id}
              onCopy={(value: string) => {
                navigator.clipboard.writeText(value);
                toast.success("Copied to clipboard");
              }}
              record={withdraw}
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

export default WithdrawHistory;
