// .env.local에 작성한 실제 백엔드 주소를 가져옵니다.
const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN;

// 백엔드 주소가 설정되지 않았다면 개발자가 바로 알 수 있도록
// 애플리케이션 실행 시 오류를 발생시킵니다.
if (!backendOrigin) {
  throw new Error("VITE_BACKEND_ORIGIN 환경변수가 필요합니다.");
}

// 주소 마지막에 /가 있다면 제거합니다.
//
// 예시:
// https://example.com/
// → https://example.com
export const BACKEND_ORIGIN = backendOrigin.replace(/\/+$/, "");

// 백엔드 요청에 사용할 전체 URL을 만들어주는 함수입니다.
//
// 예시:
// buildBackendUrl("/api/auth/me")
// → https://sharinglog-43-200-12-73.sslip.io/api/auth/me
export function buildBackendUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${BACKEND_ORIGIN}${normalizedPath}`;
}
