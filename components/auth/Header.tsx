"use client";

import { formatBalance } from "@/lib/functions";
import LogoImg from "@/public/logo/gyonex1.png";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Menu,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import BalanceMenu from "./BalanceMenu";
import NotificationDrawer from "./NotificationDrawer";
import UserMenu from "./UserMenu";
/* ────────── add: unread count hook ────────── */
import { useGetMyUnreadNotificationsCountQuery } from "@/redux/features/notifications/notificationApi";
import Logo from "../branding/Logo";

/* ────────── Props: what Header receives ────────── */
type Props = {
  open: boolean; // mobile sidebar (Drawer) open state
  onToggle: () => void; // toggles mobile sidebar
};

export default function Header({ open, onToggle }: Props) {
  /* ────────── Local UI state: popovers/drawers ────────── */
  const [notifOpen, setNotifOpen] = useState(false); // notification drawer
  const [balanceOpen, setBalanceOpen] = useState(false); // balance menu
  const [userOpen, setUserOpen] = useState(false); // user menu

  /* ────────── Get user from global Redux store ────────── */
  const { user } = useSelector((state: any) => state.auth);

  /* ────────── Fetch unread notifications count ────────── */
  const { data: countData } = useGetMyUnreadNotificationsCountQuery(undefined, {
    // optional: gently keep it fresh
    pollingInterval: 30_000, // 30s
    skip: !user?._id, // skip if no user
  });
  const unreadCount = countData?.dataCount ?? 0;

  /* ────────── Close all overlays on ESC ────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setBalanceOpen(false);
        setUserOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ────────── Refs for outside-click handling ────────── */
  const balanceRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  /* ────────── Close balance/user menus on outside click ────────── */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (balanceRef.current && !balanceRef.current.contains(t)) {
        setBalanceOpen(false);
      }
      if (userRef.current && !userRef.current.contains(t)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    /* ────────── Top fixed header: border + blurred backdrop ────────── */
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-900/60 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      {/* ────────── Content container: left brand/menu, right actions ────────── */}
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ────────── Left: mobile menu button + brand ────────── */}
        <div className="flex min-w-0 items-center gap-3">
          {/* ── Mobile menu toggle (visible on <md) ── */}
          <button
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white md:hidden"
            onClick={onToggle}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* ── Brand / logo ── */}
          <div>
            <Logo src={LogoImg} size="xl" width={120} />
          </div>
        </div>

        {/* ────────── Right: action buttons (Balance, Notifications, User) ────────── */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* ── Balance dropdown (md and up) ── */}
          <div ref={balanceRef} className="relative hidden md:block">
            <button
              onClick={() => {
                setBalanceOpen((v) => !v); // toggle
                setUserOpen(false); // close others
                setNotifOpen(false);
              }}
              aria-haspopup="dialog"
              aria-expanded={balanceOpen}
              className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-neutral-200 hover:bg-neutral-900 ${
                balanceOpen ? "ring-1 ring-neutral-700" : ""
              }`}
            >
              <Wallet size={18} />
              <span className="font-semibold">
                {formatBalance(user?.m_balance ? user.m_balance : 0)}
              </span>
              <span className="text-neutral-400">USD</span>
              <ChevronDown size={14} className="text-neutral-400" />
            </button>
            {/* ── Balance popover content ── */}
            <BalanceMenu open={balanceOpen} />
          </div>

          {/* ── Open notifications drawer + unread badge ── */}
          <div className="relative">
            <button
              className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              onClick={() => {
                setNotifOpen(true);
                setUserOpen(false);
                setBalanceOpen(false);
              }}
              aria-haspopup="dialog"
              aria-expanded={notifOpen}
              aria-label={
                unreadCount > 0
                  ? `Open notifications, ${unreadCount} unread`
                  : "Open notifications"
              }
            >
              <Bell size={20} />
            </button>

            {/* badge */}
            {unreadCount > 0 && (
              <span
                className="pointer-events-none absolute -right-1 -top-1 min-w-[18px] rounded-full border border-neutral-900 bg-red-600 px-1 text-center text-[10px] font-bold leading-4 text-white"
                aria-hidden
                title={`${unreadCount} unread`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          {/* ── User menu (md and up) ── */}
          <div ref={userRef} className="relative hidden md:block">
            <button
              onClick={() => {
                setUserOpen((v) => !v); // toggle
                setBalanceOpen(false);
                setNotifOpen(false);
              }}
              aria-haspopup="menu"
              aria-expanded={userOpen}
              className={`rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white ${
                userOpen ? "ring-1 ring-neutral-700" : ""
              }`}
            >
              <CircleUserRound size={20} />
            </button>
            {/* ── User dropdown content ── */}
            <UserMenu open={userOpen} />
          </div>
        </div>
      </div>

      {/* ────────── Right-side notification drawer (starts below header) ────────── */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        topOffset={64} // 16 * 4 = 64 → align drawer below the 64px header
      />
    </header>
  );
}
