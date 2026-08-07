import { buildBackendUrl } from "./apiConfig";

// 하우스 API에서 발생한 오류 정보를 담은 Error 객체를 만듭니다.
async function createGroupApiError(
  response,
  fallbackMessage,
) {
  const contentType =
    response.headers.get("content-type") ?? "";

  let body = null;

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
      body?.message ??
      body?.error ??
      fallbackMessage,
  );

  error.status = response.status;
  error.code = body?.code;

  return error;
}

// 새로운 하우스를 생성합니다.
export async function createGroup({
  name,
  address,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl("/api/groups"),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify({
        name,
        address,
      }),
    },
  );

  if (!response.ok) {
    throw await createGroupApiError(
      response,
      "하우스를 생성하지 못했습니다.",
    );
  }

  return response.json();
}

// 현재 로그인한 사용자가 가입한 모든 하우스를 조회합니다.
//
// 하우스가 없으면 null이나 404가 아니라
// 빈 배열 []을 반환합니다.
export async function getMyGroups() {
  const response = await fetch(
    buildBackendUrl("/api/groups/me"),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (response.status === 401) {
    const error = new Error(
      "로그인이 필요합니다.",
    );

    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    throw await createGroupApiError(
      response,
      "하우스 목록을 불러오지 못했습니다.",
    );
  }

  const groups = await response.json();

  if (!Array.isArray(groups)) {
    throw new Error(
      "하우스 목록의 응답 형식이 올바르지 않습니다.",
    );
  }

  return groups;
}

// 현재 로그인한 사용자가 하우스에서 탈퇴합니다.
export async function leaveGroup({
  groupPublicId,
  membershipPublicId,
  membershipVersion,
  csrf,
}) {
  const idempotencyKey =
    crypto.randomUUID();

  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${groupPublicId}/members/${membershipPublicId}/leave`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
        "Idempotency-Key": idempotencyKey,
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

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// 마지막 구성원이 하우스를 나가면서
// 하우스를 함께 삭제합니다.
export async function deleteGroup({
  groupPublicId,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${groupPublicId}`,
    ),
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
    },
  );

  if (!response.ok) {
    throw await createGroupApiError(
      response,
      "하우스를 삭제하지 못했습니다.",
    );
  }

  // 삭제 성공 응답은 204 No Content라서
  // response.json()을 실행하지 않습니다.
  return null;
}

// 하우스 이름과 주소를 수정합니다.
export async function updateGroup({
  groupPublicId,
  name,
  address,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${groupPublicId}`,
    ),
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify({
        name,
        address,
      }),
    },
  );

  if (!response.ok) {
    throw await createGroupApiError(
      response,
      "하우스 정보를 수정하지 못했습니다.",
    );
  }

  return response.json();
}
