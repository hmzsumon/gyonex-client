"use client";

/* ────────── client lucky card shop page imports ────────── */
import {
  LuckyHero,
  LuckyMyCards,
  LuckyPurchaseHistory,
  LuckyShopList,
  LuckyTabs,
} from "@/components/lucky-card/LuckyCardClientComponents";
import {
  useBuyLuckyPackageMutation,
  useGetLuckyShopQuery,
  useGetMyLuckyCardsQuery,
  useGetMyLuckyPurchasesQuery,
} from "@/redux/features/lucky-card/luckyCardApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const getApiMessage = (error: any, fallback: string) =>
  error?.data?.error ||
  error?.data?.message ||
  error?.error ||
  error?.message ||
  fallback;

export default function LuckyCardsPage() {
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth);

  const [tab, setTab] = useState<"shop" | "cards">("shop");
  const [busyPkg, setBusyPkg] = useState<string | null>(null);

  const { data: shopData, isLoading } = useGetLuckyShopQuery();
  const { data: unopenedData, refetch: refetchUnopened } = useGetMyLuckyCardsQuery("unopened");
  const { data: openedData } = useGetMyLuckyCardsQuery("opened");
  const { data: purchasesData } = useGetMyLuckyPurchasesQuery();
  const [buy] = useBuyLuckyPackageMutation();

  const shop = shopData?.shop ?? [];
  const unopened = unopenedData?.cards ?? [];
  const opened = openedData?.cards ?? [];
  const purchases = purchasesData?.purchases ?? [];

  const handleBuy = async (packageId: string, price: number) => {
    if (Number(user?.m_balance || 0) < price) {
      toast.error("Insufficient balance — please deposit first");
      router.push("/deposit");
      return;
    }
    setBusyPkg(packageId);
    try {
      const res = await buy({ packageId }).unwrap();
      toast.success(`${res.purchase.quantity} cards added`);
      await refetchUnopened();
      setTab("cards");
    } catch (e) {
      toast.error(getApiMessage(e, "Purchase failed"));
    } finally {
      setBusyPkg(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-3xl space-y-5 p-4 md:p-6 lg:p-8">
        <LuckyHero balance={user?.m_balance} />
        <LuckyTabs active={tab} onChange={setTab} unopenedCount={unopened.length} />

        {tab === "shop" && (
          <LuckyShopList shop={shop} loading={isLoading} busyPackageId={busyPkg} onBuy={handleBuy} />
        )}

        {tab === "cards" && (
          <>
            <LuckyMyCards unopened={unopened} opened={opened} onGoShop={() => setTab("shop")} />
            <LuckyPurchaseHistory purchases={purchases} />
          </>
        )}
      </div>
    </main>
  );
}
