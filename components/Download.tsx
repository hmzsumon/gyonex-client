"use client";
import { BsAndroid2 } from "react-icons/bs";
import { MdPictureAsPdf } from "react-icons/md";

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold " +
  "bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950 hover:opacity-90 transition";

const card =
  "rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_40px_-20px_rgba(0,0,0,0.6)]";

const Download = () => {
  const handleDownload = () => {
    // Trigger download action
    const link = document.createElement("a");
    link.href = "/apk/cgfx.apk";
    link.download = "cgfx.apk";
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
    <div>
      <div className={`${card} px-2 py-4`}>
        <div className="mt-4 flex w-full flex-wrap items-center gap-3">
          <button onClick={handleDownload} className={`${btnPrimary} w-full`}>
            <BsAndroid2 className="mr-2 h-4 w-4" />
            Download Android App
          </button>
          <button
            onClick={handleDownloadPDF}
            className={`${btnPrimary} w-full`}
          >
            <MdPictureAsPdf className="mr-2 h-4 w-4" />
            Download Business Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;
