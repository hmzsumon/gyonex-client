/* ────────── client lottery shared types ────────── */
export type LotteryEventType = "WEEKLY" | "HALF_MONTHLY" | "MONTHLY";
export type LotteryStatus =
  | "draft"
  | "upcoming"
  | "open"
  | "drawn"
  | "cancelled";

/* ────────── lottery event response type ────────── */
export interface LotteryPrizeTier {
  title: string;
  quantity: number;
  amount: number;
}

/* ────────── lottery event response type ────────── */
export interface LotteryEvent {
  _id: string;
  eventType: LotteryEventType;
  title: string;
  description: string;
  prizeAmount: number;
  prizeAsset: string;
  prizeTiers?: LotteryPrizeTier[];
  ticketPrice: number;
  maxTickets: number;
  winnerCount: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: LotteryStatus;
  isAutoDraw: boolean;
  soldTickets?: number;
  myTickets?: number;
  revenue?: number;
}

/* ────────── lottery ticket response type ────────── */
export interface LotteryTicket {
  _id: string;
  eventId: LotteryEvent;
  ticketNo: string;
  price: number;
  asset: string;
  status: string;
  purchasedAt: string;
}

/* ────────── lottery winner response type ────────── */
export interface LotteryWinner {
  _id: string;
  eventId: LotteryEvent;
  ticketNo: string;
  prizeTitle?: string;
  prizeRank?: number;
  prizeAmount: number;
  prizeAsset: string;
  maskedName: string;
  country: string;
  drawnAt: string;
}
