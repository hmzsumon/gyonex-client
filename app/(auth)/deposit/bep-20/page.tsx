"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowUp, FiCheck, FiCopy } from "react-icons/fi";
import { SquareLoader } from "react-spinners";

import { useSocket } from "@/context/SocketContext";
import { useCreateDepositRequestMutation } from "@/redux/features/deposit/depositApi";

import DepositHeader from "@/components/deposit/DepositHeader";
import {
  DepositBonus,
  DepositGuidelines,
  DepositSecurity,
} from "@/components/deposit/InfoPanels";
import QRCodeCard from "@/components/deposit/QRCodeCard";
import WalletAddress from "@/components/deposit/WalletAddress";

/* ── page component ────────────────────────────────────────── */
export default function DepositPage() {
  const router = useRouter();
  const { socket } = useSocket();

  const [createDepositRequest, { isLoading }] =
    useCreateDepositRequestMutation();
  const [deposit, setDeposit] = useState<any>(null);

  // form/local ui states
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // constants
  const network = "BEP20";
  const minDeposit = 30;

  /* ── create a deposit once ───────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const response = await createDepositRequest({
          network: "bep20",
          chain: "usdt",
        }).unwrap();
        if (response?.deposit) setDeposit(response.deposit);
        else toast.error("Failed to create deposit");
      } catch (err: any) {
        toast.error(err?.data?.message || "An unexpected error occurred");
      }
    })();
  }, [createDepositRequest]);

  /* ── socket events ───────────────────────────────────────── */
  useEffect(() => {
    if (!socket) return;

    socket.on("deposit-update", (data) => {
      toast.success(data.message || "Deposit received!");
      setDeposit(data.deposit);
      router.push("/dashboard");
    });

    socket.on("test-event", () =>
      toast.success("Socket connection test successful!")
    );

    return () => {
      socket.off("deposit-update");
      socket.off("test-event");
    };
  }, [socket, router]);

  /* ── derived ui data ─────────────────────────────────────── */
  const walletAddress = deposit?.destinationAddress || "Generating address…";
  const qrCodeImage = deposit?.qrCode
    ? `data:image/png;base64,${deposit.qrCode}`
    : null;

  const depositHistory = useMemo(
    () => [
      {
        id: "1",
        amount: 50,
        status: "Completed",
        date: "2023-06-15 14:30",
        txId: "0x1234567890abcdef1234567890abcdef1234567890abcdef",
      },
      {
        id: "2",
        amount: 100,
        status: "Pending",
        date: "2023-06-14 09:15",
        txId: "0x9876543210fedcba9876543210fedcba9876543210fedcba",
      },
    ],
    []
  );

  /* ── helpers ─────────────────────────────────────────────── */
  const handleCopyAddress = () => {
    if (!walletAddress || walletAddress.startsWith("Generating")) return;
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 1500);
  };

  const handleCopyTxId = (txId: string) => {
    navigator.clipboard.writeText(txId);
    setCopiedTxId(txId);
    setTimeout(() => setCopiedTxId(null), 1500);
  };

  const formatTxId = (txId: string) => `${txId.slice(0, 6)}…${txId.slice(-4)}`;

  return (
    <div className="min-h-screen bg-neutral-950 px-1 py-4 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* ── header (title + actions) ───────────────────────── */}
        <DepositHeader
          title={`Deposit USDT (${network})`}
          subtitle="Secure and fast deposits"
          actions={
            <div className="flex items-center gap-2">
              <Link
                href="/learn/deposit"
                className="rounded-lg border border-emerald-700/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-500/15"
              >
                Learn more
              </Link>
              <Link
                href="/settings/profile"
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
              >
                Complete profile
              </Link>
            </div>
          }
          backLink={
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-neutral-300 hover:text-white"
            >
              <FiArrowUp className="mr-1 rotate-90" /> Back to Wallet
            </Link>
          }
        />

        {/* ── card ───────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-neutral-800 shadow-xl">
          {/* header strip (emerald gradient) */}
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm/none opacity-80">
                USDT ({network}) deposit
              </span>
              <button
                onClick={() => setShowHistory((s) => !s)}
                className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
              >
                {showHistory ? "Hide history" : "Show history"}
              </button>
            </div>
          </div>

          {/* history panel (optional) */}

          {/* body */}
          <div className="space-y-6 bg-neutral-950 p-6">
            {/* QR code or loader */}
            <QRCodeCard
              isLoading={isLoading}
              qr={qrCodeImage}
              loadingSlot={
                <div className="flex h-48 w-48 items-center justify-center">
                  <SquareLoader color="#10b981" size={110} />
                </div>
              }
            />

            {/* address copy */}
            <WalletAddress
              network={network}
              address={walletAddress}
              onCopy={handleCopyAddress}
              copied={copiedAddress}
              CopyIcon={copiedAddress ? FiCheck : FiCopy}
              accentClass="text-emerald-400 hover:text-emerald-300"
            />

            {/* info panels */}
            <div className="grid gap-4 md:grid-cols-3">
              <DepositGuidelines min={minDeposit} network={network} />
              <DepositSecurity network={network} />
              <DepositBonus />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
