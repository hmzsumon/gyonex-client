"use client";

import Link from "next/link";
import { BsAndroid2 } from "react-icons/bs";
import { MdPictureAsPdf } from "react-icons/md";
import { INVITE_CARD } from "./sidebar-data";

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold " +
  "bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950 hover:opacity-90 transition";

/* ── small reusable invite card ────────────────────────────── */
export default function SidebarInviteCard() {
  const handleDownload = () => {
    // Trigger download action
    const link = document.createElement("a");
    link.href = "/apk/upbit-trade.apk";
    link.download = "upbit-trade.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    // Trigger download action for PDF
    const link = document.createElement("a");
    link.href = "/docs/business-plan.pdf";
    link.download = "business-plan.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
      <div className="text-sm font-medium">{INVITE_CARD.title}</div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Link href={INVITE_CARD.href} className={`${btnPrimary} w-full`}>
          Open
        </Link>

        <button onClick={handleDownload} className={`${btnPrimary} w-full`}>
          <BsAndroid2 className="mr-2 h-4 w-4" />
          App
        </button>
        <button onClick={handleDownloadPDF} className={`${btnPrimary} w-full`}>
          <MdPictureAsPdf className="mr-2 h-4 w-4" />
          Plan
        </button>
      </div>
    </div>
  );
}
