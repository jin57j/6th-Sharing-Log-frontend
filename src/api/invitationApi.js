import { buildBackendUrl } from "./apiConfig";

// 백엔드 응답에 들어 있는 오류 메시지를 읽는 함수
async function getErrorMessage(
  response,
  defaultMessage,
) {
  const contentType =
    response.headers.get("content-type") ?? "";

  // 백엔드가 JSON 형식으로 오류 정보를 전달한 경우
  if (contentType.includes("application/json")) {
    const body = await response.json();

    return (
      body.detail ??
      body.message ??
      body.error ??
      defaultMessage
    );
  }

  // 로그인이 필요한 경우
  if (response.status === 401) {
    return "로그인이 필요합니다. 다시 로그인해 주세요.";
  }

  // 이미 다른 하우스에 참여 중인 경우
  if (response.status === 409) {
    return "이미 참여 중인 하우스가 있습니다.";
  }

  return defaultMessage;
}

// 하우스의 초대코드와 초대 링크를 생성하는 함수
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

      // 로그인 세션 쿠키를 전송합니다.
      credentials: "include",

      headers: {
        Accept: "application/json",

        // Spring Security CSRF 토큰
        [csrf.headerName]: csrf.token,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "초대 링크 생성에 실패했습니다.",
      ),
    );
  }

  return response.json();
}

// 초대코드를 사용해서 하우스에 참여하는 함수
export async function acceptInvitation({
  code,
  csrf,
}) {
  const encodedCode = encodeURIComponent(code);

  const response = await fetch(
    buildBackendUrl(
      `/api/invitations/${encodedCode}/accept`,
    ),
    {
      method: "POST",

      // 로그인 세션 쿠키를 전송합니다.
      credentials: "include",

      headers: {
        Accept: "application/json",

        // Spring Security CSRF 토큰
        [csrf.headerName]: csrf.token,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "초대코드를 확인하거나 관리자에게 새 코드를 요청해 주세요.",
      ),
    );
  }

  return response.json();
}