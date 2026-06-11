// Central place to edit menu items
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  ChartCandlestick,
  Clock4,
  Download,
  Grid2x2,
  HandCoins,
  Landmark,
  LifeBuoy,
  Network,
  Settings,
  ShieldHalf,
  SquareGanttChart,
  TicketMinus,
  Upload,
  Wallet,
} from "lucide-react";

export type NavChild = { label: string; sublabel?: string; href: string };
export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: "new" | number;
  children?: NavChild[];
  section?: "default" | "bottom";
};

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Grid2x2, href: "/dashboard" },
  {
    key: "accounts",
    label: "Live Accounts",
    icon: ChartCandlestick,
    href: "/accounts",
  },
  {
    key: "ai-accounts",
    label: "Smart Trade",
    icon: Bot,
    href: "/ai-accounts",
  },

  {
    key: "my-staking",
    label: "My Staking",
    icon: HandCoins,
    href: "/my-staking",
  },
  // {
  //   key: "positions",
  //   label: "My Positions",
  //   icon: ChartCandlestick,

  //   children: [
  //     { label: "Open", href: "/positions" },

  //     {
  //       label: "Closed",
  //       href: "/closed-positions",
  //     },
  //   ],
  // },

  { key: "deposit", label: "Deposit", icon: Download, href: "/deposit" },
  { key: "withdraw", label: "Withdraw", icon: Upload, href: "/withdraw" },
  { key: "lottery", label: "Lottery", icon: TicketMinus, href: "/lottary" },
  { key: "loan", label: "Loan", icon: Landmark, href: "/loan" },
  {
    key: "rank-reward",
    label: "Rank Reward",
    icon: ShieldHalf,
    href: "/rank-reward",
  },
  {
    key: "wallet",
    label: "Wallet",
    icon: Wallet,

    children: [
      { label: "Send USDT", href: "/wallet/p2p" },
      {
        label: "Internal Transfer",
        href: "/transfer",
      },
    ],
  },
  {
    key: "history",
    label: "Transactions",
    icon: Clock4,
    href: "/transactions",
  },

  {
    key: "agent-zone",
    label: "Agent zone",
    icon: Network,

    children: [
      { label: "My referral", href: "/agent-zone/referral" },
      {
        label: "My clients",
        href: "/agent-zone/clients",
      },
    ],
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,

    children: [
      { label: "Profile", href: "/settings/profile" },
      {
        label: "Security",
        href: "/settings/security",
      },
    ],
  },

  // {
  //   key: "chat",
  //   label: "Live Chat",
  //   icon: MessageSquare,
  //   href: "/dashboard/chat",
  //   section: "bottom",
  // },
  {
    key: "support",
    label: "Support",
    icon: LifeBuoy,
    href: "/support",
  },
];

export const INVITE_CARD = {
  title: "Invite friends and earn money",
  icon: SquareGanttChart,
  href: "/agent-zone/referral",
};
