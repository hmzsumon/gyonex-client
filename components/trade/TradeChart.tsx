/* ──────────────────────────────────────────────────────────────────────────
   TradeChart — lightweight-charts candle chart + demo tick stream
────────────────────────────────────────────────────────────────────────── */
"use client";

import { setQuote } from "@/redux/features/trade/tradeSlice";
import {
  CandlestickData,
  ColorType,
  createChart,
  IChartApi,
  Time,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TradeChart() {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const symbol = useSelector((s: any) => s.trade.symbol);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ref.current) return;

    // init chart
    const chart = createChart(ref.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0b0e11" }, // ✅ enum
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.18 },
      },
      timeScale: {
        rightOffset: 6,
        barSpacing: 10,
        minBarSpacing: 6,
        borderVisible: false,
        lockVisibleTimeRangeOnResize: true,
        fixLeftEdge: true,
      },
    });

    const series = chart.addCandlestickSeries({
      upColor: "#34d399",
      downColor: "#f87171",
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
      borderVisible: false,
    });

    chartRef.current = chart;

    // seed candles (demo)
    const nowSec = Math.floor(Date.now() / 1000);
    const seed: CandlestickData[] = []; // ✅ সঠিক টাইপ

    let price = 3685;
    for (let i = 300; i > 0; i--) {
      const t = (nowSec - i * 60) as Time; // ✅ Time কাস্ট
      const open = price;
      const delta = (Math.random() - 0.5) * 4;
      const close = +(open + delta).toFixed(3);
      const high = Math.max(open, close) + Math.random();
      const low = Math.min(open, close) - Math.random();
      seed.push({
        time: t,
        open,
        high: +high.toFixed(3),
        low: +low.toFixed(3),
        close,
      });
      price = close;
    }
    series.setData(seed); // ✅ CandlestickData[]

    // demo tick stream (random walk)
    let last = seed[seed.length - 1].close;
    const id = setInterval(() => {
      const bid = +(last - 0.112).toFixed(3);
      const ask = +(last + 0.088).toFixed(3);

      // push quote to redux (for other UI like pnl)
      dispatch(setQuote({ symbol, bid, ask, ts: Date.now() }));

      // append/update last candle (1m aggregation)
      const t = (Math.floor(Date.now() / 60_000) * 60) as Time; // ✅ Time
      const prev = seed[seed.length - 1];

      if (prev.time === t) {
        // update current bar
        prev.high = Math.max(prev.high, ask);
        prev.low = Math.min(prev.low, bid);
        prev.close = +((bid + ask) / 2).toFixed(3);
        series.update(prev); // ✅ CandlestickData
      } else {
        // create next bar
        const open = last;
        const close = +((bid + ask) / 2).toFixed(3);
        const high = Math.max(open, close);
        const low = Math.min(open, close);
        const c: CandlestickData = {
          time: t,
          open,
          high: +high.toFixed(3),
          low: +low.toFixed(3),
          close,
        };
        series.update(c);
        seed.push(c);
      }

      // next random walk step
      last = +(last + (Math.random() - 0.5) * 0.8).toFixed(3);
    }, 1200);

    // responsive width
    const resize = () => {
      if (!ref.current) return;
      chart.applyOptions({ width: ref.current.clientWidth });
    };
    resize();
    window.addEventListener("resize", resize);

    // cleanup
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
      try {
        chart.remove();
      } catch {}
      chartRef.current = null;
    };
  }, [symbol, dispatch]);

  return (
    <div
      ref={ref}
      className="w-full h-[420px] rounded-xl overflow-hidden border border-neutral-800"
    />
  );
}
