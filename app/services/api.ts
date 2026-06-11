import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/components/stores/auth.store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ─── Axios Instance ────────────────────────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response Interceptor (auto refresh) ──────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = res.data.data;
        useAuthStore.getState().setTokens(accessToken);
        refreshQueue.forEach((cb) => cb(accessToken));
        refreshQueue = [];
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  register:      (data: object)         => apiClient.post('/auth/register', data),
  login:         (data: object)         => apiClient.post('/auth/login', data),
  logout:        ()                     => apiClient.post('/auth/logout'),
  refresh:       ()                     => apiClient.post('/auth/refresh'),
  verifyEmail:   (token: string)        => apiClient.get(`/auth/verify-email/${token}`),
  forgotPassword:(email: string)        => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => apiClient.post(`/auth/reset-password/${token}`, { password }),
  setup2FA:      ()                     => apiClient.post('/auth/2fa/setup'),
  enable2FA:     (totpCode: string)     => apiClient.post('/auth/2fa/enable', { totpCode }),
  disable2FA:    (totpCode: string, password: string) => apiClient.post('/auth/2fa/disable', { totpCode, password }),
};

// ─── User API ─────────────────────────────────────────────────────────────────
export const userApi = {
  getMe:          ()               => apiClient.get('/users/me'),
  updateProfile:  (data: object)   => apiClient.patch('/users/me/profile', data),
  changePassword: (data: object)   => apiClient.patch('/users/me/password', data),
  getWallets:     ()               => apiClient.get('/users/me/wallets'),
  getLoginHistory:()               => apiClient.get('/users/meauth/login-history'),
  getSessions:    ()               => apiClient.get('/users/me/sessions'),
  terminateSession:(id: string)    => apiClient.delete(`/users/me/sessions/${id}`),
};

// ─── Market API ───────────────────────────────────────────────────────────────
export const marketApi = {
  getMarkets:  ()                                         => apiClient.get('/markets'),
  getTicker:   (markets: string)                          => apiClient.get(`/markets/ticker?markets=${markets}`),
  getOrderbook:(markets: string)                          => apiClient.get(`/markets/orderbook?markets=${markets}`),
  getCandles:  (market: string, unit = '60', count = 200) => apiClient.get(`/markets/${market}/candles?unit=${unit}&count=${count}`),
  getTrades:   (market: string)                           => apiClient.get(`/markets/${market}/trades`),
  getOverview: ()                                         => apiClient.get('/markets/overview/summary'),
};

// ─── Wallet API ───────────────────────────────────────────────────────────────
export const walletApi = {
  getWallets:      ()              => apiClient.get('/wallets'),
  getTransactions: (params?: object) => apiClient.get('/wallets/transactions', { params }),
  withdraw:        (data: object)  => apiClient.post('/wallets/withdraw', data),
  transfer:        (data: object)  => apiClient.post('/wallets/transfer', data),
  confirmDeposit:  (data: object)  => apiClient.post('/wallets/deposit/confirm', data),
  getDepositWallets:(coin: string) => apiClient.get(`/deposit-wallets/${coin.toUpperCase()}`),
  getAllDepositWallets: ()         => apiClient.get('/deposit-wallets'),
};

// ─── Trading API ──────────────────────────────────────────────────────────────
export const tradingApi = {
  submitOrder:   (data: object)    => apiClient.post('/trading/order', data),
  cancelOrder:   (id: string)      => apiClient.delete(`/trading/order/${id}`),
  getOrders:     (params?: object) => apiClient.get('/orders', { params }),
  getOpenOrders: ()                => apiClient.get('/orders/open'),
  getHistory:    (params?: object) => apiClient.get('/trading/history', { params }),
  getPortfolio:  ()                => apiClient.get('/trading/portfolio'),
  calcMargin:    (data: object)    => apiClient.post('/trading/calculator/margin', data),
};

// ─── Staking API ──────────────────────────────────────────────────────────────
export const stakingApi = {
  getPackages: ()             => apiClient.get('/staking/packages'),
  getMyStakes: ()             => apiClient.get('/staking/my'),
  stake:       (data: object) => apiClient.post('/staking/stake', data),
  unstake:     (id: string)   => apiClient.post(`/staking/unstake/${id}`),
};

