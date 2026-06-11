// ─── User & Auth ──────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user'|'admin'|'super_admin'|'moderator'|'support_admin'|'finance_admin'|'kyc_admin';
  kycStatus: 'none'|'pending'|'approved'|'rejected';
  rank?: string;
  referralCode: string;
  twoFactorEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  country?: string;
  bio?: string;
  vipLevel?: number;
  vipExpiry?: string;
  gender?: string;
  dateOfBirth?: string;
  totalBalance?: number;
  status?: 'active' | 'frozen' | 'suspended';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// ─── Wallet ───────────────────────────────────────────────────────────────────
export interface Wallet {
  _id: string;
  userId: string;
  asset: string;
  walletType: string;
  balance: number;
  lockedBalance: number;
  availableBalance: number;
  address?: string;
  createdAt: string;
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export interface Transaction {
  _id: string;
  userId: string;
  walletId: string;
  type: string;
  asset: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending'|'completed'|'failed'|'cancelled';
  hash?: string;
  network?: string;
  createdAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export interface Order {
  _id: string;
  userId: string;
  symbol: string;
  side: 'buy'|'sell';
  type: 'market'|'limit'|'stop_limit'|'stop_market';
  tradingMode: 'spot'|'futures'|'margin';
  quantity: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage: number;
  status: 'pending'|'open'|'filled'|'partially_filled'|'cancelled';
  filledQuantity: number;
  avgFillPrice?: number;
  fee: number;
  totalValue: number;
  createdAt: string;
}

// ─── Market ───────────────────────────────────────────────────────────────────
export interface Ticker {
  market: string;
  price: number;
  change: 'RISE'|'FALL'|'EVEN';
  changeRate: number;
  changePrice: number;
  high: number;
  low: number;
  volume: number;
  tradeValue: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total?: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: number;
}

// ─── Rank ─────────────────────────────────────────────────────────────────────
export interface UserRank {
  _id: string;
  userId: string;
  currentRank: number;
  highestRankAchieved: number;
  teamSize: number;
  directReferrals: number;
  totalEarned: number;
  claimStatus?: string;
  pendingClaimRank?: number;
  isEligibleForNextRank: boolean;
}

export interface RankRewardImage {
  _id: string;
  imageUrl: string;
  rankLevel: number;
  rankName: string;
  message?: string;
  userAcknowledged: boolean;
  sharedToFeed: boolean;
  isPublic: boolean;
  createdAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info'|'success'|'warning'|'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ─── Stake ────────────────────────────────────────────────────────────────────
export interface Stake {
  _id: string;
  asset: string;
  packageDays: number;
  principalAmount: number;
  dailyYield: number;
  totalEarned: number;
  status: 'active'|'completed'|'cancelled';
  startDate: string;
  endDate: string;
}

// ─── Loan ─────────────────────────────────────────────────────────────────────
export interface Loan {
  _id: string;
  loanType: string;
  requestedAmount: number;
  approvedAmount?: number;
  totalRepayable?: number;
  totalPaid: number;
  status: string;
  purpose: string;
  repaymentPeriodYears: number;
  createdAt: string;
}

// ─── P2P ──────────────────────────────────────────────────────────────────────
export interface P2POrder {
  _id: string;
  creatorId: { _id: string; fullName: string; avatar?: string };
  type: 'buy'|'sell';
  asset: string;
  amount: number;
  price: number;
  minOrderLimit: number;
  maxOrderLimit: number;
  paymentMethods: string[];
  status: string;
  createdAt: string;
}

// ─── Deposit Wallet ───────────────────────────────────────────────────────────
export interface DepositWallet {
  _id: string;
  coin: string;
  network: string;
  walletAddress: string;
  label?: string;
  memo?: string;
  qrCodeUrl?: string;
  qrCodeGenerated?: string;
  explorerLink?: string;
  minDeposit: number;
  confirmationsRequired: number;
  isActive: boolean;
  isMaintenanceMode: boolean;
  depositInstructions?: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  onlineNow: number;
  totalVolume: number;
  dailyVolume: number;
  pendingWithdrawals: number;
  pendingKYC: number;
  pendingLoans: number;
  totalRevenue: number;
  newUsersToday: number;
}
