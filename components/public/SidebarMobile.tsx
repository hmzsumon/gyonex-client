"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { closeMobileSidebar } from "@/redux/features/ui/sidebarSlice";

import Image from "next/image";
import Link from "next/link";
import { IoCloseCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { gameMenuitems } from "./SidebarDesktop";

const menuItems = [
  {
    id: 1,
    label: "Promotions",
    icon: "/images/icons/promotion.svg",
    href: "/promotions",
  },
  {
    id: 2,
    label: "Home",
    icon: "/images/icons/home.svg",
    href: "/",
  },
  {
    id: 3,
    label: "Casino",
    icon: "/images/icons/games.svg",
    href: "/casino",
  },
  {
    id: 4,
    label: "Live Casino",
    icon: "/images/icons/live-casino.svg",
    href: "/casino/live-casino",
  },
  {
    id: 5,
    label: "Jackpots",
    icon: "/images/icons/jackpots.svg",
    href: "/casino/jackpots",
  },
];

const SidebarMobile = () => {
  const isMobileSidebarOpen = useSelector(
    (state: any) => state.sidebar.isMobileSidebarOpen
  );

  const dispatch = useDispatch();
  return (
    <>
      {/* Mobile Sidebar Button + Sheet */}
      <div className="  p-2">
        <Sheet
          open={isMobileSidebarOpen}
          onOpenChange={() => dispatch(closeMobileSidebar())}
        >
          <SheetContent
            side="left"
            className="w-60
             border-none bg-[#044243]  overflow-y-auto  [&>button]:hidden "
          >
            <div>
              <div className="relative ">
                <span
                  className="text-[#9fd6d0] text-lg font-semibold absolute -right-5 -top-9"
                  onClick={() => dispatch(closeMobileSidebar())}
                >
                  <IoCloseCircle className="text-3xl " />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
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
                        <Image
                          src={item.icon}
                          alt={item.label}
                          className="w-10 "
                        />
                      </span>
                      <span className="text-[13px] leading-tight font-semibold text-[#9fd6d0]">
                        {item.label}
                      </span>
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default SidebarMobile;
