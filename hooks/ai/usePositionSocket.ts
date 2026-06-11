// hooks/usePositionSocket.ts
"use client";

import { useSocket } from "@/context/SocketContext";
import { useGetAllAiPositionsQuery } from "@/redux/features/ai-account/ai-accountApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelectedAiAccount } from "../useSelectedAiAccount";

function same(a?: string, b?: string) {
  return String(a || "").toLowerCase() === String(b || "").toLowerCase();
}

export function usePositionSocket() {
  const { socket, isSocketConnected } = useSocket();
  const { account } = useSelectedAiAccount();
  const { refetch } = useGetAllAiPositionsQuery();

  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    // const onOpened = (p: any) => {
    //   toast.success(
    //     `Opened ${p?.symbol} ${String(p?.side).toUpperCase()} • ${Number(
    //       p?.lots
    //     ).toFixed(2)} lot @ ${Number(p?.entryPrice).toFixed(2)}`
    //   );
    //   refetch();
    // };

    const onOpened = (p: any) => {
      // 🔎 শুধুই নিজের প্ল্যান/অ্যাকাউন্ট হলে নেবে
      if (account && !same(p?.plan, account.plan)) return;
      // চাইলে অ্যাকাউন্ট ম্যাচও করতে পারেন:
      // if (account && String(p?.accountId) !== String(account._id)) return;

      toast.success(
        `Opened ${p?.symbol} ${String(p?.side).toUpperCase()} • ${Number(
          p?.lots
        ).toFixed(2)} lot @ ${Number(p?.entryPrice).toFixed(2)}`
      );
      refetch();
    };

    const onClosed = (p: any) => {
      if (p.closedBy === "ai") {
        toast.success(
          `Closed ${p?.symbol} ${String(p?.side).toUpperCase()} • P/L $${Number(
            p?.takeProfit
          ).toFixed(2)}`
        );
      }
      refetch();
    };

    socket.on("position:opened", onOpened);
    socket.on("position:closed", onClosed);

    // চাইলে অ্যাডমিন/মনিটরের জন্য:
    // socket.on("position:opened:all", onOpened);
    // socket.on("position:closed:all", onClosed);

    return () => {
      socket.off("position:opened", onOpened);
      socket.off("position:closed", onClosed);
      // socket.off("position:opened:all", onOpened);
      // socket.off("position:closed:all", onClosed);
    };
  }, [socket, isSocketConnected, refetch]);
}
