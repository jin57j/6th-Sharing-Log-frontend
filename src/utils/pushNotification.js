const vapidPublicKey =
  import.meta.env
    .VITE_VAPID_PUBLIC_KEY?.trim() ??
  "";

export function hasVapidPublicKey() {
  return Boolean(vapidPublicKey);
}

export function isMockApiEnabled() {
  return (
    import.meta.env.DEV &&
    import.meta.env
      .VITE_USE_MOCK_API === "true"
  );
}

export function isPushNotificationSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// VAPID 공개 키를 PushManager가 사용할 수 있는 형식으로 바꿉니다.
function convertVapidKeyToUint8Array(
  base64String,
) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) %
      4,
  );

  const normalizedBase64 = (
    base64String + padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(
    normalizedBase64,
  );

  return Uint8Array.from(
    rawData,
    (character) =>
      character.charCodeAt(0),
  );
}

// 푸시 알림을 처리할 서비스 워커를 등록합니다.
async function registerPushServiceWorker() {
  if (
    !isPushNotificationSupported()
  ) {
    throw new Error(
      "현재 브라우저에서는 푸시 알림을 사용할 수 없습니다.",
    );
  }

  if (isMockApiEnabled()) {
    throw new Error(
      "푸시 알림 테스트를 하려면 VITE_USE_MOCK_API를 false로 설정해 주세요.",
    );
  }

  const registration =
    await navigator.serviceWorker.register(
      "/push-service-worker.js",
      {
        scope: "/",
      },
    );

  await navigator.serviceWorker.ready;

  return registration;
}

// 현재 브라우저에 만들어진 구독 정보를 가져옵니다.
export async function getCurrentPushSubscription() {
  if (
    !isPushNotificationSupported()
  ) {
    return null;
  }

  const registration =
    await navigator.serviceWorker.getRegistration(
      "/",
    );

  if (!registration) {
    return null;
  }

  return registration.pushManager.getSubscription();
}

// 새로운 브라우저 푸시 구독을 만듭니다.
export async function createPushSubscription() {
  if (!hasVapidPublicKey()) {
    throw new Error(
      "VAPID 공개 키가 설정되지 않았습니다.",
    );
  }

  const registration =
    await registerPushServiceWorker();

  const currentSubscription =
    await registration.pushManager.getSubscription();

  if (currentSubscription) {
    return currentSubscription;
  }

  return registration.pushManager.subscribe(
    {
      userVisibleOnly: true,

      applicationServerKey:
        convertVapidKeyToUint8Array(
          vapidPublicKey,
        ),
    },
  );
}
