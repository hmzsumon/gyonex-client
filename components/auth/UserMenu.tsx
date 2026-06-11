"use client";

import CopyToClipboard from "@/lib/CopyToClipboard";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function UserMenu({ open }: { open: boolean }) {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser(undefined).unwrap();
      toast.success("Logout successfully");

      router.push("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div
      className={`absolute right-0 mt-2 w-72 rounded-xl border border-neutral-800 bg-neutral-950/95 p-2 shadow-xl transition-all ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      }`}
      role="menu"
    >
      <div className="flex items-center gap-3 rounded-lg p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-200">
          HK
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-white">
            {user?.name}
          </div>
          <div className="truncate text-xs text-neutral-400">{user?.email}</div>
        </div>
      </div>

      <button
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
        role="menuitem"
      >
        <span className="inline-flex items-center gap-2">
          <Settings size={16} /> {user?.customerId}
        </span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
          <CopyToClipboard text={user?.customerId || ""} />
        </span>
      </button>

      <div className="my-1 border-t border-neutral-900" />

      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-900 disabled:opacity-60"
        role="menuitem"
      >
        <LogOut size={16} />
        {isLoading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
