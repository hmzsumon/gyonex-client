/* ────────── Closed position details drawer ────────── */
"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { fmt } from "@/utils/num";
import { Position } from "./types";

/* ────────── constants ────────── */
const USER_PROFIT_RATE = 0.6; // 60% to user

/* ── tiny helpers ───────────────────────────────────── */
const fmt2 = (n?: number) =>
  Number.isFinite(n as number) ? (n as number).toFixed(2) : "—";

export default function ClosedDetailsDrawer({
  open,
  onOpenChange,
  position,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  position?: Position | null;
}) {
  // console.log(position);
  if (!position) return null;

  const sideTag =
    position.side === "buy"
      ? "text-emerald-400 border-emerald-500/30"
      : "text-red-400 border-red-500/30";

  /* ────────── P/L and shares ────────── */
  const rawPnl = position.is_loss ? position.pnlUsd : position.profit;
  const pnl = Number.isFinite(rawPnl as number) ? (rawPnl as number) : 0;

  const pnlTone = pnl >= 0 ? "text-emerald-400" : "text-red-400";

  // only profit is shared; loss হলে ইউজার ক্রেডিট 0
  const profit = Math.max(0, pnl);
  const userShare = profit * USER_PROFIT_RATE; // 60%
  const platformShare = profit - userShare; // 40%

  /* prefer explicit closePrice then lastPrice then entry */
  const closePx =
    (position as any).maniClosePrice ??
    (Number.isFinite(position.maniClosePrice)
      ? position.maniClosePrice
      : undefined) ??
    position.entryPrice;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] rounded-t-3xl bg-neutral-950 px-3 pb-3">
        <DrawerHeader>
          <DrawerTitle className="text-center text-sm text-neutral-100">
            Position Details
          </DrawerTitle>
        </DrawerHeader>

        <div className="mx-auto w-full  space-y-3 px-2">
          {/* Symbol + tag + gross pnl */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-200">
                {position.s}
              </span>
              {position.tag ? (
                <span className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300">
                  {position.tag}
                </span>
              ) : null}
            </div>
            <div className={`text-sm font-semibold ${pnlTone}`}>
              {(pnl >= 0 ? "+" : "") + fmt(pnl, 2)} USDT
            </div>
          </div>

          {/* Meta rows */}
          <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 text-sm">
            <Row k="Side">
              <span
                className={`rounded border px-1.5 py-0.5 text-[11px] ${sideTag}`}
              >
                {position.side.toUpperCase()}
              </span>
            </Row>
            <Row k="Lots">{position.lots.toFixed(2)}</Row>
            <Row k="Entry price">{fmt2(position.entryPrice)}</Row>
            <Row k="Close price">{fmt2(closePx)}</Row>

            {/* ────────── split info (60% / 40%) ────────── */}
            {/* Gross P/L */}
            <Row k="Gross P/L (USD)">
              <span className={`font-semibold ${pnlTone}`}>{fmt2(pnl)}</span>
            </Row>

            {/* Only show shares prominently when profit > 0 */}
            <div className="mt-2 rounded-lg border border-neutral-800 bg-neutral-900/60 p-3">
              {position?.is_loss ? (
                <div className="mt-2 text-[11px] text-neutral-400">
                  Loss trade: no credit is added to user balance.
                </div>
              ) : (
                <div>
                  <div className="mb-2 text-xs text-neutral-400">
                    Profit split: <b>60%</b> to user, <b>40%</b> to platform
                  </div>

                  <Row k="Platform share (40%)">
                    <span className="font-semibold text-neutral-300">
                      {fmt2(platformShare)} USDT
                    </span>
                  </Row>

                  <Row k="Credited to main balance (60%)">
                    <span className="font-semibold text-emerald-400">
                      {fmt2(userShare)} USDT
                    </span>
                  </Row>
                </div>
              )}
            </div>

            <Row k="Closed at">
              {position.closedAt
                ? new Date(position.closedAt).toLocaleString()
                : "—"}
            </Row>
            <Row k="Symbol (raw)">{position.symbol || "—"}</Row>
          </div>
        </div>

        <DrawerFooter className="px-2 pt-2">
          <DrawerClose asChild>
            <button className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 text-sm text-neutral-200 hover:bg-neutral-800">
              Close
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/* ────────── small labeled row ────────── */
function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-400">{k}</span>
      <span className="text-neutral-200">{children}</span>
    </div>
  );
}
