import { buildBackendUrl } from "./apiConfig";

// 백엔드가 전달한 오류 메시지를 읽는 함수
async function getErrorMessage(response) {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await response.json();

    return (
      body.detail ??
      body.message ??
      body.error ??
      "하우스 생성에 실패했습니다."
    );
  }

  if (response.status === 401) {
    return "로그인이 필요합니다. 다시 로그인해 주세요.";
  }

  if (response.status === 409) {
    return "이미 참여 중인 하우스가 있습니다.";
  }

  return "하우스 생성에 실패했습니다.";
}

// 새로운 하우스를 생성하는 함수
export async function createGroup({ name, csrf }) {
  const response = await fetch(
    buildBackendUrl("/api/groups"),
    {
      method: "POST",

      // 로그인 세션 쿠키를 백엔드로 보냅니다.
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        // Spring Security의 CSRF 검사를 통과하기 위한 헤더
        [csrf.headerName]: csrf.token,
      },

      body: JSON.stringify({
        name,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

// 현재 로그인한 사용자의 활성 하우스를 조회하는 함수
export async function getMyGroup() {
  const response = await fetch(
    buildBackendUrl("/api/groups/me"),
    {
      method: "GET",

      // 로그인 세션 쿠키를 함께 보냅니다.
      credentials: "include",

      headers: {
        Accept: "application/json",
      },
    },
  );

  // 현재 백엔드는 가입한 하우스가 없을 때 404를 반환합니다.
  if (response.status === 404) {
    return null;
  }

  if (response.status === 401) {
    const error = new Error(
      "로그인이 필요합니다.",
    );

    error.status = response.status;

    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      "하우스 정보를 불러오지 못했습니다.",
    );

    error.status = response.status;

    throw error;
  }

  return response.json();
}

// 하우스 탈퇴 API에서 전달한 오류를 읽는 함수
async function createGroupApiError(
  response,
  fallbackMessage,
) {
  const contentType =
    response.headers.get("content-type") ?? "";

  let body = null;

  // application/json과 application/problem+json을 모두 처리합니다.
  if (contentType.includes("json")) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  }

  const error = new Error(
    body?.detail ??
      body?.title ??
      fallbackMessage,
  );

  error.status = response.status;
  error.code = body?.code;

  return error;
}

// 현재 로그인한 사용자가 자신의 하우스에서 탈퇴하는 함수
export async function leaveGroup({
  groupPublicId,
  membershipPublicId,
  membershipVersion,
  csrf,
}) {
  // 이번 탈퇴 요청을 식별할 고유한 문자열을 생성합니다.
  // 동일한 요청이 중복 처리되는 것을 방지하기 위해 사용합니다.
  const idempotencyKey = crypto.randomUUID();

  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${groupPublicId}/members/${membershipPublicId}/leave`,
    ),
    {
      method: "POST",

      // 로그인 세션 쿠키를 함께 보냅니다.
      credentials: "include",

      headers: {
        Accept: "application/json",

        // Spring Security의 CSRF 검사를 통과하기 위한 헤더
        [csrf.headerName]: csrf.token,

        // 동일한 탈퇴 요청이 중복 실행되는 것을 방지합니다.
        "Idempotency-Key": idempotencyKey,

        // 현재 멤버십 버전을 큰따옴표로 감싸 전달합니다.
        // 예: membershipVersion이 0이면 If-Match의 값은 "0"
        "If-Match": `"${membershipVersion}"`,
      },
    },
  );

  if (!response.ok) {
    throw await createGroupApiError(
      response,
      "하우스에서 탈퇴하지 못했습니다.",
    );
  }

  return response.json();
}