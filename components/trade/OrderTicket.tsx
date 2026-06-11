"use client";
import { useGetMyAccountsQuery } from "@/redux/features/account/accountApi";
import { useOpenDemoOrderMutation } from "@/redux/features/trade/tradeApi";
import { setTicketOpen, setVolume } from "@/redux/features/trade/tradeSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function OrderTicket() {
  const open = useSelector((s: any) => s.trade.ticketOpen);
  const { symbol, volume, quote } = useSelector((s: any) => s.trade);
  const dispatch = useDispatch();
  const [openOrder, { isLoading }] = useOpenDemoOrderMutation();
  const { data } = useGetMyAccountsQuery();
  const demo = (data?.items ?? []).find(
    (a) => a.status === "active" && a.mode === "demo"
  );
  const router = useRouter();

  if (!open) return null;
  const price = quote ? (quote.bid + quote.ask) / 2 : 0;

  const changeVol = (d: number) => {
    const next = +Math.max(0.01, volume + d).toFixed(2);
    dispatch(setVolume(next));
  };

  const confirm = async (side: "buy" | "sell") => {
    if (!demo || !quote) return;
    await openOrder({
      accountId: demo._id,
      symbol,
      side,
      volume,
      price,
    }).unwrap();
    dispatch(setTicketOpen(false));
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => dispatch(setTicketOpen(false))}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl">
        <div className="py-1 flex justify-center">
          <span className="w-12 h-1 rounded-full bg-neutral-700" />
        </div>

        <div className="px-4 pb-4">
          <div className="text-center text-neutral-400">Regular</div>

          {/* Volume */}
          <div className="mt-3 text-sm">Volume</div>
          <div className="mt-2 flex items-center gap-2">
            <button
              className="w-10 h-10 rounded bg-neutral-800"
              onClick={() => changeVol(-0.01)}
            >
              -
            </button>
            <div className="grow text-center text-2xl">{volume.toFixed(2)}</div>
            <button
              className="w-10 h-10 rounded bg-neutral-800"
              onClick={() => changeVol(+0.01)}
            >
              +
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              disabled={isLoading}
              onClick={() => confirm("sell")}
              className="rounded-xl bg-red-500/90 py-3 text-white font-semibold disabled:opacity-60"
            >
              Confirm Sell {volume.toFixed(2)} lots {quote?.bid?.toFixed(3)}
            </button>
            <button
              disabled={isLoading}
              onClick={() => confirm("buy")}
              className="rounded-xl bg-blue-500 py-3 text-white font-semibold disabled:opacity-60"
            >
              Confirm Buy {volume.toFixed(2)} lots {quote?.ask?.toFixed(3)}
            </button>
          </div>

          <div className="mt-3 text-xs text-neutral-400">
            Fees: ~ 0.11 USD | Margin: 18.44 USD (1:200)
          </div>
        </div>
      </div>
    </div>
  );
}
