// src/lib/push.ts
/* ────────── util: VAPID base64 to Uint8Array ────────── */
function urlBase64ToUint8Array(base64String: string) {
  if (!base64String) throw new Error("VAPID key missing");
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/* ────────── create or reuse browser push subscription ────────── */
export async function createBrowserPushSubscription(): Promise<PushSubscriptionJSON> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push not supported");
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
  if (!publicKey) throw new Error("VAPID key missing");

  const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  await navigator.serviceWorker.ready;

  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Permission denied");

  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing.toJSON();

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  return sub.toJSON();
}
