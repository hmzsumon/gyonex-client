// components/trade/TradeScreen.tsx
"use client";

import ChartFullscreen from "@/components/trade/ChartFullscreen";
import LiveChart, { ChartExpose } from "@/components/trade/parts/LiveChart";
import { useListPositionsQuery } from "@/redux/features/trade/tradeApi";
import { num } from "@/utils/num";
import { useMemo, useRef, useState } from "react";

import ClosePositionDialog from "./parts/ClosePositionDialog";
import InstrumentDrawer from "./parts/InstrumentDrawer";
import InstrumentHeader from "./parts/InstrumentHeader";
import LiveBalancePill from "./parts/LiveBalancePill";
import OrderPanel from "./parts/OrderPanel";
import PositionsStrip from "./parts/PositionsStrip";

export default function TradeScreen({ account }: { account: any }) {
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [drawer, setDrawer] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [closeTargetId, setCloseTargetId] = useState<string | undefined>();
  const [showFs, setShowFs] = useState(false); // 👈 fullscreen state
  const chartRef = useRef<ChartExpose>(null); // 👈 ref to reset zoom

  const { data } = useListPositionsQuery(
    { accountId: account?._id },
    { skip: !account?._id },
  );
  const positions = data?.items ?? [];

  const target = useMemo(
    () => positions.find((p) => p._id === closeTargetId),
    [positions, closeTargetId],
  );

  const norm = (p: any) => ({
    _id: p._id,
    symbol: p.symbol,
    side: p.side,
    volume: num(p.volume ?? p.lots ?? p.qty ?? 0),
    entryPrice: num(p.entryPrice ?? p.openPrice ?? p.price ?? 0),
    lastPrice: num(p.lastPrice ?? p.entryPrice ?? 0),
    status: p.status,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-1">
        <LiveBalancePill account={account} positions={positions as any} />

        <InstrumentHeader
          symbol={symbol}
          onOpenDrawer={() => setDrawer(true)}
          onFullscreen={() => setShowFs(true)} // 👈 open overlay
          onResetZoom={() => chartRef.current?.resetView()} // 👈 reset zoom
        />

        <PositionsStrip
          accountId={account?._id}
          symbol={symbol}
          onOpenList={() => setOpenList(true)}
          onCloseClick={(id) => {
            if (id) setCloseTargetId(id);
            else setOpenList(true);
          }}
        />
      </div>

      <div className="flex-1 relative mt-4">
        <LiveChart ref={chartRef} symbol={symbol} /> {/* 👈 ref attached */}
      </div>

      <div className="mt-2">
        <OrderPanel symbol={symbol} account={account} />
      </div>

      <InstrumentDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        onPick={(s) => {
          setSymbol(s);
          setDrawer(false);
        }}
      />

      {openList && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenList(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto">
            <div className="text-center font-semibold mb-3">Open positions</div>
            {positions
              .filter((p) => p.status === "open")
              .map((p) => {
                const q = norm(p);
                return (
                  <div
                    key={q._id}
                    className="flex items-center justify-between rounded-xl bg-neutral-900 border border-neutral-800 p-3 mb-2"
                  >
                    <div>
                      <div className="font-semibold">{q.symbol}</div>
                      <div className="text-xs text-neutral-400">
                        {q.side?.toUpperCase()} •{" "}
                        {Number.isFinite(q.volume) ? q.volume.toFixed(2) : "–"}{" "}
                        @{" "}
                        {Number.isFinite(q.entryPrice)
                          ? q.entryPrice.toFixed(3)
                          : "–"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCloseTargetId(q._id);
                        setOpenList(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black font-semibold"
                    >
                      Close
                    </button>
                  </div>
                );
              })}
            {positions.filter((p) => p.status === "open").length === 0 && (
              <div className="text-center text-neutral-400 py-6">
                No open positions
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen overlay */}
      {showFs && (
        <ChartFullscreen
          symbol={symbol}
          interval={"5m"}
          onClose={() => setShowFs(false)}
        />
      )}

      {target && (
        <ClosePositionDialog
          position={norm(target)}
          lastPrice={norm(target).lastPrice}
          onDone={() => setCloseTargetId(undefined)}
        />
      )}
    </div>
  );
}
