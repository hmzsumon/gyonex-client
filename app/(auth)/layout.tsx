"use client";
import DashboardShell from "@/components/auth/Layout";
import { useLoadUserQuery } from "@/redux/features/auth/authApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useLoadUserQuery();
  return <DashboardShell>{children}</DashboardShell>;
}
