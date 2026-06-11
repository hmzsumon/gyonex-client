"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formDateWithTime } from "@/lib/functions";
import { Copy } from "lucide-react";
import { useSelector } from "react-redux";

interface TransactionCardProps {
  type: "Deposit" | "Withdraw" | "Transfer";
  status: "Complete" | "Pending" | "Failed";
  amount: number;
  currency?: string;
  method: {
    network: string;
    address: string;
  };
  time: string;
  orderId: string;
  onCopy?: (value: string) => void;
  record?: any;
}

const statusColor: Record<string, string> = {
  Complete: "text-green-600",
  Pending: "text-yellow-500",
  Failed: "text-red-500",
};

const TransactionCard = ({
  type,
  status,
  amount,
  currency = "USDT",
  time,
  orderId,
  record,
  onCopy,
  method = { network: "", address: "" },
}: TransactionCardProps) => {
  const { user } = useSelector((state: any) => state.auth);
  const typeColor =
    type === "Deposit"
      ? "green-500"
      : type === "Withdraw"
      ? "red-500"
      : "blue-500";

  const is_sender = type === "Transfer" && record?.sender?.user_id === user._id;
  const is_receiver =
    type === "Transfer" && record?.receiver?.user_id === user._id;
  return (
    <Card className="p-4 space-y-2 border rounded-md bg-white shadow-sm w-full  ">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className={`pointer-events-none bg-${typeColor} text-white text-sm font-semibold capitalize`}
        >
          {type}
        </Button>
        {type === "Transfer" ? (
          <span className={`text-sm font-medium capitalize text-${typeColor}`}>
            Complete
          </span>
        ) : (
          <>
            {type === "Withdraw" ? (
              <span
                className={`text-sm font-medium capitalize ${
                  record?.status === "approved"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {status}
              </span>
            ) : (
              <span
                className={`text-sm font-medium capitalize text-${typeColor}`}
              >
                {status}
              </span>
            )}
          </>
        )}
      </div>
      <hr />

      <div className="text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-bold text-orange-400">
            {amount?.toLocaleString()} {""}
            {currency}
          </span>
        </div>

        {type === "Deposit" && (
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="font-bold ">(BEP20)</span>
          </div>
        )}

        {type === "Withdraw" && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">Network</span>
              <span className="font-bold  capitalize">{method?.network}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Address</span>
              <span className="">{method?.address.slice(0, 12)}...</span>
            </div>
          </>
        )}

        {type === "Transfer" && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">Fee</span>
              <span className="">
                {record?.fee?.toLocaleString() || 0} {currency}
              </span>
            </div>

            <>
              <div className="flex justify-between">
                {is_receiver ? (
                  <span className="text-gray-500">Receive Amount </span>
                ) : (
                  <span className="text-gray-500">Sent Amount </span>
                )}

                <span className="">
                  {(record?.amount - record?.fee).toLocaleString() || 0}{" "}
                  {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sent UID </span>
                <span className="">{record?.sender.customer_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Receive UID </span>
                <span className="">{record?.receiver.customer_id}</span>
              </div>
            </>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">Time</span>
          <span>{formDateWithTime(new Date(time))}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Order Id</span>
          <span className="flex items-center gap-1">
            <span className="text-xs font-mono">{orderId.slice(0, 12)}...</span>
            <span
              onClick={() => onCopy?.(orderId)}
              className="text-gray-400 hover:text-black cursor-pointer "
            >
              <Copy size={14} />
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;
