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