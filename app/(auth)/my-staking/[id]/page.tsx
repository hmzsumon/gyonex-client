"use client";

import { ArrowLeft, XCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  useCancelMyStakingSubscriptionMutation,
  useGetMyStakingProfitLogsQuery,
  useGetMyStakingSubscriptionByIdQuery,
} from "@/redux/features/staking-earn/stakingEarnApi";

const MySwal = withReactContent(Swal);

const fmt = (n: number, max = 8) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: max });

export default function StakingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || "");

  const { data: subRes, isLoading: subLoading } =
    useGetMyStakingSubscriptionByIdQuery(id, { skip: !id });

  const { data: logsRes, isLoading: logsLoading } =
    useGetMyStakingProfitLogsQuery({ id, limit: 50 }, { skip: !id });

  const [cancelSub, { isLoading: canceling }] =
    useCancelMyStakingSubscriptionMutation();

  const sub = subRes?.item;
  const logs = logsRes?.items ?? [];

  if (subLoading) {
    return (
      <div className="min-h-screen bg-[#0f141b] text-white p-4">Loading...</div>
    );
  }

  if (!sub) {
    return (
      <div className="min-h-screen bg-[#0f141b] text-white p-4">Not found</div>
    );
  }

  const statusBadge =
    sub.status === "active"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
      : sub.status === "cancelled"
      ? "bg-red-500/10 text-red-300 border-red-500/20"
      : "bg-white/10 text-white/70 border-white/10";

  const onCancel = async () => {
    if (sub.status !== "active") return;

    const res = await MySwal.fire({
      title: "Cancel Subscription?",
      html: `
        <div style="text-align:left; line-height:1.5">
         <div style="opacity:.85; font-size:13px">
        If you cancel, a small portion of your <b>principal</b> will be deducted
        and the remaining amount will be refunded to your SpotWallet.
         </div>
      <div style="margin-top:8px; opacity:.7; font-size:12px">
        • This action is irreversible<br/>
        • Profit logs/history will remain available
      </div>
    </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      reverseButtons: true,
      background: "#0f141b",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      focusCancel: true,
    });

    if (!res.isConfirmed) return;

    // Loading modal
    MySwal.fire({
      title: "Cancelling...",
      text: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: "#0f141b",
      color: "#fff",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await cancelSub(id).unwrap();

      await MySwal.fire({
        title: "Cancelled ✅",
        text: "Principal adjusted & refunded to SpotWallet.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
        background: "#0f141b",
        color: "#fff",
      });

      router.push("/my-staking");
    } catch (e: any) {
      await MySwal.fire({
        title: "Cancel failed ❌",
        text: e?.data?.message || e?.message || "Something went wrong",
        icon: "error",
        background: "#0f141b",
        color: "#fff",
        confirmButtonColor: "#334155",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141b] text-white">
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-base font-semibold">Staking Details</div>
        <div className="w-10" />
      </div>

      {/* Header Card */}
      <div className="px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                {sub.iconUrl ? (
                  <Image
                    src={sub.iconUrl}
                    alt={sub.asset}
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {sub.asset?.[0] ?? "S"}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{sub.asset}</div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${statusBadge}`}
                  >
                    {sub.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-white/55">
                  {new Date(sub.startedAt).toLocaleDateString()} →{" "}
                  {new Date(sub.endAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-white/55">Principal</div>
              <div className="text-sm font-semibold">
                {fmt(sub.principalQty)} {sub.asset}
              </div>
              <div className="mt-1 text-xs text-white/55">
                {Number(sub.dailyProfitPercent)
                  .toFixed(4)
                  .replace(/\.?0+$/, "")}
                % /day
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-black/20 border border-white/10 p-3">
              <div className="text-xs text-white/55">Earned</div>
              <div className="mt-1 text-sm font-semibold text-emerald-300">
                {fmt(sub.totalProfitQty)} {sub.asset}
              </div>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/10 p-3">
              <div className="text-xs text-white/55">Paid Days</div>
              <div className="mt-1 text-sm font-semibold">
                {sub.paidDays}/{sub.termDays}
              </div>
            </div>
          </div>

          {sub.status === "active" && (
            <button
              onClick={onCancel}
              disabled={canceling}
              className={[
                "mt-4 w-full rounded-xl py-3 text-sm font-semibold",
                "flex items-center justify-center gap-2",
                canceling
                  ? "bg-red-500/20 text-red-200 cursor-not-allowed"
                  : "bg-red-500/15 text-red-200 hover:bg-red-500/25",
              ].join(" ")}
            >
              <XCircle size={18} />
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Profit Logs */}
      <div className="px-4 mt-4 pb-10">
        <div className="text-sm font-semibold mb-2">Profit Logs</div>

        {logsLoading ? (
          <div className="text-sm text-white/60">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-sm text-white/60">No logs yet.</div>
        ) : (
          <div className="space-y-2">
            {logs.map((l: any) => (
              <div
                key={l._id || `${l.dayKey}-${l.profitQty}`}
                className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between"
              >
                <div className="text-xs text-white/60">{l.dayKey}</div>
                <div className="text-xs font-semibold text-emerald-300">
                  +{fmt(l.profitQty)} {sub.asset}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
