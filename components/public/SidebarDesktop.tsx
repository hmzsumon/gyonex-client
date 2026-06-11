"use client";

import FavoriteIcon from "@/public/icons/favorites.png";
import HotIcon from "@/public/icons/hot_game.png";
import InviteIcon from "@/public/icons/invite.png";
import LiveIcon from "@/public/icons/live_casino.png";
import ManualIcon from "@/public/icons/manul_rebet.png";
import Promotion from "@/public/icons/promotion.png";
import RewordIcon from "@/public/icons/reword.png";
import SlotIcon from "@/public/icons/slots.png";
import SportIcon from "@/public/icons/sports.png";
import VipIcon from "@/public/icons/vip.png";
import Image from "next/image";
import Link from "next/link";

export const gameMenuitems = [
  { id: 1, label: "Hot Game", icon: HotIcon, href: "/dashboard" },
  {
    id: 2,
    label: "Invite friends",
    icon: InviteIcon,
    href: "/invite-friends",
  },
  { id: 3, label: "Favorites", icon: FavoriteIcon, href: "/dashboard" },
  { id: 4, label: "Promotion", icon: Promotion, href: "/dashboard" },
  { id: 5, label: "Slots", icon: SlotIcon, href: "/dashboard" },
  {
    id: 6,
    label: "Rewards Center",
    icon: RewordIcon,
    href: "/dashboard",
  },
  { id: 7, label: "Live Casino", icon: LiveIcon, href: "/dashboard" },
  {
    id: 8,
    label: "Manual Rebate",
    icon: ManualIcon,
    href: "/dashboard",
  },
  { id: 9, label: "Sports", icon: SportIcon, href: "/dashboard" },
  { id: 10, label: "VIP", icon: VipIcon, href: "/dashboard" },
];

export default function SidebarDesktop() {
  return (
    <div className="w-full inset-y-0">
      <div className=" p-3 bg-[#063b36]">
        <div className="grid grid-cols-2 gap-3">
          {gameMenuitems.map((item) => (
            <Link key={item.id} href={item.href} className="w-full">
              <button
                key={item.id}
                className="
                          sidebar_menu_item
                                        shrink-0 
                                        rounded-2xl px-3 py-2
                                        flex flex-col items-center justify-center text-center
                                        snap-start
                                        transition-transform hover:-translate-y-0.5
                                        outline-none
                                        w-full
                                        "
              >
                <span className="">
                  <Image src={item.icon} alt={item.label} className="w-10 " />
                </span>
                <span className="text-[13px] leading-tight font-semibold text-[#9fd6d0]">
                  {item.label}
                </span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
