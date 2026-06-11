/* ──────────────────────────────────────────────────────────────────────────
   LiveChart — lightweight-charts (Klines from your API) with ref controls
   - Exposes resetView() so outer UI can “Reset zoom”
   - Uses redux timeframe & chartType
────────────────────────────────────────────────────────────────────────── */
"use client";

import {
  BinanceKlineInterval,
  useBinanceStream,
} from "@/hooks/useBinanceStream";
import { useAppSelector } from "@/redux/hooks";
import {
  CandlestickData,
  ColorType,
  createChart,
  IChartApi,
  Logical,
  LogicalRange, // 👈 branded type
  Time,
} from "lightweight-charts";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useSelector } from "react-redux";

export type ChartExpose = {
  /** Reset zoom/scroll to initial logical range set after initial data load */
  resetView: () => void;
};

// চাইলে env দিয়ে দাও: NEXT_PUBLIC_API_BASE
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://cgfx-api-571c8ffe2dd2.herokuapp.com";

// number → Logical (branded) কাস্ট helper
const toLogical = (n: number) => n as unknown as Logical;

type Props = {
  symbol: string; // e.g. "BTCUSDT"
  limit?: number; // initial bars
};

function LiveChartImpl(
  { symbol, limit = 800 }: Props,
  ref: React.Ref<ChartExpose>,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const initialRangeRef = useRef<LogicalRange | null>(null);

  const tf = useSelector((s: any) => s.trade.tf);

  console.log("[LiveChart] render", { symbol, tf, limit });
  const chartType = useAppSelector((s: any) => s.trade.chartType);

  // WS stream
  const klineStream = `kline_${tf}` as `kline_${BinanceKlineInterval}`;
  const { data: kline } = useBinanceStream(symbol, klineStream);

  // expose resetView()
  useImperativeHandle(ref, () => ({
    resetView() {
      if (chartRef.current && initialRangeRef.current) {
        try {
          chartRef.current
            .timeScale()
            .setVisibleLogicalRange(initialRangeRef.current);
        } catch {}
      }
    },
  }));

  // build chart on symbol|tf|type change
  useEffect(() => {
    if (!wrap.current) return;

    // teardown previous
    try {
      chartRef.current?.remove();
    } catch {}
    chartRef.current = null;
    seriesRef.current = null;
    initialRangeRef.current = null;

    const chart = createChart(wrap.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0b0e11" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.2 },
        autoScale: true,
      },
      timeScale: {
        rightOffset: 6,
        barSpacing: 12,
        minBarSpacing: 6,
        lockVisibleTimeRangeOnResize: true,
        fixLeftEdge: true,
        borderVisible: false,
      },
      crosshair: { mode: 0 },
    });

    function priceDecimals(sym: string) {
      const s = sym.toUpperCase();
      if (s.includes("XAU") || s.includes("XAG")) return 2;
      if (/USDT$/.test(s)) {
        if (/(BONK|PEPE|SHIB|DOGE)/.test(s)) return 5;
        if (/BTC|ETH|SOL|BNB/.test(s)) return 2;
        return 3;
      }
      return 2;
    }
    const minMove = (sym: string) => {
      const p = priceDecimals(sym);
      return Number((1 / 10 ** p).toFixed(p));
    };

    // choose series by chartType
    const s =
      chartType === "line"
        ? chart.addLineSeries({
            priceFormat: {
              type: "price",
              precision: priceDecimals(symbol),
              minMove: minMove(symbol),
            },
          })
        : chartType === "bars"
          ? chart.addBarSeries({
              upColor: "#1ea97c",
              downColor: "#ef4444",
              priceFormat: {
                type: "price",
                precision: priceDecimals(symbol),
                minMove: minMove(symbol),
              },
            })
          : chart.addCandlestickSeries({
              // hollow candlestick = transparent body
              upColor: chartType === "hollow" ? "transparent" : "#1ea97c",
              downColor: chartType === "hollow" ? "transparent" : "#ef4444",
              wickUpColor: "#1ea97c",
              wickDownColor: "#ef4444",
              borderUpColor: "#1ea97c",
              borderDownColor: "#ef4444",
              borderVisible: true,
              priceFormat: {
                type: "price",
                precision: priceDecimals(symbol),
                minMove: minMove(symbol),
              },
              lastValueVisible: true,
              priceLineVisible: true,
            });

    chartRef.current = chart;
    seriesRef.current = s;

    const resize = () => {
      if (!wrap.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: wrap.current.clientWidth,
        height: wrap.current.clientHeight,
      });
    };
    resize();
    addEventListener("resize", resize);

    // initial REST fill
    (async () => {
      try {
        const q = new URLSearchParams({
          symbol,
          interval: tf,
          limit: String(limit),
        });
        const url = `${API_BASE}/api/crypto/klines?${q.toString()}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));

        const json = await res.json();
        const data: CandlestickData[] = (json?.data ?? []).map((k: any) => ({
          time: k.time as Time,
          open: k.open,
          high: k.high,
          low: k.low,
          close: k.close,
        }));

        if (chartType === "line") {
          s.setData(data.map((d) => ({ time: d.time, value: d.close })));
        } else {
          s.setData(data);
        }

        // initial zoom (last ~150 bars)
        const show = 150;
        const total = data.length;
        const from = Math.max(0, total - show);
        const to = total + 3;

        // 👇 Logical branded cast
        const range: LogicalRange = {
          from: toLogical(from),
          to: toLogical(to),
        };
        chart.timeScale().setVisibleLogicalRange(range);
        initialRangeRef.current = range; // for resetView()
      } catch {
        /* silent */
      }
    })();

    return () => {
      removeEventListener("resize", resize);
      try {
        chart.remove();
      } catch {}
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [symbol, tf, chartType, limit]);

  // live updates
  useEffect(() => {
    if (!kline || !seriesRef.current) return;
    const k = (kline as any).k;
    if (!k) return;

    const t = Math.floor(k.t / 1000) as Time;
    if (chartType === "line") {
      seriesRef.current.update({ time: t, value: +k.c });
    } else {
      seriesRef.current.update({
        time: t,
        open: +k.o,
        high: +k.h,
        low: +k.l,
        close: +k.c,
      });
    }
  }, [kline, chartType]);

  return (
    <div className="relative h-full w-full">
      <div ref={wrap} className="absolute inset-0" />
    </div>
  );
}

const LiveChart = forwardRef<ChartExpose, Props>(LiveChartImpl);
export default LiveChart;
