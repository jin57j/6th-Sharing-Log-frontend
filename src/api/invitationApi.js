// 서버 응답에 들어 있는 에러 메시지를 읽는 함수
async function getErrorMessage(response) {
  const contentType = response.headers.get("content-type") ?? "";

  // 서버가 JSON 형식으로 오류 정보를 전달한 경우
  if (contentType.includes("application/json")) {
    const body = await response.json();

    return (
      body.detail ??
      body.message ??
      body.error ??
      "요청 처리에 실패했습니다."
    );
  }

  // 로그인이 필요하거나 로그인 페이지로 이동된 경우
  if (response.status === 401 || response.redirected) {
    return "로그인이 필요합니다. 다시 로그인해주세요.";
  }

  // 그 밖의 오류인 경우
  return "초대 코드를 확인하거나 관리자에게 새 코드를 요청해주세요.";
}

// 하우스의 초대 코드와 초대 링크를 생성하는 함수
export async function createInvitation({ groupId, csrf }) {
  const response = await fetch(`/api/groups/${groupId}/invitations`, {
    method: "POST",

    // 로그인 세션 쿠키 전송
    credentials: "include",

    headers: {
      // Spring Security의 CSRF 검사를 통과하기 위한 헤더
      [csrf.headerName]: csrf.token,
    },
  });

  if (!response.ok) {
    throw new Error("초대 링크 생성에 실패했습니다.");
  }

  return response.json();
}

// 초대 코드를 사용하여 하우스에 참여하는 함수
export async function acceptInvitation({ code, csrf }) {
  const response = await fetch(
    `/api/invitations/${encodeURIComponent(code)}/accept`,
    {
      method: "POST",

      // 로그인 세션 쿠키 전송
      credentials: "include",

      headers: {
        Accept: "application/json",

        // Spring Security의 CSRF 검사를 통과하기 위한 헤더
        [csrf.headerName]: csrf.token,
      },
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}