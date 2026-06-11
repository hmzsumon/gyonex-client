import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { closeUserSidebar } from "@/redux/features/ui/sidebarSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useDispatch } from "react-redux";

const LogoutButton: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const [logoutUser] = useLogoutUserMutation();
  const handleLogout = () => {
    logoutUser(undefined)
      .unwrap()
      .then(() => {
        router.push("/login"); // Redirect to login page after logout
        dispatch(closeUserSidebar()); // Close the sidebar
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
    setShowLogoutConfirm(false);
  };

  return (
    <div className="w-full px-2 ">
      <button
        className=" balance-info w-full rounded-lg flex items-center justify-center gap-2 text-[#ffc403] p-2 font-bold"
        onClick={handleLogout}
      >
        <span className="icon logout__icon" aria-hidden="true">
          <RiLogoutBoxRLine className="text-xl" />
        </span>
        Log out
      </button>
    </div>
  );
};

export default LogoutButton;
