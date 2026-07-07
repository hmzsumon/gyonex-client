"use client";

/* ────────── client lottery component imports ────────── */
import { useBuyLotteryTicketsMutation } from "@/redux/features/lottery/lotteryApi";
import type {
  LotteryEvent,
  LotteryEventType,
  LotteryTicket,
  LotteryWinner,
} from "@/redux/features/lottery/lotteryTypes";
import { motion } from "framer-motion";
import { Calendar, Clock, Gift, Ticket, Trophy, Users } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import toast from "react-hot-toast";

/* ────────── client lottery event label config ────────── */
const EVENT_LABEL: Record<LotteryEventType, string> = {
  WEEKLY: "Weekly Draw",
  HALF_MONTHLY: "15 Days Draw",
  MONTHLY: "Monthly Draw",
};

/* ────────── client lottery date formatter helper ────────── */
const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

/* ────────── client lottery money formatter helper ────────── */
const formatMoney = (amount?: number, asset = "USDT") =>
  `${Number(amount ?? 0).toLocaleString("en-US")} ${asset}`;

/* ────────── client lottery api message resolver helper ────────── */
const getApiMessage = (error: any, fallback: string) =>
  error?.data?.error ||
  error?.data?.message ||
  error?.error ||
  error?.message ||
  fallback;

/* ────────── client lottery hero component ────────── */
export function LotteryHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E1014] p-5 shadow-2xl shadow-black/20 md:p-7">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative z-10">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
          <Gift className="h-4 w-4" /> Smart Lottery
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
          Weekly, 15 Days & Monthly Draw
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
          Buy multiple tickets from any active event. Every ticket gives another
          chance to win the prize.
        </p>
      </div>
    </div>
  );
}

