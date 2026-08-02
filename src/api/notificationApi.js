import { getCsrfToken } from "./authApi";

// 현재 MSW를 사용하는 중인지 확인
const IS_MOCK_MODE =
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_MOCK_API === "true";

// 서버 응답을 공통으로 처리하는 함수
async function handleResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  const responseBody = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      responseBody?.message ??
        responseBody?.detail ??
        "알림 요청을 처리하지 못했습니다.",
    );
  }

  return responseBody;
}

// 실제 백엔드에 POST 요청을 보낼 때 필요한 CSRF 헤더 생성
async function createMutationHeaders() {
  const headers = {
    Accept: "application/json",
  };

  // MSW에서는 실제 Spring Security의 CSRF 검사를 받지 않음
  if (IS_MOCK_MODE) {
    return headers;
  }

  const csrf = await getCsrfToken();

  return {
    ...headers,
    [csrf.headerName]: csrf.token,
  };
}

// 마감이 임박한 내 업무 조회
export async function getDeadlineOccurrences(groupId) {
  const searchParams = new URLSearchParams({
    mineOnly: "true",
    status: "ASSIGNED",
  });

  const response = await fetch(
    `/api/groups/${groupId}/occurrences?${searchParams}`,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const responseBody = await handleResponse(response);

  return responseBody.items ?? [];
}

// 내가 받은 대타 요청 조회
export async function getSubstituteRequests(groupId) {
  const searchParams = new URLSearchParams({
    box: "INBOX",
    status: "PENDING",
  });

  const response = await fetch(
    `/api/groups/${groupId}/substitute-requests?${searchParams}`,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const responseBody = await handleResponse(response);

  return responseBody.items ?? [];
}

// 대타 요청에 수락 또는 거절 응답
export async function respondToSubstituteRequest({
  groupId,
  requestId,
  action,
}) {
  if (action !== "accept" && action !== "reject") {
    throw new Error("올바르지 않은 대타 응답입니다.");
  }

  const headers = await createMutationHeaders();

  const response = await fetch(
    `/api/groups/${groupId}/substitute-requests/${requestId}/${action}`,
    {
      method: "POST",
      credentials: "include",
      headers,
    },
  );

  return handleResponse(response);
}