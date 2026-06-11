/* ── Markets Table ──────────────────────────────────────────────────────────── */

import { ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";
import Card from "./Card";
import Container from "./Container";
import SectionTitle from "./SectionTitle";

type MarketRow = {
  symbol: string;
  name: string;
  spread: string;
  execution: string;
  leverage: string;
  status: string;
};

const rows: MarketRow[] = [
  {
    symbol: "XAUUSD",
    name: "Gold",
    spread: "0.12",
    execution: "Market",
    leverage: "1:200",
    status: "Active",
  },
  {
    symbol: "USOIL",
    name: "Crude Oil",
    spread: "0.06",
    execution: "Market",
    leverage: "1:100",
    status: "Active",
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin",
    spread: "12.0",
    execution: "Instant",
    leverage: "1:20",
    status: "Active",
  },
  {
    symbol: "DE30",
    name: "DAX Index",
    spread: "0.8",
    execution: "Market",
    leverage: "1:50",
    status: "Active",
  },
  {
    symbol: "EURUSD",
    name: "Euro / USD",
    spread: "0.1",
    execution: "Instant",
    leverage: "1:500",
    status: "Active",
  },
];

const MarketsTable: React.FC = () => (
  <section id="markets" className="bg-neutral-950 pb-16">
    <Container>
      <SectionTitle
        title="Trade assets from global markets"
        subtitle="Explore the instruments you can trade on our platform."
      />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead className="bg-neutral-900/50 text-left text-xs uppercase tracking-widest text-neutral-400">
              <tr>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Spread</th>
                <th className="px-6 py-4">Execution</th>
                <th className="px-6 py-4">Leverage</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {rows.map((r) => (
                <tr key={r.symbol} className="text-sm text-neutral-200">
                  <td className="px-6 py-4 font-mono font-semibold text-white">
                    {r.symbol}
                  </td>
                  <td className="px-6 py-4">{r.name}</td>
                  <td className="px-6 py-4">{r.spread}</td>
                  <td className="px-6 py-4">{r.execution}</td>
                  <td className="px-6 py-4">{r.leverage}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-5 flex items-center gap-3">
        <Button className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800">
          Try the demo
        </Button>
        <Button
          className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
          icon={ArrowRight}
        >
          Register
        </Button>
      </div>
    </Container>
  </section>
);

export default MarketsTable;
