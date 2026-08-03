// 서버에서 CSRF 토큰을 가져오는 함수
export async function getCsrfToken() {
  const response = await fetch("/api/auth/csrf", {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("보안 토큰을 가져오지 못했습니다.");
  }

  return response.json();
}

// 현재 로그인 세션을 종료하는 함수(로그아웃 함수)
export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",

    // 브라우저가 JSESSIONID 세션 쿠키를 함께 보내도록 설정
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }
}