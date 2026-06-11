"use client";

import HistoryIcon from "@/public/images/icons/history.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

import { BreadcrumbInner } from "@/components/inner-auth/BreadcrumbInner";
import { InnerContextProvider } from "@/context/InnerContext";

const InnerLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();
  const pathname = usePathname();

  // Split the path into parts (e.g. /settings/personal-info → ['settings', 'personal-info'])
  const segments = pathname.split("/").filter((seg) => seg !== ""); // remove empty strings

  const iconRoutes = ["deposit", "withdraw", "transfer"];
  const isIcon = iconRoutes.includes(segments[0]);

  return (
    <div className="">
      <div className="fixed top-0 left-0 w-full z-50 border-b ">
        <div className="flex items-center justify-between px-4 py-2 ">
          <button type="button" onClick={() => router.back()}>
            <MdKeyboardDoubleArrowLeft className="" />
          </button>
          <div>
            <BreadcrumbInner />
          </div>

          {isIcon ? (
            <Link
              href={`${segments[0].replace(/-/g, " ")}-history`}
              className="flex items-center gap-2"
            >
              <Image src={HistoryIcon} alt="History Icon" className="w-5 h-5" />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div className="py-[0.09rem] mt-10">
        <InnerContextProvider>
          <div className="pb-20">{children}</div>
        </InnerContextProvider>
      </div>
    </div>
  );
};

export default InnerLayout;
