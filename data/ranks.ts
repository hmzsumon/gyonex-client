/* ────────── comments ────────── */
/* Central rank configuration. Edit targets/rewards/copy here. */
/* ────────── comments ────────── */
export type RankKey =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "emerald"
  | "master";

export interface RankConfig {
  key: RankKey;
  title: string;
  directRefTarget: number; // required direct referrals
  minInvestTarget: number; // minimum investment
  rewardUsd: number; // reward amount (USD)
  blurb: string; // short description
  color: string; // Tailwind gradient classes
}

export const RANKS: RankConfig[] = [
  {
    key: "bronze",
    title: "Bronze",
    directRefTarget: 5,
    minInvestTarget: 500,
    rewardUsd: 100,
    blurb: "Great starting tier—unlock fast track benefits.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    key: "silver",
    title: "Silver",
    directRefTarget: 15,
    minInvestTarget: 1500,
    rewardUsd: 200,
    blurb: "Steady growth with balanced targets.",
    color: "from-blue-600 to-indigo-600",
  },
  {
    key: "gold",
    title: "Gold",
    directRefTarget: 30,
    minInvestTarget: 2500,
    rewardUsd: 300,
    blurb: "Higher benefits and bonus rates.",
    color: "from-blue-700 to-indigo-700",
  },
  {
    key: "platinum",
    title: "Platinum",
    directRefTarget: 90,
    minInvestTarget: 9000,
    rewardUsd: 500,
    blurb: "Premium tier with elevated commissions.",
    color: "from-indigo-600 to-purple-600",
  },
  {
    key: "diamond",
    title: "Diamond",
    directRefTarget: 200,
    minInvestTarget: 50000,
    rewardUsd: 1000,
    blurb: "Exclusive level for top performers.",
    color: "from-indigo-700 to-purple-700",
  },
  {
    key: "emerald",
    title: "Emerald",
    directRefTarget: 300,
    minInvestTarget: 50000,
    rewardUsd: 2000,
    blurb: "High-impact network builder tier.",
    color: "from-teal-600 to-cyan-600",
  },
  {
    key: "master",
    title: "Master",
    directRefTarget: 1000,
    minInvestTarget: 100000,
    rewardUsd: 10000,
    blurb: "Leader level with maximum benefits.",
    color: "from-yellow-500 to-amber-600",
  },
];

/* Demo user progress (replace with API data later) */
export const userProgress = {
  directRef: 12,
  invested: 3000,
};
