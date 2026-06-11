"use client";

import { useGetMyTeamQuery } from "@/redux/features/auth/authApi";
import { createContext, useContext } from "react";

interface InnerContextType {
  team: {
    level_1: {
      active_users: number;
      sales: number;
    };
    level_2: {
      active_users: number;
      sales: number;
    };
    level_3: {
      active_users: number;
      sales: number;
    };

    total_active_member: number;
    total_sales: number;
  };

  team_a: number;
  team_a_sales: number;
  team_b: number;
  team_c: number;
  total_team: number;
  total_sales: number;
  total_active_member: number;
}

export const InnerContext = createContext<InnerContextType | null>(null);

export const InnerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useGetMyTeamQuery(undefined);
  const { team } = data || {};

  const team_a = team?.level_1?.active_users || 0;
  const team_a_sales = team?.level_1?.sales || 0;
  const team_b = team?.level_2?.active_users || 0;
  const team_c = team?.level_3?.active_users || 0;
  const total_team = team_a + team_b + team_c;
  const total_sales = team?.total_sales || 0;
  const total_active_member = team?.total_active_member || 0;

  return (
    <InnerContext.Provider
      value={{
        team,
        team_a,
        team_b,
        team_c,
        total_team,
        team_a_sales,
        total_sales,
        total_active_member,
      }}
    >
      {children}
    </InnerContext.Provider>
  );
};

export const useInnerContext = () => {
  const context = useContext(InnerContext);
  if (!context) {
    throw new Error(
      "useInnerContext must be used within a InnerContextProvider"
    );
  }
  return context;
};