// ─── Loans API ────────────────────────────────────────────────────────────────
export const loansApi = {
  getPackages: ()                                => apiClient.get('/loans/packages'),
  getMyLoans:  ()                                => apiClient.get('/loans/my'),
  apply:       (data: object)                    => apiClient.post('/loans/apply', data),
  repay:       (id: string, data: object)        => apiClient.post(`/loans/${id}/repay`, data),
};

// ─── Ranks API ────────────────────────────────────────────────────────────────
export const ranksApi = {
  getConfig:        ()                => apiClient.get('/ranks/config'),
  getMyRank:        ()                => apiClient.get('/ranks/me'),
  claim:            (rank: number)    => apiClient.post('/ranks/claim', { targetRank: rank }),
  getLeaderboard:   ()                => apiClient.get('/ranks/leaderboard'),
  getShowcase:      ()                => apiClient.get('/ranks/showcase'),
  acknowledgeImage: (id: string)      => apiClient.post(`/ranks/images/${id}/acknowledge`),
  shareImage:       (id: string)      => apiClient.post(`/ranks/images/${id}/share`),
  claimSalary:      ()                => apiClient.post('/ranks/salary/claim'),
};

// ─── OTP API ──────────────────────────────────────────────────────────────────
export const otpApi = {
  send:         (data: object)                          => apiClient.post('/otp/send', data),
  sendSecure:   (purpose: string)                       => apiClient.post('/otp/send/secure', { purpose }),
  verify:       (data: object)                          => apiClient.post('/otp/verify', data),
  verifySecure: (code: string, purpose: string)         => apiClient.post('/otp/verify/secure', { code, purpose }),
};

