"use client";

import Row from "@/components/settings/Row";
import { createBrowserPushSubscription } from "@/lib/push";
import { usePushSubscribeMutation } from "@/redux/features/push/pushApi";
import { BellRing } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

/* ── checkbox row (simple) ────────────────────────────────── */
function Tick({ checked }: { checked?: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-5 w-5 items-center justify-center rounded-md border",
        checked
          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
          : "border-neutral-700 text-transparent",
      ].join(" ")}
    >
      ✓
    </span>
  );
}

/* ── Notifications screen ─────────────────────────────────── */
export default function NotificationsPage() {
  /* auth */
  const { user } = useSelector((s: any) => s.auth);

  /* local */
  const [enablingPush, setEnablingPush] = useState(false);
  const [pushSupported, setPushSupported] = useState(true);

  const [pushSubscribe, { isLoading: isSubscribing }] =
    usePushSubscribeMutation();

  const handleEnablePush = async () => {
    if (!pushSupported) {
      toast.error("Push notifications are not supported");
      return;
    }
    setEnablingPush(true);
    try {
      const subscription = await createBrowserPushSubscription();
      await pushSubscribe({ subscription }).unwrap();
      toast.success("Push enabled!");
    } catch (e: any) {
      toast.error(e?.message || e?.data?.message || "Failed to enable push");
    } finally {
      setEnablingPush(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl pb-8 pt-4">
      <h1 className="px-4 pb-2 text-2xl font-bold text-neutral-100">
        Notifications
      </h1>
      <p className="px-4 text-sm text-neutral-400">
        Notifications are sent for Favorites instruments.
      </p>

      <div className="flex items-center justify-center w-full mt-4 ">
        {/* enable push */}
        <button
          onClick={handleEnablePush}
          disabled={enablingPush || isSubscribing || !pushSupported}
          className="inline-flex items-center gap-2 rounded-lg border w-full border-white/15 px-3 py-1.5 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-60"
          title={
            pushSupported
              ? "Enable browser push notifications"
              : "Web Push not supported"
          }
        >
          <BellRing className="h-4 w-4" />
          {enablingPush || isSubscribing
            ? "Enabling…"
            : "Enable Push Notifications"}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
        <Row href="#" title="Instruments" subtitle="Favorites" />
        <Row title="Trading signals" end={<Tick checked />} />
        <Row title="News" end={<Tick checked />} />
        <Row title="Economic calendar" end={<Tick checked />} />
        <Row title="Price movements" end={<Tick checked />} />

        <div className="border-t border-neutral-800/70 px-4 py-3 text-sm font-semibold text-neutral-300">
          Operations
        </div>
        <Row title="Trading" end={<Tick checked />} />
        <Row title="Financial" end={<Tick checked />} />
      </div>
    </div>
  );
}
