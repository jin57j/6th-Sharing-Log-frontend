import { buildBackendUrl } from "./apiConfig";

// 모든 API 요청에 자동으로 credentials와 Content-Type을 넣어주는 래퍼 함수
export const fetchAuth = async (path, options = {}) => {
  const url = buildBackendUrl(path);

  const response = await fetch(url, {
    ...options,
    credentials: "include", // ★ 핵심: 모든 요청에 쿠키 포함
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  // 204 No Content 처리
  if (response.status === 204) return null;

  return response.json();
};
