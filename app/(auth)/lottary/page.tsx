"use client";

/* ────────── client lottery page imports ────────── */
import {
  LotteryEventList,
  LotteryHero,
  LotteryTabs,
  LotteryTicketsList,
  LotteryWinnersList,
} from "@/components/lottery/LotteryClientComponents";
import {
  useGetLotteryEventsQuery,
  useGetLotteryWinnersQuery,
  useGetMyLotteryTicketsQuery,
} from "@/redux/features/lottery/lotteryApi";
import { useState } from "react";

/* ────────── client lottery main page component ────────── */
export default function LotteryPage() {
  /* ────────── client lottery tab state ────────── */
  const [tab, setTab] = useState<"events" | "tickets" | "winners">("events");

  /* ────────── client lottery rtk query hooks ────────── */
  const { data: eventsData, isLoading } = useGetLotteryEventsQuery(undefined, {
    pollingInterval: 15000,
  });
  const { data: ticketsData } = useGetMyLotteryTicketsQuery();
  const { data: winnersData } = useGetLotteryWinnersQuery(1);

  /* ────────── client lottery response data mapping ────────── */
  const events = eventsData?.data ?? [];
  const tickets = ticketsData?.data ?? [];
  const winners = winnersData?.data?.winners ?? [];

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-6xl space-y-5 p-4 md:p-6 lg:p-8">
        {/* ────────── client lottery hero section ────────── */}
        <LotteryHero />

        {/* ────────── client lottery tab section ────────── */}
        <LotteryTabs active={tab} onChange={setTab} />

        {/* ────────── client lottery events section ────────── */}
        {tab === "events" && (
          <LotteryEventList events={events} loading={isLoading} />
        )}

        {/* ────────── client lottery tickets section ────────── */}
        {tab === "tickets" && <LotteryTicketsList tickets={tickets} />}

        {/* ────────── client lottery winners section ────────── */}
        {tab === "winners" && <LotteryWinnersList winners={winners} />}
      </div>
    </main>
  );
}
