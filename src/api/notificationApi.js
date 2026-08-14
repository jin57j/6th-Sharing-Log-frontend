import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

// 백엔드 응답을 공통으로 처리하는 함수
async function handleResponse(response) {
  // 응답 본문이 없는 경우
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  let responseBody = null;

  // JSON 또는 application/problem+json 응답을 읽습니다.
  if (contentType.includes("json")) {
    try {
      responseBody = await response.json();
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

    // 화면에서 필요한 경우 상태 코드와 오류 코드를 사용할 수 있습니다.
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

      // 로그인할 때 받은 JSESSIONID 쿠키를 함께 보냅니다.
      credentials: "include",

      headers: {
        Accept: "application/json",
      },
    },
  );

  return handleResponse(response);
}

// 현재 로그인한 사용자의 담당 업무 조회
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

  // 백엔드는 목록을 items 안에 담아서 반환합니다.
  return responseBody?.items ?? [];
}

// 현재 로그인한 사용자가 받은 미응답 대타 요청 조회
export async function getSubstituteRequests(
  groupId,
) {
  const searchParams = new URLSearchParams({
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

// 현재 배정된 업무의 대타를 그룹 멤버 전체에게 요청
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
        "Content-Type": "application/json",
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
        "Idempotency-Key": crypto.randomUUID(),
        ...(version !== undefined && version !== null
          ? { "If-Match": `"${version}"` }
          : {}),
      },
      body: JSON.stringify({ reason }),
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
  // API 주소에 들어갈 action을 제한합니다.
  if (
    action !== "accept" &&
    action !== "reject"
  ) {
    throw new Error(
      "올바르지 않은 대타 응답입니다.",
    );
  }

  // 백엔드의 상태 변경 요청에 필요한 CSRF 토큰을 가져옵니다.
  const csrf = await getCsrfToken();

  // 중복 요청 방지용 고유 문자열입니다.
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

        // Spring Security의 CSRF 검사를 통과하기 위한 헤더입니다.
        [csrf.headerName]: csrf.token,

        // 같은 요청이 중복 실행되는 것을 방지합니다.
        "Idempotency-Key":
          idempotencyKey,

        // 조회한 대타 요청의 현재 버전을 전달합니다.
        // 백엔드는 "3"처럼 큰따옴표가 포함된 형식을 요구합니다.
        "If-Match": `"${version}"`,
      },
    },
  );

  return handleResponse(response);
}
