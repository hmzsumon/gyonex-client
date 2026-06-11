"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RWebShare } from "react-web-share";

const InviteFriends = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const { user } = useSelector((state: any) => state.auth);
  // get host
  const host = window.location.host;
  // create referral link wit user customer_id
  let referralLink = "";
  if (process.env.NODE_ENV === "development") {
    referralLink = `http://${host}/register?referral_code=${user?.customerId}`;
  } else {
    referralLink = `https://${host}/register?referral_code=${user?.customerId}`;
  }
  // short referral link
  const shortReferralLink = referralLink.slice(0, 22) + "...";

  const tabs = ["Overview", "Rewards", "Incomes", "Records"];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* Header */}
      <div className="bg-teal-800 text-white py-4 flex items-center">
        <button className="ml-3 text-xl">←</button>
        <h1 className="flex-1 text-center text-lg font-semibold">
          Invite Friends
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-sw999-light-blue hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Content */}
      {activeTab === "Overview" && (
        <div className="p-4">
          {/* Income Boxes */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gradient-to-r from-blue-400 to-blue-300 text-white rounded-lg p-4 text-center">
              <p className="text-sm">Today's Income</p>
              <p className="text-2xl font-bold">৳ 0.00</p>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-300 text-white rounded-lg p-4 text-center">
              <p className="text-sm">Yesterday's Income</p>
              <p className="text-2xl font-bold">৳ 0.00</p>
            </div>
          </div>

          {/* Register / Referral */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-purple-200 rounded-lg p-4 text-center">
              <p className="text-sm">Registers</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-purple-300 rounded-lg p-4 text-center">
              <p className="text-sm">Valid Referral</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>

          {/* Share Section */}
          <div className="space-y-4">
            <div className="balance-info w-full rounded-xl">
              <RWebShare data={{ url: referralLink }}>
                <div className="relative flex-1 col-span-7 p-3 bg-icm-green cursor-pointer rounded-xl">
                  <div>
                    <h2 className="text-xl font-bold text-center text-sw999-yellow ">
                      Click Me To Invite Friend{" "}
                    </h2>
                  </div>
                </div>
              </RWebShare>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Your Referral Link</h2>
              <div className="flex items-center border rounded-lg p-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 text-sm outline-none bg-transparent text-sw999-light-blue border-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="ml-2 bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Your Referral Code</h2>
              <div className="flex items-center border rounded-lg p-2">
                <input
                  type="text"
                  value={user?.customerId || ""}
                  readOnly
                  className="flex-1 text-sm outline-none bg-transparent text-sw999-light-blue border-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="ml-2 bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
          </div>

          {/* Invite Text */}
          <div className="mt-6 text-center">
            <p className="font-semibold text-lg">
              Invite 1 person and earn up to 400TK
            </p>
            <p className="text-green-600 mt-2">
              Earn <span className="font-bold">2.2%</span> on lower level
              deposits
            </p>
            <p className="text-green-600">
              Lower level earns <span className="font-bold">1%</span> on every
              bet
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteFriends;
