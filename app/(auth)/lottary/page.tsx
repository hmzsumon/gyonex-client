"use client";

import { formatUSD } from "@/lib/format";
import {
  useBuyLotteryTicketsMutation,
  useGetActiveLotteryQuery,
  useGetLotteryWinnersQuery,
  useGetMyLotteryTicketsQuery,
} from "@/redux/features/lottery/lotteryApi";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  Sparkles,
  Ticket,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────── */
const TICKET_PRICE = 5; // $5 USDT — fixed

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────── */

/**
 * Returns the next two upcoming draw dates (1st and 15th of each month, 20:00).
 * Always computed fresh so the list is never stale.
 */
function getNextDrawDates(): Date[] {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth();

  // Generate candidates: 15th this month, 1st next month, 15th next month
  const candidates = [
    new Date(yr, mo, 15, 20, 0, 0),
    new Date(yr, mo + 1, 1, 20, 0, 0),
    new Date(yr, mo + 1, 15, 20, 0, 0),
  ];

  return candidates.filter((d) => d > now).slice(0, 2);
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function formatLongDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   Countdown — ticks every second toward the next draw date
───────────────────────────────────────────────────────────────────────── */
function Countdown({ drawDate }: { drawDate: string }) {
  const calc = useCallback(() => {
    const ms = Math.max(0, new Date(drawDate).getTime() - Date.now());

    return {
      days: Math.floor(ms / 86_400_000),
      hours: Math.floor((ms % 86_400_000) / 3_600_000),
      mins: Math.floor((ms % 3_600_000) / 60_000),
      secs: Math.floor((ms % 60_000) / 1_000),
      over: ms === 0,
    };
  }, [drawDate]);

  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1_000);
    return () => clearInterval(id);
  }, [calc]);

  const units: [number, string][] = [
    [t.days, "Days"],
    [t.hours, "Hrs"],
    [t.mins, "Min"],
    [t.secs, "Sec"],
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map(([v, l]) => (
        <div
          key={l}
          className="flex flex-col items-center rounded-xl px-3 py-2.5 min-w-[58px]"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-2)",
          }}
        >
          <motion.span
            key={v}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="text-2xl font-black font-num leading-none tabular-nums"
            style={{ color: "var(--text-1)" }}
          >
            {String(v).padStart(2, "0")}
          </motion.span>

          <span
            className="text-[9px] font-bold tracking-widest mt-1 uppercase"
            style={{ color: "var(--text-3)" }}
          >
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Toast
───────────────────────────────────────────────────────────────────────── */
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      className="fixed top-14 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl"
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${
          ok ? "rgba(9,212,125,0.4)" : "rgba(240,80,75,0.4)"
        }`,
        color: ok ? "var(--profit)" : "var(--loss)",
      }}
    >
      {ok ? (
        <CheckCircle className="w-4 h-4 shrink-0" />
      ) : (
        <AlertTriangle className="w-4 h-4 shrink-0" />
      )}
      {msg}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────────── */
type TabId = "main" | "myTickets" | "winners";

export default function LotteryPage() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabId>("main");
  const [winnersPage, setWP] = useState(1);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3_500);
  };

  /* ─────────────────────────────────────────────────────────────
     Redux queries
     Lottery page এখন RTK Query ব্যবহার করছে।
  ───────────────────────────────────────────────────────────── */
  const { data: activeData, isLoading } = useGetActiveLotteryQuery(undefined, {
    pollingInterval: 10_000,
  });

  const { data: myData } = useGetMyLotteryTicketsQuery();

  const { data: winnersData } = useGetLotteryWinnersQuery(winnersPage);

  /* ── Derived data ── */
  const lottery = activeData?.data?.lottery;
  const totalTickets = activeData?.data?.totalTickets ?? 0;
  const myTickets = activeData?.data?.myTickets ?? 0;
  const myHistory = myData?.data ?? [];
  const winners = winnersData?.data?.winners ?? [];
  const totalWinners = winnersData?.data?.total ?? 0;
  const totalPages = winnersData?.data?.pages ?? 1;

  /* ─────────────────────────────────────────────────────────────
     Redux mutation: buy lottery ticket
     Success হলে tag invalidation দিয়ে active lottery, my tickets,
     wallet data auto refresh হবে।
  ───────────────────────────────────────────────────────────── */
  const [buyLotteryTickets, buyMutation] = useBuyLotteryTicketsMutation();

  const handleBuyTickets = async () => {
    try {
      if (!lottery?._id) {
        throw new Error("No active lottery found");
      }

      await buyLotteryTickets({
        lotteryId: lottery._id,
        quantity: qty,
      }).unwrap();
      showToast(`${qty} ticket${qty > 1 ? "s" : ""} purchased! Good luck! 🎟️`);
    } catch (e: any) {
      showToast(e?.data?.message ?? e?.message ?? "Purchase failed", false);
    }
  };

  /* ── Derived values ── */
  const totalCost = TICKET_PRICE * qty;
  const nextDraws = getNextDrawDates();

  /* ── Qty helpers ── */
  const changeQty = (n: number) => setQty(Math.max(1, Math.min(100, n)));
  const QUICK_QTY = [1, 2, 5, 10, 20, 50] as const;

  /* ─────────────────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────────────────── */
  return (
    <div className="p-5 space-y-5 max-w-4xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-base font-black flex items-center gap-2"
            style={{ color: "var(--text-1)" }}
          >
            <Gift className="w-5 h-5" style={{ color: "var(--warning)" }} />
            Lottery
          </h1>

          <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
            $5 per ticket · One lucky winner · Draws on 1st &amp; 15th
          </p>
        </div>

        {/* Upcoming draw date pills */}
        <div className="flex gap-2 flex-wrap justify-end">
          {nextDraws.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
              style={{
                background: "var(--warning-dim)",
                border: "1px solid rgba(245,183,49,0.2)",
                color: "var(--warning)",
              }}
            >
              <Calendar className="w-3 h-3" />
              {formatShortDate(d)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="tab-bar flex">
        {(
          [
            ["main", "Current Draw"],
            ["myTickets", "My Tickets"],
            ["winners", "All Winners"],
          ] as [TabId, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`tab ${tab === id ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB: CURRENT DRAW
      ════════════════════════════════════════════════════════ */}
      {tab === "main" && (
        <div className="space-y-4">
          {isLoading ? (
            <>
              <div className="h-56 skeleton rounded-2xl" />
              <div className="h-24 skeleton rounded-2xl" />
              <div className="h-64 skeleton rounded-2xl" />
            </>
          ) : !lottery ? (
            /* No active lottery */
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-12 text-center"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-1)",
              }}
            >
              <Gift
                className="w-14 h-14 mx-auto mb-4 opacity-20"
                style={{ color: "var(--warning)" }}
              />

              <p
                className="text-base font-bold mb-2"
                style={{ color: "var(--text-1)" }}
              >
                No Active Lottery
              </p>

              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                The next lottery opens on the{" "}
                {nextDraws[0] ? formatShortDate(nextDraws[0]) : "1st or 15th"}.
                Check back then!
              </p>

              {nextDraws[0] && (
                <div className="mt-5 flex justify-center">
                  <Countdown drawDate={nextDraws[0].toISOString()} />
                </div>
              )}
            </motion.div>
          ) : (
            <>
              {/* Prize banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 relative overflow-hidden text-center"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--warning) 14%, var(--bg-card)), var(--bg-card))",
                  border: "1px solid rgba(245,183,49,0.25)",
                }}
              >
                {/* Glow blob */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 blur-[70px] opacity-15"
                    style={{ background: "var(--warning)" }}
                  />
                </div>

                <div className="relative">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: "var(--warning)" }}
                  >
                    🏆 Grand Prize
                  </p>

                  <p
                    className="text-5xl font-black font-num leading-none mb-1"
                    style={{ color: "var(--text-1)" }}
                  >
                    {formatUSD(lottery.prizeAmount)}
                  </p>

                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: "var(--text-2)" }}
                  >
                    {lottery.prizeAsset}
                  </p>

                  {lottery.description && (
                    <p
                      className="text-xs mt-3 max-w-sm mx-auto leading-relaxed"
                      style={{ color: "var(--text-3)" }}
                    >
                      {lottery.description}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["🎫", "Ticket Price", `$${TICKET_PRICE} USDT`],
                    ["🎟️", "Tickets Sold", String(totalTickets)],
                    ["⭐", "My Tickets", String(myTickets)],
                  ] as [string, string, string][]
                ).map(([icon, label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl p-3.5 text-center"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-1)",
                    }}
                  >
                    <div className="text-2xl mb-1.5">{icon}</div>

                    <p
                      className="text-[10px] font-medium mb-0.5"
                      style={{ color: "var(--text-3)" }}
                    >
                      {label}
                    </p>

                    <p
                      className="text-sm font-black font-num"
                      style={{ color: "var(--text-1)" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Countdown card */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-1)",
                }}
              >
                <p
                  className="text-xs font-bold mb-4 flex items-center gap-2"
                  style={{ color: "var(--text-1)" }}
                >
                  <Clock
                    className="w-4 h-4"
                    style={{ color: "var(--brand)" }}
                  />
                  Draw Countdown
                </p>

                <Countdown drawDate={lottery.drawDate} />

                <p
                  className="text-[10px] mt-3"
                  style={{ color: "var(--text-3)" }}
                >
                  Draw date:{" "}
                  <strong style={{ color: "var(--text-1)" }}>
                    {formatLongDate(new Date(lottery.drawDate))}
                  </strong>
                </p>
              </div>

              {/* Buy tickets card */}
              <div
                className="rounded-2xl p-5 space-y-4"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(245,183,49,0.2)",
                }}
              >
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--text-1)" }}
                >
                  Buy Tickets
                </p>

                {/* Quick-select buttons */}
                <div>
                  <p
                    className="text-[11px] font-semibold mb-2"
                    style={{ color: "var(--text-2)" }}
                  >
                    Select quantity
                  </p>

                  <div className="flex gap-2 flex-wrap mb-3">
                    {QUICK_QTY.map((n) => (
                      <button
                        key={n}
                        onClick={() => changeQty(n)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background:
                            qty === n ? "var(--warning)" : "var(--bg-elevated)",
                          color: qty === n ? "#0D0A00" : "var(--text-2)",
                          border: `1px solid ${
                            qty === n ? "var(--warning)" : "var(--border-1)"
                          }`,
                        }}
                      >
                        {n}×
                      </button>
                    ))}
                  </div>

                  {/* Manual stepper */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeQty(qty - 1)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg select-none"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-1)",
                        color: "var(--text-1)",
                      }}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={qty}
                      min={1}
                      max={100}
                      onChange={(e) => changeQty(parseInt(e.target.value) || 1)}
                      className="flex-1 input-field text-center text-lg font-black"
                      aria-label="Ticket quantity"
                    />

                    <button
                      onClick={() => changeQty(qty + 1)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg select-none"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-1)",
                        color: "var(--text-1)",
                      }}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cost summary */}
                <div
                  className="rounded-xl p-3.5 space-y-2"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-3)" }}>Ticket price</span>
                    <span style={{ color: "var(--text-1)" }}>
                      ${TICKET_PRICE} × {qty}
                    </span>
                  </div>

                  <div
                    className="flex justify-between text-sm font-bold"
                    style={{
                      borderTop: "1px solid var(--border-1)",
                      paddingTop: "8px",
                    }}
                  >
                    <span style={{ color: "var(--text-1)" }}>Total</span>
                    <span
                      className="font-num"
                      style={{ color: "var(--warning)" }}
                    >
                      ${totalCost.toFixed(2)} USDT
                    </span>
                  </div>
                </div>

                {/* Buy button */}
                <button
                  onClick={handleBuyTickets}
                  disabled={buyMutation.isLoading}
                  className="btn w-full btn-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--warning), #F97316)",
                    color: "#0D0A00",
                    boxShadow: "0 4px 20px rgba(245,183,49,0.35)",
                  }}
                >
                  {buyMutation.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Buy {qty} Ticket{qty > 1 ? "s" : ""} ·{" "}
                      {formatUSD(totalCost)}
                    </>
                  )}
                </button>

                <p
                  className="text-center text-[10px]"
                  style={{ color: "var(--text-3)" }}
                >
                  By purchasing, you agree to the lottery terms. Winner drawn
                  automatically on the draw date.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: MY TICKETS
      ════════════════════════════════════════════════════════ */}
      {tab === "myTickets" && (
        <div className="space-y-3">
          {myHistory.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-1)",
              }}
            >
              <Ticket
                className="w-12 h-12 mx-auto mb-3 opacity-20"
                style={{ color: "var(--brand)" }}
              />

              <p
                className="text-sm font-bold mb-1"
                style={{ color: "var(--text-1)" }}
              >
                No tickets yet
              </p>

              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                Purchase tickets from the Current Draw tab
              </p>
            </div>
          ) : (
            myHistory.map(
              (item: {
                _id: string;
                title: string;
                prizeAmount: number;
                prizeAsset: string;
                ticketPrice: number;
                drawDate: string;
                status: string;
                myTickets: number;
                isWinner: boolean;
                winner?: { maskedName: string; country: string };
              }) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 flex items-center gap-4"
                  style={{
                    background: item.isWinner
                      ? "color-mix(in srgb, var(--warning) 8%, var(--bg-card))"
                      : "var(--bg-card)",
                    border: `1.5px solid ${
                      item.isWinner
                        ? "rgba(245,183,49,0.35)"
                        : "var(--border-1)"
                    }`,
                  }}
                >
                  <div className="text-3xl">{item.isWinner ? "🏆" : "🎟️"}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p
                        className="text-sm font-bold truncate"
                        style={{ color: "var(--text-1)" }}
                      >
                        {item.title}
                      </p>

                      <span
                        className={`badge pill text-[10px] ${
                          item.status === "drawn"
                            ? "badge-muted"
                            : item.status === "open"
                              ? "badge-brand"
                              : "badge-warning"
                        }`}
                      >
                        {item.status}
                      </span>

                      {item.isWinner && (
                        <span className="badge pill badge-warning text-[10px]">
                          🎉 Winner!
                        </span>
                      )}
                    </div>

                    <div
                      className="flex items-center gap-3 text-[11px] flex-wrap"
                      style={{ color: "var(--text-3)" }}
                    >
                      <span>
                        Prize:{" "}
                        <strong style={{ color: "var(--warning)" }}>
                          {formatUSD(item.prizeAmount)}
                        </strong>
                      </span>

                      <span>
                        My tickets:{" "}
                        <strong style={{ color: "var(--text-1)" }}>
                          {item.myTickets}
                        </strong>
                      </span>

                      <span>
                        {new Date(item.drawDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className="text-sm font-black font-num"
                      style={{ color: "var(--text-1)" }}
                    >
                      {item.myTickets}×
                    </p>

                    <p
                      className="text-[10px]"
                      style={{ color: "var(--text-3)" }}
                    >
                      tickets
                    </p>
                  </div>
                </motion.div>
              ),
            )
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: ALL WINNERS
      ════════════════════════════════════════════════════════ */}
      {tab === "winners" && (
        <div className="space-y-4">
          <div className="card overflow-hidden">
            {/* Card header */}
            <div
              className="px-5 py-3.5 flex items-center gap-2"
              style={{ borderBottom: "1px solid var(--border-1)" }}
            >
              <Trophy className="w-4 h-4" style={{ color: "var(--warning)" }} />

              <span
                className="text-xs font-bold"
                style={{ color: "var(--text-1)" }}
              >
                All Winners ({totalWinners})
              </span>
            </div>

            {/* Column headers */}
            <div
              className="grid px-5 py-2.5 text-[10px] font-semibold"
              style={{
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                color: "var(--text-3)",
                borderBottom: "1px solid var(--border-1)",
              }}
            >
              <span>Lottery</span>
              <span>Winner</span>
              <span>Prize</span>
              <span>Draw Date</span>
            </div>

            {/* Rows */}
            {winners.length === 0 ? (
              <div
                className="py-10 text-center text-xs"
                style={{ color: "var(--text-3)" }}
              >
                No draws have taken place yet
              </div>
            ) : (
              winners.map(
                (
                  w: {
                    _id: string;
                    title: string;
                    winnerName: string;
                    winnerCountry: string;
                    prizeAmount: number;
                    prizeAsset: string;
                    drawDate: string;
                    totalTickets: number;
                  },
                  i: number,
                ) => (
                  <motion.div
                    key={w._id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid items-center px-5 py-3.5 trow tdiv"
                    style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr" }}
                  >
                    <div>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "var(--text-1)" }}
                      >
                        {w.title}
                      </p>

                      <p
                        className="text-[10px]"
                        style={{ color: "var(--text-3)" }}
                      >
                        {w.totalTickets} tickets sold
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{w.winnerCountry}</span>

                      <p
                        className="text-xs font-semibold font-mono"
                        style={{ color: "var(--text-1)" }}
                      >
                        {w.winnerName}
                      </p>
                    </div>

                    <p
                      className="text-sm font-black font-num"
                      style={{ color: "var(--warning)" }}
                    >
                      {formatUSD(w.prizeAmount)}
                    </p>

                    <p
                      className="text-[11px]"
                      style={{ color: "var(--text-3)" }}
                    >
                      {new Date(w.drawDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </motion.div>
                ),
              )
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                Page {winnersPage} of {totalPages} · {totalWinners} total
                winners
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWP((p) => Math.max(1, p - 1))}
                  disabled={winnersPage === 1}
                  className="btn btn-ghost btn-sm disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                {/* Page number buttons */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = winnersPage <= 3 ? i + 1 : winnersPage + i - 2;

                    if (p < 1 || p > totalPages) return null;

                    return (
                      <button
                        key={p}
                        onClick={() => setWP(p)}
                        className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background:
                            p === winnersPage
                              ? "var(--brand)"
                              : "var(--bg-elevated)",
                          color: p === winnersPage ? "white" : "var(--text-2)",
                          border: "1px solid var(--border-1)",
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setWP((p) => Math.min(totalPages, p + 1))}
                  disabled={winnersPage === totalPages}
                  className="btn btn-ghost btn-sm disabled:opacity-40"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
