// 새로운 하우스를 생성하는 함수
export async function createGroup({ name, token, csrf }) {
  const response = await fetch("/api/groups", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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