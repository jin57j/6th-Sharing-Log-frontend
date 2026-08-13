import { buildBackendUrl } from "./apiConfig";

// 초대 API의 오류 정보를 Error 객체로 만듭니다.
async function createInvitationApiError(
  response,
  defaultMessage,
) {
  const contentType =
    response.headers.get("content-type") ?? "";

  let body = null;

  if (contentType.includes("application/json")) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  }

  const error = new Error(
    body?.detail ??
      body?.message ??
      body?.error ??
      defaultMessage,
  );

  error.status = response.status;
  error.code = body?.code;

  return error;
}

// 하우스를 처음 생성한 후 초대 링크를 발급합니다.
export async function createInvitation({
  groupId,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${groupId}/invitations`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
    },
  );

  if (!response.ok) {
    throw await createInvitationApiError(
      response,
      "초대 링크 생성에 실패했습니다.",
    );
  }

  return response.json();
}

// 기존 하우스의 새로운 초대 링크를 재발급합니다.
export async function reissueInvitation({
  groupPublicId,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${groupPublicId}/invitations/reissue`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
    },
  );

  if (!response.ok) {
    throw await createInvitationApiError(
      response,
      "초대 링크를 재발급하지 못했습니다.",
    );
  }

  return response.json();
}

// 초대코드를 사용해 하우스에 참여합니다.
export async function acceptInvitation({
  code,
  csrf,
}) {
  const encodedCode =
    encodeURIComponent(code);

  const response = await fetch(
    buildBackendUrl(
      `/api/invitations/${encodedCode}/accept`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
    },
  );

  if (!response.ok) {
    throw await createInvitationApiError(
      response,
      "초대코드를 확인하거나 관리자에게 새 코드를 요청해 주세요.",
    );
  }

  return response.json();
}