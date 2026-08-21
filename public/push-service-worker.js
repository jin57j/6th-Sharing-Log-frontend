self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      self.skipWaiting(),
    );
  },
);

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      self.clients.claim(),
    );
  },
);

self.addEventListener(
  "push",
  (event) => {
    const rawData = event.data
      ? event.data.text()
      : "";

    let payload = {};

    if (rawData) {
      try {
        payload = JSON.parse(rawData);
      } catch {
        payload = {
          body: rawData,
        };
      }
    }

    const title =
      payload.title ?? "같이살기";

    const options = {
      body:
        payload.body ??
        "새로운 알림이 도착했습니다.",

      icon: "/icons/app-icon-192.png",

      data: {
        url:
          payload.url ??
          "/notification",
      },
    };

    event.waitUntil(
      self.registration.showNotification(
        title,
        options,
      ),
    );
  },
);

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const requestedUrl = new URL(
      event.notification.data?.url ??
        "/notification",
      self.location.origin,
    );

    const targetUrl =
      requestedUrl.origin ===
      self.location.origin
        ? requestedUrl.href
        : new URL(
            "/notification",
            self.location.origin,
          ).href;

    event.waitUntil(
      (async () => {
        const windowClients =
          await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
          });

        for (const client of windowClients) {
          const clientUrl = new URL(
            client.url,
          );

          if (
            clientUrl.origin ===
            self.location.origin
          ) {
            await client.navigate(
              targetUrl,
            );

            return client.focus();
          }
        }

        return self.clients.openWindow(
          targetUrl,
        );
      })(),
    );
  },
);
