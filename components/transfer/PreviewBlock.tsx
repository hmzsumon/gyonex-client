/* ────────── PreviewBlock ────────── */
"use client";
import { formatBalance } from "@/lib/functions";

export default function PreviewBlock({
  recipient,
  receive,
  fee,
  gross,
}: {
  recipient: any;
  receive: number;
  fee: number;
  gross: number;
}) {
  return (
    <>
      <hr className="my-2 border border-blue-gray-800" />
      <div className="px-4">
        <div className="space-y-2">
          <li className="list-none flex items-center justify-between">
            <span className="font-bold">Send Mod:</span> <span>User Id</span>
          </li>
          <li className="list-none flex items-center justify-between">
            <span className="font-bold">To:</span>
            <span className="flex flex-col">
              {recipient?.customerId || recipient?.customer_id}
              <span className="text-xs text-blue-gray-500">
                ({recipient?.name})
              </span>
            </span>
          </li>
          <li className="list-none flex items-center justify-between">
            <span className="font-bold">Receive Amount:</span>
            <span>{formatBalance(receive)} USDT</span>
          </li>
          <li className="list-none flex items-center justify-between">
            <span className="font-bold">Fee (2%):</span>
            <span>{formatBalance(fee)} USDT</span>
          </li>
          <li className="list-none flex items-center justify-between">
            <span className="font-bold">Gross (you pay):</span>
            <span className="font-semibold">{formatBalance(gross)} USDT</span>
          </li>
          <li className="list-none flex items-center justify-between">
            <span className="font-bold">Send From:</span>
            <span>Main Wallet (USDT)</span>
          </li>
        </div>
      </div>
      <hr className="my-2 border border-blue-gray-800" />
    </>
  );
}