/* ────────── client lottery tabs component ────────── */
export function LotteryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: "events" | "tickets" | "winners") => void;
}) {
  const tabs = [
    { id: "events", label: "Events" },
    { id: "tickets", label: "My Tickets" },
    { id: "winners", label: "Winners" },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#0E1014] p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-xl py-3 text-xs font-black transition ${active === tab.id ? "bg-emerald-400 text-black" : "text-white/55 hover:bg-white/[0.05] hover:text-white"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ────────── client lottery event list component ────────── */
export function LotteryEventList({
  events,
  loading,
}: {
  events: LotteryEvent[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-3xl bg-white/[0.04]"
          />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <LotteryEmpty
        title="No active lottery found"
        text="Please check back later for new draw events."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {events.map((event) => (
        <LotteryEventCard key={event._id} event={event} />
      ))}
    </div>
  );
}

/* ────────── client lottery event card component ────────── */
function LotteryEventCard({ event }: { event: LotteryEvent }) {
  const [qty, setQty] = useState(1);
  const [buyTickets, buyState] = useBuyLotteryTicketsMutation();
  const totalCost = useMemo(
    () => qty * Number(event.ticketPrice ?? 0),
    [qty, event.ticketPrice],
  );
  const sold = Number(event.soldTickets ?? 0);
  const progress = event.maxTickets
    ? Math.min(100, (sold / event.maxTickets) * 100)
    : 0;

  const handleBuy = async () => {
    try {
      const res = await buyTickets({
        lotteryId: event._id,
        quantity: qty,
      }).unwrap();
      toast.success(res?.message || "Lottery ticket purchased successfully");
      setQty(1);
    } catch (error: any) {
      toast.error(getApiMessage(error, "Failed to buy lottery ticket"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-[#0E1014] shadow-2xl shadow-black/20"
    >
      <div className="bg-gradient-to-br from-emerald-400/15 via-white/[0.03] to-transparent p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
              <Clock className="h-3 w-3" /> {EVENT_LABEL[event.eventType]}
            </span>
            <h2 className="mt-3 truncate text-xl font-black text-white">
              {event.title}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-white/45">
              {event.description || "Buy tickets and join this lottery event."}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold uppercase text-white/40">
              Prize
            </p>
            <p className="mt-1 text-xl font-black text-emerald-300">
              {formatMoney(event.prizeAmount, event.prizeAsset)}
            </p>
            <p className="mt-1 text-[10px] font-bold text-white/35">
              {event.prizeTiers?.length ?? 0} prize tiers
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <LotteryInfo
            icon={<Ticket />}
            label="Ticket"
            value={formatMoney(event.ticketPrice, event.prizeAsset)}
          />
          <LotteryInfo
            icon={<Users />}
            label="Sold"
            value={`${sold}/${event.maxTickets}`}
          />
          <LotteryInfo
            icon={<Calendar />}
            label="Draw"
            value={formatDate(event.drawDate)}
          />
          <LotteryInfo
            icon={<Trophy />}
            label="My Tickets"
            value={String(event.myTickets ?? 0)}
          />
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* ────────── client lottery prize tier preview section ────────── */}
        <div className="grid gap-2 sm:grid-cols-2">
          {(event.prizeTiers?.length
            ? event.prizeTiers
            : [
                {
                  title: "Prize",
                  quantity: event.winnerCount,
                  amount: event.prizeAmount,
                },
              ]
          )
            .slice(0, 6)
            .map((prize, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs"
              >
                <span className="font-black text-white/75">
                  {prize.title} × {prize.quantity}
                </span>
                <span className="font-black text-emerald-300">
                  {formatMoney(prize.amount, event.prizeAsset)}
                </span>
              </div>
            ))}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-white/45">
            <span>Ticket capacity</span>
            <span className="font-bold text-white">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:w-36">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-12 text-xl font-black text-white"
            >
              −
            </button>
            <input
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(100, Number(e.target.value || 1))))
              }
              className="w-full bg-transparent text-center font-black text-white outline-none"
            />
            <button
              onClick={() => setQty(Math.min(100, qty + 1))}
              className="w-12 text-xl font-black text-white"
            >
              +
            </button>
          </div>
          <button
            onClick={handleBuy}
            disabled={buyState.isLoading || event.status !== "open"}
            className="h-12 flex-1 rounded-2xl bg-emerald-400 px-4 text-sm font-black text-black disabled:opacity-50"
          >
            {buyState.isLoading
              ? "Buying..."
              : `Buy ${qty} Ticket${qty > 1 ? "s" : ""} · ${formatMoney(totalCost, event.prizeAsset)}`}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────── client lottery tickets list component ────────── */
export function LotteryTicketsList({ tickets }: { tickets: LotteryTicket[] }) {
  if (!tickets.length)
    return (
      <LotteryEmpty
        title="No tickets yet"
        text="Buy tickets from active events to see them here."
      />
    );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tickets.map((ticket) => (
        <LotteryTicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
}

/* ────────── client lottery smart ticket card component ────────── */
function LotteryTicketCard({ ticket }: { ticket: LotteryTicket }) {
  const isWinner = ticket.status === "winner";
  const isExpired = ["expired", "cancelled", "refunded"].includes(
    ticket.status,
  );

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-[#0E1014] shadow-2xl shadow-black/20 ${isWinner ? "border-amber-300/35" : isExpired ? "border-rose-400/25 opacity-75" : "border-emerald-400/25"}`}
    >
      {/* ────────── client ticket decorative cutouts section ────────── */}
      <span className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#0B0D12]" />
      <span className="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#0B0D12]" />
      <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/10" />

      {/* ────────── client ticket top content section ────────── */}
      <div className="relative bg-gradient-to-br from-emerald-400/15 via-white/[0.03] to-transparent p-5 pb-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
              Lottery Ticket
            </p>
            <h3 className="mt-2 line-clamp-1 text-lg font-black text-white">
              {ticket.eventId?.title || "Lottery Event"}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${isWinner ? "bg-amber-300 text-black" : isExpired ? "bg-rose-400/15 text-rose-300" : "bg-emerald-400/15 text-emerald-300"}`}
          >
            {isExpired ? "Expired" : ticket.status}
          </span>
        </div>
      </div>

      {/* ────────── client ticket number and meta section ────────── */}
      <div className="relative space-y-4 p-5 pt-7">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
            Ticket Number
          </p>
          <p className="mt-2 break-all font-mono text-lg font-black tracking-wider text-white">
            {ticket.ticketNo}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.03] p-3">
            <p className="text-[10px] font-bold uppercase text-white/35">
              Price
            </p>
            <p className="mt-1 text-sm font-black text-emerald-300">
              {formatMoney(ticket.price, ticket.asset)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-3">
            <p className="text-[10px] font-bold uppercase text-white/35">
              Draw Date
            </p>
            <p className="mt-1 text-sm font-black text-white">
              {formatDate(ticket.eventId?.drawDate)}
            </p>
          </div>
        </div>

        {isExpired && (
          <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs font-bold text-rose-200">
            This ticket is invalid for future draw because the event has already
            been completed or closed.
          </p>
        )}
      </div>
    </div>
  );
}

/* ────────── client lottery winners list component ────────── */
export function LotteryWinnersList({ winners }: { winners: LotteryWinner[] }) {
  if (!winners.length)
    return (
      <LotteryEmpty
        title="No winners announced"
        text="Winner list will appear after draw completion."
      />
    );

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {winners.map((winner) => (
        <div
          key={winner._id}
          className="rounded-2xl border border-amber-300/20 bg-[#0E1014] p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="font-black text-white">{winner.maskedName}</p>
              <p className="text-xs text-white/45">
                {winner.prizeTitle || "Prize"} · {winner.ticketNo}
              </p>
            </div>
            <p className="ml-auto text-sm font-black text-amber-200">
              {formatMoney(winner.prizeAmount, winner.prizeAsset)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────── client lottery small info component ────────── */
function LotteryInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-white/40 [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
        <span className="text-[10px] font-bold uppercase">{label}</span>
      </div>
      <p className="truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}

/* ────────── client lottery empty state component ────────── */
function LotteryEmpty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0E1014] px-6 py-14 text-center">
      <Gift className="mx-auto h-12 w-12 text-white/15" />
      <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/45">{text}</p>
    </div>
  );
}
