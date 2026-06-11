"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useGetStakingPlansQuery,
  useSubscribeStakingMutation,
} from "@/redux/features/staking-earn/stakingEarnApi";

import AmountSection from "./AmountSection";
import ConfirmBar from "./ConfirmBar";
import SummaryPanel from "./SummaryPanel";
import TermSelector, { TermOption } from "./TermSelector";
import TopBar from "./TopBar";

type EarnAsset = {
  symbol: string;
  name?: string;
  balance: number;
  iconSrc?: string;
};

const MIN_AMOUNT = 0.00001;
const MAX_DECIMALS = 8;

const toNumber = (v: string | null, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// helper: termId => days
const termIdToDays = (id: string) => {
  const m = id.match(/^(\d+)\s*d$/i);
  return m ? Number(m[1]) : 1;
};

// ✅ typing-friendly sanitize (NO auto clamp, NO Number() stringify)
const sanitizeAmountInput = (raw: string) => {
  let s = String(raw ?? "");

  // comma -> dot
  s = s.replace(/,/g, ".");

  // keep only digits + dot
  s = s.replace(/[^\d.]/g, "");

  // if starts with dot => "0."
  if (s.startsWith(".")) s = "0" + s;

  // keep only first dot
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    const before = s.slice(0, firstDot + 1);
    const after = s.slice(firstDot + 1).replace(/\./g, "");
    s = before + after;

    // limit decimals
    const [i, d = ""] = s.split(".");
    s = `${i}.${d.slice(0, MAX_DECIMALS)}`;
  }

  return s;
};

const StakingEarnScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const asset: EarnAsset = useMemo(() => {
    const symbol = (searchParams.get("symbol") || "USDT").toUpperCase();
    const name = searchParams.get("name") || undefined;
    const balance = toNumber(searchParams.get("balance"), 0);
    const iconSrc = searchParams.get("iconSrc") || undefined;

    return { symbol, name, balance, iconSrc };
  }, [searchParams]);

  const {
    data: plansData,
    isLoading: plansLoading,
    error: plansError,
  } = useGetStakingPlansQuery();

  useEffect(() => {
    if (plansError) {
      const msg =
        (plansError as any)?.data?.message ||
        (plansError as any)?.error ||
        "Failed to load staking plans";
      toast.error(msg);
    }
  }, [plansError]);

  const terms: TermOption[] = useMemo(() => {
    const apiPlans = plansData?.items ?? [];
    if (apiPlans.length > 0) {
      return apiPlans.map((p) => ({
        id: `${p.termDays}d`,
        labelTop: `${p.termDays} ${p.termDays === 1 ? "Day" : "Days"}`,
        labelBottom: "Daily",
        apr: Number(p.dailyProfitPercent),
        userSharePercent: p.userSharePercent,
      }));
    }

    return [
      { id: "1d", labelTop: "1 Day", labelBottom: "Daily", apr: 0.32 },
      { id: "7d", labelTop: "7 Days", labelBottom: "Daily", apr: 1.0 },
      { id: "15d", labelTop: "15 Days", labelBottom: "Daily", apr: 1.17 },
      { id: "30d", labelTop: "30 Days", labelBottom: "Daily", apr: 1.3 },
      { id: "90d", labelTop: "90 Days", labelBottom: "Daily", apr: 1.4 },
      { id: "180d", labelTop: "180 Days", labelBottom: "Daily", apr: 1.6 },
      { id: "360d", labelTop: "360 Days", labelBottom: "Daily", apr: 1.8 },
    ];
  }, [plansData?.items]);

  const [selectedTermId, setSelectedTermId] = useState<string>("1d");
  const [amount, setAmount] = useState<string>(""); // ✅ keep as string

  useEffect(() => {
    if (terms.length === 0) return;
    const exists = terms.some((t) => t.id === selectedTermId);
    if (!exists) setSelectedTermId(terms[0]!.id);
  }, [terms, selectedTermId]);

  const selectedTerm = terms.find((t) => t.id === selectedTermId) ?? terms[0];

  const tierAprs = useMemo(() => {
    const base = selectedTerm?.apr ?? 0;
    const second = Math.max(0, +(base - 0.1).toFixed(2));
    return { tier1: base, tier2: second };
  }, [selectedTerm?.apr]);

  const maxBalance = asset.balance;

  const amountNum = Number(amount);
  const isNumeric = amount.trim().length > 0 && Number.isFinite(amountNum);

  const isBelowMin = isNumeric && amountNum > 0 && amountNum < MIN_AMOUNT;
  const isAboveMax = isNumeric && amountNum > maxBalance;

  const amountValid =
    isNumeric && amountNum >= MIN_AMOUNT && amountNum <= maxBalance;

  const canConfirm = amountValid && maxBalance >= MIN_AMOUNT;

  const availText = `Available: ${maxBalance.toLocaleString(undefined, {
    maximumFractionDigits: 8,
  })} ${asset.symbol}`;

  const [subscribeStaking, { isLoading: subscribing }] =
    useSubscribeStakingMutation();

  const onAmountChange = (v: string) => {
    // ✅ only sanitize characters; DO NOT clamp here
    setAmount(sanitizeAmountInput(v));
  };

  const onAmountBlur = () => {
    // ✅ clamp ONLY when leaving input
    const n = Number(amount);
    if (Number.isFinite(n) && n > 0 && n < MIN_AMOUNT) {
      setAmount(String(MIN_AMOUNT));
    }
  };

  const onConfirm = async () => {
    if (!amount.trim()) return;

    const n = Number(amount);
    if (!Number.isFinite(n)) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (n < MIN_AMOUNT) {
      toast.error(`Minimum amount is ${MIN_AMOUNT}`);
      setAmount(String(MIN_AMOUNT));
      return;
    }
    if (n > maxBalance) {
      toast.error("Insufficient balance");
      return;
    }

    const termDays = termIdToDays(selectedTermId);

    const payload = {
      symbol: asset.symbol,
      amount: Number(n),
      termDays,
      iconUrl: asset.iconSrc,
    };

    try {
      await toast.promise(subscribeStaking(payload).unwrap(), {
        loading: "Subscribing...",
        success: "Subscribed successfully ✅",
        error: (err: any) =>
          err?.data?.message || err?.message || "Subscription failed ❌",
      });

      setAmount("");
      router.push("/my-staking");
    } catch {
      // toast already handled
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141b] text-white flex flex-col">
      <div className="pt-4 px-2">
        <TopBar
          symbol={asset.symbol}
          iconSrc={asset.iconSrc}
          title={`${asset.symbol} Subscribe`}
        />
      </div>

      <div className="px-2 mt-6">
        <TermSelector
          terms={terms}
          selectedId={selectedTermId}
          onSelect={setSelectedTermId}
        />
      </div>

      {plansLoading && (
        <div className="px-2 mt-3 text-sm text-white/60">Loading plans...</div>
      )}

      <div className="px-2 mt-3">
        <AmountSection
          amount={amount}
          onAmountChange={onAmountChange}
          assetSymbol={asset.symbol}
          balance={maxBalance}
          minAmount={MIN_AMOUNT}
          minText={`Minimum ${MIN_AMOUNT}`}
          availableText={availText}
          onMax={() =>
            setAmount(String(Number(maxBalance.toFixed(MAX_DECIMALS))))
          }
        />

        {amount.trim().length > 0 && !isNumeric && (
          <div className="mt-2 text-xs text-red-400">
            Please enter a valid number.
          </div>
        )}

        {isBelowMin && (
          <div className="mt-2 text-xs text-red-400">
            Minimum amount is {MIN_AMOUNT}.
          </div>
        )}

        {isAboveMax && (
          <div className="mt-2 text-xs text-red-400">
            Amount cannot exceed {maxBalance}.
          </div>
        )}
      </div>

      <div className="px-2 mt-3 text-sm border-b border-white/10 pb-2">
        <h2>Summary</h2>
      </div>

      <div className="px-2 mt-4 pb-28">
        <SummaryPanel
          assetSymbol={asset.symbol}
          amount={Number.isFinite(amountNum) ? amountNum : 0}
          dailyApr={selectedTerm?.apr ?? 0}
          userSharePercent={selectedTerm?.userSharePercent ?? 1}
        />
      </div>

      <ConfirmBar
        label={subscribing ? "Processing..." : "Confirm"}
        disabled={!canConfirm || subscribing}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default StakingEarnScreen;
