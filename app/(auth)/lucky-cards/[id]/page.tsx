"use client";

/* ────────── client lucky card scratch page imports ────────── */
import ScratchCard from "@/components/lucky-card/ScratchCard";
import { usdt } from "@/components/lucky-card/LuckyCardClientComponents";
import {
  useGetMyLuckyCardsQuery,
  useOpenLuckyCardMutation,
} from "@/redux/features/lucky-card/luckyCardApi";
import confetti from "canvas-confetti";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ScratchLuckyCardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useGetMyLuckyCardsQuery();
  const [openCard] = useOpenLuckyCardMutation();

  const [result, setResult] = useState<any>(null);
  const [modal, setModal] = useState(false);
  const opening = useRef(false);

  const cards = data?.cards ?? [];
  const card = useMemo(() => cards.find((c) => c._id === id), [cards, id]);
  const queue = useMemo(
    () => cards.filter((c) => c.status === "unopened" && c._id !== id).map((c) => c._id),
    [cards, id],
  );

  useEffect(() => {
    if (card && card.status === "opened" && !result) {
      setResult(card);
      setModal(true);
    }
  }, [card, result]);

  const fetchResult = useCallback(async () => {
    if (opening.current || (card && card.status === "opened")) return;
    opening.current = true;
    try {
      const res = await openCard(id).unwrap();
      setResult(res.card);
      if (res.card.win) {
        confetti({ particleCount: 130, spread: 75, origin: { y: 0.6 } });
      }
    } catch (e: any) {
      toast.error(e?.data?.message || e?.data?.error || "Failed to open");
      opening.current = false;
    }
  }, [card, id, openCard]);

  const nextCard = () => {
    if (queue[0]) {
      router.push(`/lucky-cards/${queue[0]}`);
      setResult(null);
      setModal(false);
      opening.current = false;
    } else {
      router.push("/lucky-cards");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0D12]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
      </main>
    );
  }

  if (!card) {
    return (
      <main className="min-h-screen bg-[#0B0D12] p-6 text-[#E6E6E6]">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0E1014] p-6 text-center text-sm text-white/50">
          Card not found.{" "}
          <button className="font-bold text-emerald-300" onClick={() => router.push("/lucky-cards")}>
            Go back
          </button>
        </div>
      </main>
    );
  }

  const win = !!result?.win;
  const amount = Number(result?.prizeAmount || 0);
  const symbol = result?.revealSymbol || "🪙";
  const prizeCode = result?.prizeCode || "";
  const prizeLabel = result?.prizeLabel || "";
  const noWinEmoji = symbol && symbol !== "🙁" ? symbol : "🍀";
  const noWinText = prizeLabel && prizeLabel !== "No win" ? prizeLabel : "Good luck! Try again";

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 p-4 pt-8 md:p-6">
        <div className="text-center">
          <p className="text-lg font-black" style={{ color: card.accent }}>
            {card.cardType}
          </p>
          <p className="text-xs text-white/45">Scratch with your finger to reveal the prize</p>
        </div>

        <div className="w-full max-w-[340px]">
          <ScratchCard
            accent={card.accent}
            disabled={card.status === "opened"}
            onFirstScratch={fetchResult}
            onComplete={() => setModal(true)}
          >
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="text-5xl">{result ? (win ? symbol : noWinEmoji) : "❔"}</span>
              {result ? (
                win ? (
                  <>
                    <span className="text-4xl font-black text-emerald-400 drop-shadow">
                      {usdt(amount)}
                    </span>
                    <span className="text-xs text-white/45">
                      {prizeLabel || "You won"}
                      {prizeCode ? ` · ${prizeCode}` : ""}
                    </span>
                  </>
                ) : (
                  <span className="px-3 text-center text-base font-bold text-white/70">
                    {noWinText}
                  </span>
                )
              ) : (
                <span className="text-sm text-white/40">Start scratching…</span>
              )}
            </div>
          </ScratchCard>
        </div>

        {card.status === "opened" && result && (
          <div className="w-full space-y-3">
            <div className="rounded-2xl border border-white/10 bg-[#0E1014] p-4 text-center">
              {win ? (
                <>
                  <p className="text-2xl font-black text-emerald-400">{usdt(amount)} 🎉</p>
                  <p className="mt-0.5 text-xs font-bold text-amber-300">
                    {prizeLabel} {prizeCode ? `(${prizeCode})` : ""}
                  </p>
                </>
              ) : (
                <p className="text-base font-bold text-white/70">
                  {noWinEmoji} {noWinText}
                </p>
              )}
              {win && <p className="mt-1 text-[11px] text-white/40">Added to your balance</p>}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push("/lucky-cards")}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-bold text-white/80"
              >
                All Cards
              </button>
              {queue.length > 0 && (
                <button
                  onClick={nextCard}
                  className="flex-1 rounded-xl bg-emerald-400 py-3 text-sm font-black text-black"
                >
                  Next Card ({queue.length})
                </button>
              )}
            </div>
          </div>
        )}

        {modal && card.status === "opened" && result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
            <div className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-[#0b0f24] p-6 text-center">
              <div className="mb-3 text-5xl">{win ? "🎉" : noWinEmoji}</div>
              <h3 className="text-lg font-black text-white">{win ? "Congratulations!" : "Thanks!"}</h3>
              {win ? (
                <>
                  <p className="mt-1 text-3xl font-black text-emerald-400">{usdt(amount)}</p>
                  {prizeLabel && (
                    <p className="mt-0.5 text-xs font-bold text-amber-300">
                      {prizeLabel} {prizeCode ? `(${prizeCode})` : ""}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-1 text-sm font-bold text-white/70">{noWinText}</p>
              )}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setModal(false)}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-white/80"
                >
                  Close
                </button>
                {queue.length > 0 && (
                  <button
                    onClick={nextCard}
                    className="flex-1 rounded-xl bg-emerald-400 py-2.5 text-sm font-black text-black"
                  >
                    Next Card
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
