"use client";

import socketUrl from "@/config/socketUrl"; // ✅ dedicated socket URL
import { apiSlice } from "@/redux/features/api/apiSlice";
import { SocketUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

interface iSocketContextType {
  socket: Socket | null;
  isSocketConnected: boolean;
  onlineUsers: SocketUser[]; // Optional
}

export const SocketContext = createContext<iSocketContextType | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  /* ──────────  auth + local states  ────────── */
  const { user } = useSelector((state: any) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);
  const dispatch = useDispatch();

  /* ──────────  connect + join room  ────────── */
  useEffect(() => {
    if (!user || !user._id) return;

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      // auth: { token: user.accessToken }, // optional: secure with token
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const joinRoom = () => {
      newSocket.emit("join-room", user._id);
      setSocket(newSocket);
      setIsSocketConnected(true);
    };

    newSocket.on("connect", joinRoom);
    newSocket.on("disconnect", () => setIsSocketConnected(false));
    newSocket.on("connect_error", (err) => {
      // চাইলে UI-তে দেখাতে পারেন
      console.warn("[socket] connect_error:", err?.message || err);
    });

    return () => {
      newSocket.removeListener("connect", joinRoom);
      newSocket.disconnect();
      setSocket(null);
      setIsSocketConnected(false);
    };
  }, [user?._id]);

  /* ──────────  runtime socket listeners  ────────── */
  useEffect(() => {
    if (!socket) return;

    // -------- existing listeners --------
    const onUsers = (users: SocketUser[]) => setOnlineUsers(users);
    const onNewNotif = () => {
      dispatch(
        apiSlice.util.invalidateTags([
          "MyUnreadNotifications",
          "MyUnreadNotificationsCount",
        ])
      );
    };
    const onCount = () => {
      dispatch(apiSlice.util.invalidateTags(["MyUnreadNotificationsCount"]));
    };

    socket.on("getUsers", onUsers);
    socket.on("notifications:new", onNewNotif);
    socket.on("notifications:count", onCount);

    // -------- NEW: trading live-sync listeners --------
    // 1) যখন কোনো পজিশন ওপেন/ক্লোজ/মডিফাই হয়
    const onPositionsChanged = (payload: { accountId?: string }) => {
      // আপনার RTK Query ট্যাগ অনুযায়ী invalidate করুন
      dispatch(
        apiSlice.util.invalidateTags([
          "OpenPositionsByAccount",
          "Positions",
          { type: "OpenPositionsByAccount", id: payload?.accountId || "ANY" },
        ] as any)
      );
    };

    // 2) যখন কোনো পজিশন ক্লোজ হয় (manual/stopout)
    const onPositionClosed = (evt: {
      id: string;
      symbol: string;
      pnl: number;
      reason?: "manual" | "stopout";
      closePrice?: number;
      closedAt?: string;
    }) => {
      // কেশ ইনভ্যালিডেশন
      dispatch(
        apiSlice.util.invalidateTags([
          "Accounts",
          "Account",
          "OpenPositionsByAccount",
          "Positions",
          "ClosedPositions",
        ] as any)
      );

      // UI নোটিফাই (আপনার প্রোজেক্টে উইন্ডো ইভেন্ট ব্যবহার করেন)
      const isProfit = Number(evt.pnl) > 0;
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            kind: isProfit ? "success" : "error",
            text: `Position closed${
              evt.reason ? " (" + evt.reason + ")" : ""
            }: ${evt.symbol} • P/L ${evt.pnl?.toFixed?.(2) ?? evt.pnl}`,
          },
        })
      );

      // চাইলে নির্দিষ্ট ইভেন্টও ছড়াতে পারেন
      window.dispatchEvent(new CustomEvent("position:closed", { detail: evt }));
    };

    // 3) অ্যাকাউন্ট ব্যালান্স/ইকুইটি/মার্জিন আপডেট
    const onAccountUpdate = (evt: {
      accountId: string;
      balance: number;
      equity: number;
      marginUsed: number;
    }) => {
      dispatch(
        apiSlice.util.invalidateTags([
          "Account",
          "Accounts",
          { type: "Account", id: evt.accountId },
          "AccountSummary",
        ] as any)
      );

      // UI-তে দিতে চাইলে
      window.dispatchEvent(new CustomEvent("account:update", { detail: evt }));
    };

    socket.on("positions:changed", onPositionsChanged);
    socket.on("position:closed", onPositionClosed);
    socket.on("account:update", onAccountUpdate);

    return () => {
      socket.off("getUsers", onUsers);
      socket.off("notifications:new", onNewNotif);
      socket.off("notifications:count", onCount);

      socket.off("positions:changed", onPositionsChanged);
      socket.off("position:closed", onPositionClosed);
      socket.off("account:update", onAccountUpdate);
    };
  }, [socket, dispatch]);

  /* ──────────  provider  ────────── */
  return (
    <SocketContext.Provider value={{ socket, isSocketConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx)
    throw new Error("useSocket must be used within a SocketContextProvider");
  return ctx;
};
