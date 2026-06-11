// app/support/page.tsx
"use client";

import {
  BookOpen,
  LifeBuoy,
  Mail,
  MessageCircle,
  MessageSquare,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { BsAndroid2 } from "react-icons/bs";
import { MdPictureAsPdf } from "react-icons/md";

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold " +
  "bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950 hover:opacity-90 transition";

const card =
  "rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_40px_-20px_rgba(0,0,0,0.6)]";

export default function SupportPage() {
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
    <main className="mx-auto max-w-5xl px-2 py-6 text-white">
      {/* Hero */}
      <section className="mb-6 grid gap-4 ">
        <div className={`${card} px-2 py-4`}>
          <h1 className="text-2xl font-extrabold tracking-tight">Need help?</h1>
          <p className="mt-1 text-neutral-300">
            We’re here to help with accounts, deposits & withdrawals, Smart
            trade, and security.
          </p>

          <div className="mt-4 flex w-full flex-wrap items-center gap-3">
            <Link href="/faq" className={`${btnPrimary} w-full`}>
              <BookOpen className="mr-2 h-4 w-4" />
              Browse FAQs
            </Link>
            <a
              href="mailto:support@upbittrade.com"
              className="rounded-lg w-full border border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              <Mail className="mr-2 inline h-4 w-4" />
              Email support
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-400">
            <span className="inline-flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-neutral-300" /> 24/7 ticket
              support
            </span>
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-neutral-300" /> Account & security
              help
            </span>
          </div>
        </div>

        {/*  ────────── For Download app/pdf ────────── */}

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

        {/* Quick contact */}
        <div className={`${card} px-2 py-4`}>
          <h2 className="mb-3 ml-2 text-lg font-semibold">Contact us</h2>
          <div className="space-y-3 text-sm">
            <a
              href="mailto:support@upbittrade.com"
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:bg-neutral-800/60"
            >
              <div className="flex flex-col w-full   gap-3">
                <div className="font-medium flex items-center justify-between ">
                  <span>Email</span>
                  <span className="text-neutral-400 text-left">~12h avg</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <div className="text-neutral-400">support@upbittrade.com</div>
                </div>
              </div>
            </a>

            {/*  ────────── For telegram ────────── */}
            <a
              href="https://t.me/+ipisFiXeP1RiMWU1"
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:bg-neutral-800/60"
            >
              <div className="flex flex-col w-full   gap-3">
                <div className="font-medium flex items-center justify-between ">
                  <span>Telegram</span>
                  <span className="text-neutral-400 text-left">Group</span>
                </div>

                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <div className="text-neutral-400">
                    <div className="text-neutral-400">Upbit Trade</div>
                  </div>
                </div>
              </div>
            </a>

            {/*  ────────── For phone/hotline ────────── */}

            <a
              href="https://wa.me/+917501958872"
              target="_blank"
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:bg-neutral-800/60"
            >
              <div className="flex flex-col w-full   gap-3">
                <div className="font-medium flex items-center justify-between ">
                  <span>Hotline</span>
                  <span className="text-neutral-400 text-left">Telegram</span>
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <div className="text-neutral-400">
                    <div className="text-neutral-400">
                      +16693268982 (@Ifra00Joly)
                    </div>
                  </div>
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/+13863955607"
              target="_blank"
              className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:bg-neutral-800/60"
            >
              <div className="flex flex-col w-full   gap-3">
                <div className="font-medium flex items-center justify-between ">
                  <span>Hotline</span>
                  <span className="text-neutral-400 text-left">WhatsApp</span>
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <div className="text-neutral-400">
                    <div className="text-neutral-400">+13863955607</div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Quick answers (from your Business Plan) */}
      <section className={`${card} px-2 py-4`}>
        <h2 className="mb-4 text-lg font-semibold">Quick answers</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">
              Minimum deposit (Smart Trade)
            </div>
            <p className="text-sm text-neutral-300">
              To join AI Trade you need at least{" "}
              <span className="font-semibold">$30</span>. Regular deposit min
              can be lower.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">Withdraw rules</div>
            <p className="text-sm text-neutral-300">
              Network: <span className="font-semibold">TRC20</span>. Minimum
              withdraw <span className="font-semibold">$20</span>, fee{" "}
              <span className="font-semibold">8%</span>. User→User transfer min{" "}
              <span className="font-semibold">$10</span>.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">
              Smart Trade profit sharing
            </div>
            <p className="text-sm text-neutral-300">
              You receive <span className="font-semibold">60%</span> of Smart
              profit. Company receives{" "}
              <span className="font-semibold">15%</span>; from that flow, upline
              gets <span className="font-semibold">25%</span>. Upline commission
              sharing applies (see below).
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">
              Upline commission levels
            </div>
            <p className="text-sm text-neutral-300">
              Five levels share: <span className="font-semibold">30%</span>,{" "}
              <span className="font-semibold">25%</span>,{" "}
              <span className="font-semibold">20%</span>,{" "}
              <span className="font-semibold">15%</span>,{" "}
              <span className="font-semibold">10%</span>.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">Refer bonus</div>
            <p className="text-sm text-neutral-300">
              Your referral earns a fixed bonus when downline starts Smart
              Trade.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 p-3">
            <div className="text-sm font-semibold">Ranks & rewards</div>
            <p className="text-sm text-neutral-300">
              Bronze → Grand Master ranks with increasing conditions and
              rewards.
            </p>
          </div>
        </div>

        <div className="mt-4 w-full">
          <Link href="/business-plan " className={` ${btnPrimary} w-full`}>
            Learn more
          </Link>
        </div>
      </section>

      {/* Submit a ticket */}
      <section className="mt-6">
        <form className={`${card} px-2 py-4 space-y-3`}>
          <h2 className="text-lg font-semibold">Submit a ticket</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
              placeholder="Your name"
            />
            <input
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
              placeholder="Email"
              type="email"
            />
          </div>
          <input
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
            placeholder="Subject"
          />
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 outline-none"
            placeholder="Describe your issue…"
          />
          <button type="submit" className={` ${btnPrimary} w-full`}>
            Send ticket
          </button>
        </form>
      </section>
    </main>
  );
}
