// 새로운 하우스를 생성하는 함수
export async function createGroup({ name, csrf }) {
  const response = await fetch("/api/groups", {
    method: "POST",

    // 브라우저가 로그인 세션 쿠키를 백엔드로 보내도록 설정
    credentials: "include",

    headers: {
      "Content-Type": "application/json",

      // Spring Security의 CSRF 검사를 통과하기 위한 헤더
      [csrf.headerName]: csrf.token,
    },

    body: JSON.stringify({
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("하우스 생성에 실패했습니다.");
  }

  return response.json();
}