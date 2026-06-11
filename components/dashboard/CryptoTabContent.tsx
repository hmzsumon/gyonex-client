"use client";

import { useMiniTickerMap } from "@/hooks/useMiniTickerMap";
import type { PriceDir } from "@/hooks/usePriceFlashMap";
import { usePriceFlashMap } from "@/hooks/usePriceFlashMap";
import { useGetSpotBalancesQuery } from "@/redux/features/binance-trade/binance-tradeApi";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import CryptoAssetCard from "./CryptoAssetCard";

interface SpotWalletItem {
  _id: string;
  asset: string; // e.g. "XRP"
  symbol: string; // e.g. "XRPUSDT"
  qty: number;
  avgPrice: number;
  iconUrl?: string;
}

interface DemoAsset {
  symbol: string;
  name: string;
  iconSrc: string;
}

const DEMO_ASSETS: DemoAsset[] = [
  { symbol: "TRX", name: "TRON", iconSrc: "/images/icons/trx_icon.png" },
  { symbol: "POL", name: "Polygon", iconSrc: "/images/icons/pol_icon.png" },
  {
    symbol: "FDUSD",
    name: "First Digital USD",
    iconSrc: "/images/icons/fdusd_icon.png",
  },
  {
    symbol: "HBAR",
    name: "Hedera Hashgraph",
    iconSrc: "/images/icons/hbar_icon.png",
  },
];

type PortfolioSnapshot = {
  total: number;
  dir: PriceDir;
  flash: boolean;
  loading: boolean;
};

const CryptoTabContent: React.FC<{
  onPortfolioChange?: (snap: PortfolioSnapshot) => void;
}> = ({ onPortfolioChange }) => {
  const { user } = useSelector((state: any) => state.auth);

  const { data: spotBalances, isLoading } = useGetSpotBalancesQuery(undefined, {
    skip: !user?._id,
  }) as {
    data?: SpotWalletItem[];
    isLoading: boolean;
  };

  const usdtBalance = Number(user?.m_balance ?? 0);
  const wallets = spotBalances ?? [];

  const walletSymbols = wallets.map((w) => w.symbol.toUpperCase());
  const priceMap = useMiniTickerMap(walletSymbols);

  const cards = useMemo(() => {
    type CardItem = {
      key: string;
      symbol: string;
      name: string;
      balance: number;
      iconSrc: string;
      avgPrice?: number;
      quoteValue?: number;
      todayPnl?: number;
    };

    const list: CardItem[] = [];

    // ✅ USDT card (cash)
    list.push({
      key: "USDT-CASH",
      symbol: "USDT",
      name: "TetherUS",
      balance: usdtBalance,
      iconSrc: "/images/icons/usdt_icon.png",
      avgPrice: undefined,
      quoteValue: usdtBalance,
      todayPnl: 0,
    });

    // ✅ Spot wallet assets
    for (const w of wallets) {
      const sym = w.symbol.toUpperCase(); // XRPUSDT
      const lastPrice = priceMap[sym];
      const qty = w.qty;

      const quoteValue =
        typeof lastPrice === "number" ? lastPrice * qty : w.avgPrice * qty;

      const todayPnl =
        typeof lastPrice === "number" ? (lastPrice - w.avgPrice) * qty : 0;

      list.push({
        key: w._id,
        symbol: w.asset, // "XRP"
        name: w.symbol, // "XRPUSDT"
        balance: qty,
        iconSrc: w.iconUrl || "/images/icons/default-coin.png",
        avgPrice: w.avgPrice,
        quoteValue,
        todayPnl,
      });
    }

    // optional demo
    const MIN_ITEMS = 4;
    const existing = new Set(list.map((x) => x.symbol));
    if (list.length < MIN_ITEMS) {
      for (const demo of DEMO_ASSETS) {
        if (list.length >= MIN_ITEMS) break;
        if (existing.has(demo.symbol)) continue;

        list.push({
          key: `DEMO-${demo.symbol}`,
          symbol: demo.symbol,
          name: demo.name,
          balance: 0,
          iconSrc: demo.iconSrc,
          avgPrice: undefined,
          quoteValue: 0,
          todayPnl: 0,
        });
      }
    }

    return list;
  }, [usdtBalance, wallets, priceMap]);

  // ✅ total portfolio = sum of visible cards (USDT + all spot assets)
  const totalQuoteValue = useMemo(() => {
    const sum = cards.reduce((acc, x) => {
      const v = Number(x.quoteValue ?? 0);
      return Number.isFinite(v) ? acc + v : acc;
    }, 0);
    // reduce tiny float jitter
    return Number(sum.toFixed(4));
  }, [cards]);

  // ✅ flash/color for total
  const totalMap = useMemo(
    () => ({ TOTAL: totalQuoteValue }),
    [totalQuoteValue]
  );
  const { dirMap, flashMap } = usePriceFlashMap(totalMap, 700);

  const totalDir: PriceDir = dirMap.TOTAL ?? "flat";
  const totalFlash = !!flashMap.TOTAL;

  const loadingForHeader =
    isLoading && (!spotBalances || spotBalances.length === 0);

  // ✅ push to dashboard header
  useEffect(() => {
    onPortfolioChange?.({
      total: totalQuoteValue,
      dir: totalDir,
      flash: totalFlash,
      loading: loadingForHeader,
    });
  }, [
    onPortfolioChange,
    totalQuoteValue,
    totalDir,
    totalFlash,
    loadingForHeader,
  ]);

  if (loadingForHeader && (!spotBalances || spotBalances.length === 0)) {
    return (
      <div className="py-4 text-xs text-zinc-500">Loading your assets...</div>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((asset) => (
        <CryptoAssetCard
          key={asset.key}
          symbol={asset.symbol}
          name={asset.name}
          balance={asset.balance}
          iconSrc={asset.iconSrc}
          quoteSymbol="USDT"
          quoteValue={asset.quoteValue}
          avgPrice={asset.avgPrice}
          todayPnl={asset.todayPnl}
          onTrade={() => {
            console.log("Trade clicked for", asset.symbol);
          }}
        />
      ))}
    </div>
  );
};

export default CryptoTabContent;
