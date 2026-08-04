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