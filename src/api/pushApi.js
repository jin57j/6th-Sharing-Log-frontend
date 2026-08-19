import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

async function handlePushResponse(
  response,
) {
  if (response.ok) {
    return;
  }

  const contentType =
    response.headers.get(
      "content-type",
    ) ?? "";

  let responseBody = null;

  if (
    contentType.includes(
      "application/json",
    )
  ) {
    try {
      responseBody =
        await response.json();
    } catch {
      responseBody = null;
    }
  }

  const error = new Error(
    responseBody?.detail ??
      responseBody?.message ??
      "푸시 알림 요청을 처리하지 못했습니다.",
  );

  error.status = response.status;

  throw error;
}

// 현재 브라우저의 푸시 구독 정보를 백엔드에 등록합니다.
export async function registerPushSubscription(
  subscription,
) {
  const subscriptionData =
    subscription.toJSON();

  const endpoint =
    subscriptionData.endpoint;

  const p256dh =
    subscriptionData.keys?.p256dh;

  const auth =
    subscriptionData.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    throw new Error(
      "브라우저의 푸시 구독 정보를 확인하지 못했습니다.",
    );
  }

  const csrf = await getCsrfToken();

  const response = await fetch(
    buildBackendUrl(
      "/api/push/subscriptions",
    ),
    {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",

        Accept: "application/json",

        [csrf.headerName]:
          csrf.token,
      },

      body: JSON.stringify({
        endpoint,
        p256dh,
        auth,
      }),
    },
  );

  await handlePushResponse(response);
}

// 현재 브라우저의 푸시 구독 정보를 백엔드에서 삭제합니다.
export async function deletePushSubscription(
  endpoint,
) {
  const csrf = await getCsrfToken();

  const searchParams =
    new URLSearchParams({
      endpoint,
    });

  const response = await fetch(
    buildBackendUrl(
      `/api/push/subscriptions?${searchParams.toString()}`,
    ),
    {
      method: "DELETE",
      credentials: "include",

      headers: {
        Accept: "application/json",

        [csrf.headerName]:
          csrf.token,
      },
    },
  );

  await handlePushResponse(response);
}
