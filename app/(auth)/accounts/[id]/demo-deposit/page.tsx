"use client";

import DemoDeposit from "@/components/accounts/demo/DemoDeposit";
import DemoDepositStatus from "@/components/accounts/demo/DemoDepositStatus";
import { useGetMyAccountsQuery } from "@/redux/features/account/accountApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function DemoDepositPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // ✅ সব হুক উপরে
  const { data, isLoading } = useGetMyAccountsQuery();
  const [done, setDone] = useState<{ amount: number; currency: string } | null>(
    null
  );

  const acc = useMemo(
    () => (data?.items ?? []).find((a) => a._id === id),
    [data, id]
  );

  // ✅ redirect effect (render-এর মধ্যে replace/return নয়)
  useEffect(() => {
    if (acc && acc.mode !== "demo") {
      router.replace("/dashboard");
    }
  }, [acc, router]);

  if (isLoading || !acc) {
    return <div className="p-6 text-white">Loading...</div>;
  }
  if (acc.mode !== "demo") {
    // redirect চলছে
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      <div className="max-w-md mx-auto px-4 pb-16">
        {!done ? (
          <DemoDeposit
            currency={acc.currency}
            onSuccess={(r) => setDone(r)}
            onBack={() => router.back()}
            accountId={acc._id}
          />
        ) : (
          <DemoDepositStatus
            amount={done.amount}
            currency={done.currency}
            onClose={() => router.push("/dashboard")}
          />
        )}
      </div>
    </div>
  );
}
