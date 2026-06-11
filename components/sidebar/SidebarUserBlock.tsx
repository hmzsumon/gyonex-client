"use client";

import CopyToClipboard from "@/lib/CopyToClipboard";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

/* ── user header block used in Mobile ──────────────────────── */
export default function SidebarUserBlock() {
  const { user } = useSelector((s: any) => s.auth);
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();

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
    <div className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
      <div className="flex items-center gap-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-white">
            <span>{user?.name} </span>
            {user?.rank !== "User" && (
              <span className="text-xs text-neutral-400 capitalize">
                ({user?.rank})
              </span>
            )}
          </div>
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>{user?.email} </span>
            <span>
              <CopyToClipboard text={user?.email || ""} />
            </span>
          </div>
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>{user?.customerId} </span>
            <span>
              <CopyToClipboard text={user?.customerId || ""} />
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full  rounded-lg px-2 py-2 text-left text-sm hover:bg-orange-500/50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
