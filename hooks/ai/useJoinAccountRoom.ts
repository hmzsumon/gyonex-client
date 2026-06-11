// hooks/useJoinAccountRoom.ts
"use client";

import { useSocket } from "@/context/SocketContext";
import { useEffect } from "react";

/** নির্দিষ্ট অ্যাকাউন্ট রুম-এ যুক্ত হও (যদি account-wise ব্রডকাস্ট করো) */
export function useJoinAccountRoom(accountId?: string) {
  const { socket, isSocketConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isSocketConnected || !accountId) return;
    const room = `account:${accountId}`;
    socket.emit("join-room", room);
    return () => {
      // আলাদা leave দরকার হলে সার্ভারে সাপোর্ট করতে হবে।
      // socket.emit("leave-room", room);
    };
  }, [socket, isSocketConnected, accountId]);
}