// ─── KYC API ──────────────────────────────────────────────────────────────────
export const kycApi = {
  getStatus: ()               => apiClient.get('/kyc/my'),
  submit:    (data: FormData) => apiClient.post('/kyc/submit', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ─── Notifications API ────────────────────────────────────────────────────────
export const notificationsApi = {
  getAll:      (params?: object) => apiClient.get('/notifications', { params }),
  markRead:    (id: string)      => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: ()                => apiClient.patch('/notifications/read-all'),
  delete:      (id: string)      => apiClient.delete(`/notifications/${id}`),
};

// ─── Referral API ─────────────────────────────────────────────────────────────
export const referralApi = {
  getStats:       () => apiClient.get('/referrals/stats'),
  getTree:        () => apiClient.get('/referrals/tree'),
  getCommissions: () => apiClient.get('/referrals/commissions'),
};

// ─── CMS API ──────────────────────────────────────────────────────────────────
export const cmsApi = {
  getBanners:  (section: string) => apiClient.get(`/cms/banners/${section}`),
  getBlog:     (params?: object) => apiClient.get('/cms/blog', { params }),
  getBlogPost: (slug: string)    => apiClient.get(`/cms/blog/${slug}`),
};

// ─── Support API ──────────────────────────────────────────────────────────────
export const supportApi = {
  getMyTickets: ()                                         => apiClient.get('/support/my'),
  createTicket: (data: object)                             => apiClient.post('/support', data),
  getTicket:    (id: string)                               => apiClient.get(`/support/${id}`),
  reply:        (id: string, message: string)              => apiClient.post(`/support/${id}/reply`, { message }),
};

// ─── P2P API ──────────────────────────────────────────────────────────────────
export const p2pApi = {
  getOrders:       (params?: object) => apiClient.get('/p2p/orders', { params }),
  createOrder:     (data: object)    => apiClient.post('/p2p/orders', data),
  getMyOrders:     ()                => apiClient.get('/p2p/my-orders'),
  initiateTrade:   (orderId: string, data: object) => apiClient.post(`/p2p/orders/${orderId}/trade`, data),
  confirmPayment:  (tradeId: string) => apiClient.post(`/p2p/trades/${tradeId}/confirm-payment`),
  releaseFunds:    (tradeId: string) => apiClient.post(`/p2p/trades/${tradeId}/release`),
  dispute:         (tradeId: string, reason: string) => apiClient.post(`/p2p/trades/${tradeId}/dispute`, { reason }),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminApi = {
  // Dashboard
  getStats:   ()               => apiClient.get('/admin/dashboard'),

  // Users
  getUsers:   (params?: object) => apiClient.get('/admin/users', { params }),
  getUserById:(id: string)      => apiClient.get(`/admin/users/${id}`),
  updateUser: (id: string, data: object) => apiClient.patch(`/admin/users/${id}/role`, data),
  freezeUser: (id: string)      => apiClient.patch(`/admin/users/${id}/status`, { status: 'suspended' }),

  // KYC
  getKYC:     (params?: object) => apiClient.get('/kyc/admin/list', { params }),
  approveKYC: (id: string, note?: string) => apiClient.patch(`/kyc/admin/${id}/approve`, { note }),
  rejectKYC:  (id: string, reason: string) => apiClient.patch(`/kyc/admin/${id}/reject`, { reason }),

  // Withdrawals / Transactions
  getWithdrawals: (params?: object) => apiClient.get('/admin/transactions', { params: { ...params as object, type: 'withdraw' } }),
  approveWithdrawal: (id: string)   => apiClient.patch(`/admin/transactions/${id}/approve`),
  rejectWithdrawal:  (id: string, reason: string) => apiClient.patch(`/admin/transactions/${id}/reject`, { reason }),

  // Loans
  getLoans:    (params?: object) => apiClient.get('/loans/admin/all', { params }),
  approveLoan: (id: string, data: object) => apiClient.patch(`/loans/admin/${id}/approve`, data),
  rejectLoan:  (id: string, reason: string) => apiClient.patch(`/loans/admin/${id}/reject`, { reason }),

  // Financial controls
  adjustBalance:    (data: object) => apiClient.post('/admin/financial/balance/adjust', data),
  bulkCredit:       (data: object) => apiClient.post('/admin/financial/balance/bulk-credit', data),
  releaseROI:       (data: object) => apiClient.post('/admin/financial/roi/release', data),

  // Trading
  pauseTrading:  (reason?: string) => apiClient.post('/admin/trading/pause', { reason }),
  resumeTrading: ()                => apiClient.post('/admin/trading/resume'),

  // Ranks
  getRankClaims:   ()               => apiClient.get('/ranks/admin/pending-claims'),
  uploadRankImage: (data: FormData) => apiClient.post('/ranks/admin/upload-image', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  rejectRankClaim: (userId: string, reason: string) => apiClient.post('/ranks/admin/reject-claim', { userId, reason }),
  disburseSalary:  (month: number, year: number) => apiClient.post('/ranks/admin/disburse-salary', { month, year }),

  // Deposit Wallets
  getDepositWallets:   ()               => apiClient.get('/deposit-wallets/admin/all'),
  addDepositWallet:    (data: object | FormData) => apiClient.post('/deposit-wallets/admin', data),
  updateDepositWallet: (id: string, data: object) => apiClient.patch(`/deposit-wallets/admin/${id}`, data),
  toggleDepositWallet: (id: string)     => apiClient.patch(`/deposit-wallets/admin/${id}/toggle`),
  deleteDepositWallet: (id: string)     => apiClient.delete(`/deposit-wallets/admin/${id}`),

  // CMS - Media
  uploadMedia:  (data: FormData) => apiClient.post('/cms/media/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMedia:     (params?: object) => apiClient.get('/cms/media', { params }),
  deleteMedia:  (id: string)     => apiClient.delete(`/cms/media/${id}`),

  // CMS - Banners
  createBanner: (data: FormData) => apiClient.post('/cms/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner: (id: string, data: object) => apiClient.patch(`/cms/banners/${id}`, data),
  deleteBanner: (id: string)     => apiClient.delete(`/cms/banners/${id}`),

  // CMS - Blog
  getAdminBlog:   ()               => apiClient.get('/cms/admin/blog'),
  createBlogPost: (data: FormData) => apiClient.post('/cms/admin/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBlogPost: (id: string, data: object) => apiClient.patch(`/cms/admin/blog/${id}`, data),
  deleteBlogPost: (id: string)     => apiClient.delete(`/cms/admin/blog/${id}`),

  // Lottery
  createDraw:   (data: object)   => apiClient.post('/admin/financial/lottery/draw', data),
  getDraws:     ()               => apiClient.get('/admin/financial/lottery/draws'),
  selectWinner: (drawId: string, data: object) => apiClient.post(`/admin/financial/lottery/${drawId}/select-winner`, data),

  // Broadcast
  broadcastNotification: (data: object) => apiClient.post('/admin/broadcast', data),

  // Logs
  getSystemLogs: (params?: object) => apiClient.get('/admin/logs', { params }),

  // Staking
  pauseStake: (stakeId: string) => apiClient.patch(`/admin/financial/staking/${stakeId}/pause`),
};
