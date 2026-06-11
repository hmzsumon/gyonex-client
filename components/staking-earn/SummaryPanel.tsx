"use client";

type Props = {
  assetSymbol: string;
  amount: number; // user input amount (number)
  dailyApr: number; // dailyProfitPercent (e.g. 1.3 means 1.3% daily)
  userSharePercent: number; // 0..1 (e.g. 0.45)
};

const MAX_DECIMALS = 2;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const fmtAmount = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: MAX_DECIMALS });

const fmtPercent = (n: number, maxDp = 2) =>
  n.toFixed(maxDp).replace(/\.?0+$/, ""); // remove trailing zeros

const SummaryPanel = ({
  assetSymbol,
  amount,
  dailyApr,
  userSharePercent,
}: Props) => {
  const share = clamp01(Number(userSharePercent) || 0);

  const isAmountOk = Number.isFinite(amount) && amount > 0;
  const isAprOk = Number.isFinite(dailyApr) && dailyApr >= 0;

  // ✅ Daily reward (token) = amount * (dailyApr/100) * userSharePercent
  const estDailyReward =
    isAmountOk && isAprOk ? amount * (dailyApr / 100) * share : NaN;

  // ✅ Subscriber % of principal per day
  const subscriberDailyPercent = isAprOk ? dailyApr * share : 0;

  // ✅ Leader & Company split from remaining share (60/40)
  const remaining = 1 - share;
  const leaderDailyPercent = isAprOk ? dailyApr * remaining * 0.6 : 0;
  const companyDailyPercent = isAprOk ? dailyApr * remaining * 0.4 : 0;

  return (
    <div className="rounded-2xl bg-[#111822] border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="text-white/75 text-sm font-medium">
          Est. Daily Rewards
        </div>

        <div className="text-white/50 text-sm">
          {Number.isFinite(estDailyReward) ? (
            <>
              {fmtAmount(estDailyReward)}{" "}
              <span className="text-[#63e6be]">{assetSymbol}</span>
            </>
          ) : (
            <>
              -- <span className="text-[#63e6be]">{assetSymbol}</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Subscriber */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/80">
            <span className="h-2.5 w-2.5 rotate-45 bg-white/70 inline-block rounded-[2px]" />
            <span className="text-sm">Subscriber {assetSymbol}</span>
          </div>

          <div className="text-sm text-white/80">
            Daily{" "}
            <span className="font-semibold">
              {fmtPercent(subscriberDailyPercent)}%
            </span>
          </div>
        </div>

        {/* Leader & Company */}
        <div className="flex items-center justify-between opacity-85">
          <div className="flex items-center gap-2 text-white/60">
            <span className="h-2.5 w-2.5 rotate-45 bg-white/35 inline-block rounded-[2px]" />
            <span className="text-sm">Leader & Company {assetSymbol}</span>
          </div>

          <div className="text-sm text-white/60">
            Daily{" "}
            <span className="font-semibold">
              {fmtPercent(leaderDailyPercent)}% &{" "}
              {fmtPercent(companyDailyPercent)}%
            </span>
          </div>
        </div>

        <p className="pt-2 text-xs text-white/40 leading-relaxed">
          *Daily does not represent actual or predicted returns in fiat
          currency. Please refer to the Product Rules for reward mechanisms.
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;
