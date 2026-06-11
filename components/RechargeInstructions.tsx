"use client";
import { FaBookOpen } from "react-icons/fa";

interface RechargeInstructionsProps {
  data: React.ReactNode[];
  title: string;
}

const RechargeInstructions = ({ data, title }: RechargeInstructionsProps) => {
  const instructions = [
    "If the transfer time is up, please fill out the deposit form again.",
    "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
    "If you transfer the wrong amount, our company will not be responsible for the lost amount!",
    "Note: do not cancel the deposit order after the money has been transferred.",
  ];

  return (
    <div className="bg-transparent p-4 rounded-lg shadow-md border border-gray-200 w-full">
      <div className=" mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FaBookOpen className="text-htx-blue text-lg" />
          <h2 className="text-gray-200 font-semibold text-sm">{title}</h2>
        </div>
        <hr />
      </div>

      <ul className="space-y-2 text-xs text-gray-300">
        {data.map((item: React.ReactNode, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-red-500 mt-1">◆</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RechargeInstructions;
