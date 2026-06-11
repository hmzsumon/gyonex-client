// components/trade/OrderForm.tsx
import {
  useGetSpotBalancesQuery,
  usePlaceBinanceOrderMutation,
} from "@/redux/features/binance-trade/binance-tradeApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { Side } from "./TradeLayout";

// Amount থেকে ফি = amount * 0.000075
const FEE_RATE = 0.000075; // 0.0075%
const MIN_NOTIONAL = 5; // ✅ Minimum total (USDT)

interface OrderFormProps {
  side: Side;
  symbol: string;
  lastPrice: string | null;
}

const OrderForm: React.FC<OrderFormProps> = ({ side, symbol, lastPrice }) => {
  const { user } = useSelector((state: any) => state.auth);

  const [amount, setAmount] = useState<string>("");
  const [slider, setSlider] = useState<number>(0);

  const [placeOrder, { isLoading }] = usePlaceBinanceOrderMutation();

  // base = ACM, BTC, AAVE ...
  const baseAsset = symbol.endsWith("USDT")
    ? symbol.replace("USDT", "")
    : symbol;
  // quote = USDT (আমাদের কেসে)
  const quoteAsset = symbol.endsWith("USDT") ? "USDT" : symbol.slice(-3);
  const normalizedSymbol = symbol.toUpperCase();

  const isBuy = side === "buy";

  // 👉 Redux থেকে ব্যালান্স (USDT balance = quoteAvailable)
  const quoteAvailable = Number(user?.m_balance ?? 0); // Avbl USDT

  // 👉 Spot wallet balances (SELL এর জন্য)
  const { data: spotBalances, isLoading: isBalancesLoading } =
    useGetSpotBalancesQuery(undefined, {
      skip: !user?._id,
    });

  const baseAvailable =
    spotBalances?.find((w: any) => w.symbol === normalizedSymbol)?.qty ?? 0;

  // symbol change হলে ফর্ম রিসেট
  useEffect(() => {
    setAmount("");
    setSlider(0);
  }, [symbol]);

  const amountNum = parseFloat(amount || "0") || 0;

  // ✅ market fixed => effective price only lastPrice
  const effectivePriceNum = parseFloat(lastPrice || "0") || 0;

  const totalNum =
    effectivePriceNum && amountNum ? effectivePriceNum * amountNum : 0;
  const total = totalNum ? totalNum.toFixed(2) : "";

  const maxBuyBase =
    isBuy && effectivePriceNum > 0 ? quoteAvailable / effectivePriceNum : 0;
  const maxSellBase = !isBuy ? baseAvailable : 0;
  const maxBase = isBuy ? maxBuyBase : maxSellBase;

  const feeBase = amountNum * FEE_RATE;
  const feeDisplay = feeBase ? feeBase.toFixed(3) : "0.000";

  // ✅ Total যদি ৫ USDT এর নিচে হয়, order block + warning
  const isBelowMinNotional = totalNum > 0 && totalNum < MIN_NOTIONAL;

  // Slider => Avbl ব্যালান্সের কত % ব্যবহার করব
  const handleSlider = (value: number): void => {
    setSlider(value);
    const pct = value / 100;

    if (isBuy) {
      const p = parseFloat(lastPrice || "0") || 0;

      if (!p) {
        setAmount("");
        return;
      }

      const amtBase = (quoteAvailable * pct) / p;
      setAmount(amtBase ? amtBase.toFixed(6) : "");
    } else {
      const amtBase = baseAvailable * pct;
      setAmount(amtBase ? amtBase.toFixed(6) : "");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    if (!amountNum || amountNum <= 0) {
      toast.error(`Enter valid amount of ${baseAsset}`);
      return;
    }

    // market এ lastPrice না থাকলে price unavailable
    if (!effectivePriceNum || effectivePriceNum <= 0) {
      toast.error("Price unavailable. Try again.");
      return;
    }

    // ✅ Minimum total check
    if (totalNum < MIN_NOTIONAL) {
      toast.error(`Minimum order size is ${MIN_NOTIONAL} ${quoteAsset}`);
      return;
    }

    // SELL হলে Avbl চেক করো
    if (!isBuy && amountNum > baseAvailable) {
      toast.error(`Not enough ${baseAsset} to sell`);
      return;
    }

    try {
      const res = await placeOrder({
        symbol: normalizedSymbol, // "BTCUSDT"
        side, // "buy" | "sell"
        orderType: "market", // ✅ fixed
        quantity: amountNum, // base asset amount
        price: effectivePriceNum, // ✅ fixed
      }).unwrap();

      const executedPrice = Number(res?.order?.price ?? effectivePriceNum);

      toast.success(
        `${side === "buy" ? "Bought" : "Sold"} ${amountNum.toFixed(
          6
        )} ${baseAsset} @ ${executedPrice}`
      );

      // ফর্ম রিসেট
      setAmount("");
      setSlider(0);

      console.log("order result:", res);
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.data?.error || err?.error || "Order failed";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
      {/* Price (Read-only for market) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Price ({quoteAsset})
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] uppercase text-slate-400">
            market
          </span>
        </div>

        <input
          type="number"
          step="0.00000001"
          value={lastPrice ?? ""}
          readOnly
          className="w-full cursor-default rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500"
          placeholder="0.00"
        />
      </div>

      {/* Amount (BASE asset) */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400">Amount ({baseAsset})</span>
        <input
          type="number"
          step="0.000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          placeholder="0.000000"
        />

        {/* ✅ Warning under Amount input */}
        {isBelowMinNotional && (
          <p className="text-[10px] text-amber-400">
            Total must be at least {MIN_NOTIONAL} {quoteAsset} (now ~
            {total || "0.00"} {quoteAsset}). Increase amount.
          </p>
        )}
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          step={25}
          value={slider}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSlider(Number(e.target.value))
          }
          className="w-full accent-emerald-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Total */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400">Total ({quoteAsset})</span>
        <input
          readOnly
          value={total}
          placeholder="0.00"
          className="w-full cursor-default rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-50"
        />

        {/* ✅ Warning under Total input */}
        {isBelowMinNotional && (
          <p className="text-[10px] text-amber-400">
            Minimum order size is {MIN_NOTIONAL} {quoteAsset}. Increase amount.
          </p>
        )}
      </div>

      {/* Avbl + Max + Est. Fee */}
      <div className="space-y-0.5 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Avbl</span>
          {isBuy ? (
            <span className="font-medium text-slate-100">
              {quoteAvailable.toFixed(8)} {quoteAsset}
            </span>
          ) : isBalancesLoading ? (
            <span className="text-slate-500">Loading...</span>
          ) : (
            <span className="font-medium text-slate-100">
              {Number(baseAvailable).toFixed(8)} {baseAsset}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span>Max {isBuy ? "Buy" : "Sell"}</span>
          <span className="text-slate-200">
            {maxBase.toFixed(6)} {baseAsset}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Est. Fee</span>
          <span className="text-slate-200">
            {feeDisplay} {baseAsset}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          isLoading || (!isBuy && isBalancesLoading) || isBelowMinNotional
        }
        className={`mt-1 w-full rounded-lg py-2.5 text-sm font-semibold shadow-md shadow-black/40 transition ${
          isBuy
            ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:bg-emerald-700/60"
            : "bg-red-500 text-slate-950 hover:bg-red-400 disabled:bg-red-700/60"
        }`}
      >
        {isLoading || (!isBuy && isBalancesLoading)
          ? "Placing..."
          : isBuy
          ? `Buy ${baseAsset}`
          : `Sell ${baseAsset}`}
      </button>
    </form>
  );
};

export default OrderForm;
