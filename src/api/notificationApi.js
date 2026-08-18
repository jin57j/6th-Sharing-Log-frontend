import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

// 백엔드 응답을 공통으로 처리하는 함수
async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  let responseBody = null;

  if (contentType.includes("json")) {
    try {
      responseBody =
        await response.json();
    } catch {
      responseBody = null;
    }
  }

  if (!response.ok) {
    const error = new Error(
      responseBody?.detail ??
        responseBody?.message ??
        responseBody?.title ??
        "알림 요청을 처리하지 못했습니다.",
    );

    error.status = response.status;
    error.code = responseBody?.code;

    throw error;
  }

  return responseBody;
}

// URL에 사용할 groupId를 안전하게 변환합니다.
function encodeGroupId(groupId) {
  return encodeURIComponent(groupId);
}

// 알림 개수 요약 조회
export async function getNotificationSummary(
  groupId,
) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeGroupId(groupId)}/notifications/summary`,
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  return handleResponse(response);
}

// 사용자의 전체 알림 사용 설정 조회
export async function getNotificationPreferences() {
  const response = await fetch(
    buildBackendUrl(
      "/api/notifications/preferences",
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  return handleResponse(response);
}

// 사용자의 전체 알림 사용 설정 수정
export async function updateNotificationPreferences({
  dueSoonEnabled,
}) {
  const csrf = await getCsrfToken();

  const response = await fetch(
    buildBackendUrl(
      "/api/notifications/preferences",
    ),
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify({
        dueSoonEnabled,
      }),
    },
  );

  return handleResponse(response);
}

// 현재 하우스에서 사용하는 개인별 알림 시간 조회
export async function getNotificationSettings(
  groupId,
) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeGroupId(groupId)}/notifications/settings`,
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  return handleResponse(response);
}

// 현재 하우스에서 사용하는 개인별 알림 시간 수정
export async function updateNotificationSettings({
  groupId,
  dailyHoursBeforeDue,
  weeklyHoursBeforeDue,
  biweeklyHoursBeforeDue,
}) {
  const csrf = await getCsrfToken();

  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeGroupId(groupId)}/notifications/settings`,
    ),
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify({
        dailyHoursBeforeDue,
        weeklyHoursBeforeDue,
        biweeklyHoursBeforeDue,
      }),
    },
  );

  return handleResponse(response);
}

// 현재 로그인한 사용자의 마감 임박 업무 조회
export async function getDeadlineOccurrences(
  groupId,
) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeGroupId(groupId)}/occurrences/due-soon`,
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const responseBody =
    await handleResponse(response);

  return responseBody?.items ?? [];
}

// 현재 로그인한 사용자가 받은 미응답 대타 요청 조회
export async function getSubstituteRequests(
  groupId,
) {
  const searchParams =
    new URLSearchParams({
      box: "INBOX",
      status: "PENDING",
    });

  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeGroupId(groupId)}/substitute-requests?${searchParams}`,
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const responseBody =
    await handleResponse(response);

  return responseBody?.items ?? [];
}

// 현재 배정된 업무의 대타를 요청
export async function createSubstituteRequest({
  groupId,
  occurrenceId,
  reason,
  version,
}) {
  const csrf = await getCsrfToken();

  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeGroupId(groupId)}/occurrences/${encodeURIComponent(occurrenceId)}/substitute-requests`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
        "Idempotency-Key":
          crypto.randomUUID(),
        ...(version !== undefined &&
        version !== null
          ? {
              "If-Match": `"${version}"`,
            }
          : {}),
      },
      body: JSON.stringify({
        reason,
      }),
    },
  );

  return handleResponse(response);
}

// 대타 요청에 수락 또는 거절로 응답
export async function respondToSubstituteRequest({
  groupId,
  requestId,
  action,
  version,
}) {
  if (
    action !== "accept" &&
    action !== "reject"
  ) {
    throw new Error(
      "올바르지 않은 대타 응답입니다.",
    );
  }

  const csrf = await getCsrfToken();

  const idempotencyKey =
    crypto.randomUUID();

  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeGroupId(groupId)}/substitute-requests/${encodeURIComponent(requestId)}/${action}`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
        "Idempotency-Key":
          idempotencyKey,
        "If-Match": `"${version}"`,
      },
    },
  );

  return handleResponse(response);
}
