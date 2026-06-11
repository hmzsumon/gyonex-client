"use client";
import Image from "next/image";
import { gameMenuitems } from "./SidebarDesktop";

const GameMenu = () => {
  return (
    <div className="overflow-x-auto scrollbar-hide ">
      <div className="flex gap-2 w-max">
        {gameMenuitems.map((it, idx) => (
          <button
            key={idx}
            className="
                   game_menu_item rounded-lg flex items-center  gap-x-2 py-1 px-3"
          >
            <span className="relative w-9 h-9">
              <Image
                src={it.icon}
                alt={it.label}
                fill
                className="object-contain w-full h-full"
              />
            </span>
            <span className="text-[13px] leading-tight font-semibold text-[#9fd6d0]">
              {it.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;
