// public/sw.js
/* ────────── push event: show rich notification ────────── */
self.addEventListener("push", (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const {
      title = "Orex Trade",
      body = "You have a new update.",
      icon = "/icons/icon-192.png",
      badge = "/icons/badge-72.png",
      image,
      url = "https://www.capitalisegfx.com/notifications",
      tag = "orex-trade",
      requireInteraction = false,
      actions = [
        { action: "open", title: "Open", icon: "/icons/action-open.png" },
        {
          action: "dismiss",
          title: "Dismiss",
          icon: "/icons/action-close.png",
        },
      ],
      timestamp = Date.now(),
      vibrate = [80, 40, 80],
      renotify = true,
    } = data;

    const opts = {
      body,
      icon,
      badge,
      tag,
      renotify,
      requireInteraction,
      timestamp,
      vibrate,
      actions,
      data: { url },
      ...(image ? { image } : {}),
    };

    event.waitUntil(self.registration.showNotification(title, opts));
  } catch {
    event.waitUntil(
      self.registration.showNotification("Orex Trade", {
        body: "You have a new notification.",
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-72.png",
      })
    );
  }
});

/* ────────── notification click: focus/open tab ────────── */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "https://www.capitalisegfx.com";

  if (event.action === "dismiss") return;

  event.waitUntil(
    (async () => {
      const all = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const c of all) {
        if (c.url.includes(new URL(url).origin)) {
          c.navigate(url);
          return c.focus();
        }
      }
      return clients.openWindow(url);
    })()
  );
});
