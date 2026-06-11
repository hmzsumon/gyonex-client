// frontend/components/Header/NotificationDrawer.tsx  (with hooks and sectioned comments)
"use client";

import {
  useGetMyUnreadNotificationsCountQuery,
  useGetMyUnreadNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notifications/notificationApi";
import { X } from "lucide-react";

/* ──────────  Notification drawer panel  ────────── */
export default function NotificationDrawer({
  open,
  onClose,
  topOffset = 64,
}: {
  open: boolean;
  onClose: () => void;
  topOffset?: number;
}) {
  /* ──────────  data queries  ────────── */
  const { data, isFetching } = useGetMyUnreadNotificationsQuery(undefined, {
    skip: !open,
  });
  const { data: countData } = useGetMyUnreadNotificationsCountQuery();
  const [markRead] = useUpdateNotificationMutation();

  const notifications = data?.notifications ?? [];
  const unreadCount = countData?.dataCount ?? 0;

  return (
    <>
      {/* ──────────  overlay  ────────── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: topOffset }}
      />
      {/* ──────────  panel  ────────── */}
      <aside
        className={`fixed right-0 z-[61] h-[calc(100dvh-4rem)] w-full max-w-[380px] translate-x-0 border-l border-neutral-900 bg-neutral-950 transition-transform md:max-w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: topOffset }}
        aria-hidden={!open}
      >
        {/* ──────────  header  ────────── */}
        <div className="flex h-12 items-center justify-between border-b border-neutral-900 px-4">
          <div className="text-sm font-semibold text-white">
            Notifications
            {unreadCount ? (
              <span className="ml-2 rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-200">
                {unreadCount}
              </span>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* ──────────  list  ────────── */}
        <div className="p-4 text-sm text-neutral-300">
          {isFetching ? (
            "Loading..."
          ) : notifications.length === 0 ? (
            "You currently have no new notifications."
          ) : (
            <ul className="space-y-2">
              {notifications.map((n: any) => (
                <li
                  key={n._id}
                  className="rounded-lg border border-neutral-900 p-3"
                >
                  <div className="mb-1 text-white">{n.title}</div>
                  <div className="text-neutral-400">{n.message}</div>
                  <div className="mt-2 flex items-center gap-2">
                    {n.url ? (
                      <a
                        href={n.url}
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Open
                      </a>
                    ) : null}
                    <button
                      onClick={() => markRead(n._id)}
                      className="text-xs text-neutral-300 hover:text-white"
                    >
                      Mark as read
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
