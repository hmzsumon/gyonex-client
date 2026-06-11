// app/(dashboard)/transfer/page.tsx
"use client";

import TransferForm from "@/components/transfer/TransferForm";

const TransferPage = () => {
  return (
    <div className="max-w-xl mx-auto">
      <TransferForm />
    </div>
  );
};

export default TransferPage;
