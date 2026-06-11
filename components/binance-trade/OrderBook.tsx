// components/trade/OrderBook.tsx
import React from "react";

interface OrderBookProps {
  lastPrice: string | null;
}

interface BookRow {
  price: string;
  amount: string;
}

const sampleAsks: BookRow[] = [
  { price: "85802.34", amount: "0.01172" },
  { price: "85802.20", amount: "0.00280" },
  { price: "85802.09", amount: "0.00028" },
  { price: "85800.51", amount: "0.00005" },
];

const sampleBids: BookRow[] = [
  { price: "85800.00", amount: "2.72015" },
  { price: "85799.89", amount: "0.00052" },
  { price: "85799.80", amount: "0.02758" },
  { price: "85799.20", amount: "0.38462" },
];

const OrderBook: React.FC<OrderBookProps> = ({ lastPrice }) => {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-3 text-[11px] shadow-lg shadow-black/40">
      <div className="mb-1 flex justify-between text-[10px] text-slate-400">
        <span>Price (USDT)</span>
        <span>Amount (BTC)</span>
      </div>

      {/* asks */}
      <div className="space-y-[1px]">
        {sampleAsks.map((row, i) => (
          <div
            key={`ask-${i}`}
            className="flex justify-between rounded px-1 py-[2px] hover:bg-red-500/5"
          >
            <span className="text-red-400">{row.price}</span>
            <span className="text-slate-200">{row.amount}</span>
          </div>
        ))}
      </div>

      {/* mid price */}
      <div className="my-2 text-center">
        <div className="text-lg font-semibold text-emerald-400">
          {lastPrice ? Number(lastPrice).toLocaleString() : "--"}
        </div>
        <div className="text-[10px] text-slate-500">≈ $10,483,777.08</div>
      </div>

      {/* bids */}
      <div className="space-y-[1px]">
        {sampleBids.map((row, i) => (
          <div
            key={`bid-${i}`}
            className="flex justify-between rounded px-1 py-[2px] hover:bg-emerald-500/5"
          >
            <span className="text-emerald-400">{row.price}</span>
            <span className="text-slate-200">{row.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
