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
  const [winnerPage, setWinnerPage] = useState(1);

  /* ────────── client lottery rtk query hooks ────────── */
  const { data: eventsData, isLoading } = useGetLotteryEventsQuery(undefined, {
    pollingInterval: 15000,
  });
  const { data: ticketsData } = useGetMyLotteryTicketsQuery();
  const { currentData: winnersData, isFetching: winnersLoading, isError: winnersError, refetch: refreshWinners } = useGetLotteryWinnersQuery(winnerPage, {
    pollingInterval: tab === "winners" ? 15000 : 0,
    refetchOnMountOrArgChange: true,
  });

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
        {tab === "winners" && <div className="space-y-4">
          <div className="flex items-center justify-between gap-3"><div><h1 className="text-xl font-black">Lottery winners</h1><p className="mt-1 text-sm text-white/45">{winnersData?.data.total ?? 0} winning tickets announced</p></div><button onClick={() => void refreshWinners()} disabled={winnersLoading} className="rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-50">{winnersLoading ? "Refreshing…" : "Refresh"}</button></div>
          {winnersError ? <p role="alert" className="rounded-2xl border border-red-400/20 p-5 text-red-300">Could not load results. Please try Refresh.</p> : !winnersData && winnersLoading ? <p role="status" className="p-8 text-center text-white/50">Loading winners…</p> : <LotteryWinnersList winners={winners} />}
          {(winnerPage > 1 || (winnersData?.data.pages ?? 0) > 1) && <nav aria-label="Winner list pages" className="flex items-center justify-center gap-4">
            <button disabled={winnerPage <= 1 || winnersLoading} onClick={() => setWinnerPage(p => p - 1)} className="rounded-xl border border-white/15 px-4 py-2 disabled:opacity-40">Previous</button>
            <span className="text-sm text-white/60">Page {winnerPage}{winnersData ? ` of ${Math.max(1, winnersData.data.pages)}` : ""}</span>
            <button disabled={winnersLoading || !winnersData || winnerPage >= winnersData.data.pages} onClick={() => setWinnerPage(p => p + 1)} className="rounded-xl border border-white/15 px-4 py-2 disabled:opacity-40">Next</button>
          </nav>}
        </div>}
      </div>
    </main>
  );
}
