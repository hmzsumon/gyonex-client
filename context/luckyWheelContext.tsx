"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type User = {
  id: string;
  name: string;
  balance: number;
};

type BetAmount = {
  bet_amount: number;
};

type LuckyWheelContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  setBalance: (balance: number) => void; // absolute set
  updateBalance: (delta: number) => void; // add/subtract
};

const LuckyWheelContext = createContext<LuckyWheelContextType | undefined>(
  undefined
);

export const LuckyWheelProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return initialUser ?? null;
    const saved = window.localStorage.getItem("lw:user");
    return saved ? (JSON.parse(saved) as User) : initialUser ?? null;
  });

  // persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) window.localStorage.setItem("lw:user", JSON.stringify(user));
    else window.localStorage.removeItem("lw:user");
  }, [user]);

  const setBalance = (balance: number) => {
    setUser((u) => (u ? { ...u, balance } : u));
  };

  const updateBalance = (delta: number) => {
    setUser((u) => (u ? { ...u, balance: u.balance + delta } : u));
  };

  const value = useMemo(
    () => ({ user, setUser, setBalance, updateBalance }),
    [user]
  );

  return (
    <LuckyWheelContext.Provider value={value}>
      {children}
    </LuckyWheelContext.Provider>
  );
};

export const useLuckyWheelContext = () => {
  const ctx = useContext(LuckyWheelContext);
  if (!ctx) {
    throw new Error(
      "useLuckyWheelContext must be used within LuckyWheelProvider"
    );
  }
  return ctx;
};
