/* ────────── client lucky card shared types ────────── */

export type LuckyShopPackage = {
  _id: string;
  name: string;
  cardCount: number;
  bonusCards: number;
  totalCards: number;
  price: number;
  regularPrice: number;
  perCard: number;
  perCardRegular: number;
  discountPercent: number;
};

export type LuckyShopCardType = {
  _id: string;
  key: string;
  name: string;
  price: number;
  accent: string;
  rtp: number;
  topPrize: number;
  packages: LuckyShopPackage[];
};

export type LuckyCardRow = {
  _id: string;
  shortCode: string;
  status: "unopened" | "opened";
  cardType: string;
  accent: string;
  source?: "purchase" | "gift";
  serverSeedHash?: string;
  createdAt: string;
  // opened fields
  justOpened?: boolean;
  prizeAmount?: number;
  prizeLabel?: string;
  prizeCode?: string;
  revealSymbol?: string;
  win?: boolean;
  contribution?: number;
  poolSnapshot?: { code: string; balance: number; amount: number }[];
  openedAt?: string;
};

export type LuckyPurchaseRow = {
  _id: string;
  cardType: string;
  quantity: number;
  totalPrice: number;
  source?: "purchase" | "gift";
  createdAt: string;
};
