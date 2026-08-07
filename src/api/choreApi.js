import { fetchAuth } from "./apiClient";
import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

export const choreApi = {
  // 🌟 1. 업무 목록 조회 (파라미터명을 groupPublicId로 명확히 변경)
  getChores: (groupPublicId, params = { active: true }) => {
    const searchParams = new URLSearchParams();
    if (params.active !== undefined)
      searchParams.append("active", String(params.active));
    if (params.frequency) searchParams.append("frequency", params.frequency);

    return fetchAuth(
      `/api/groups/${groupPublicId}/chores?${searchParams.toString()}`,
    );
  },

  // 2. 신규 업무 생성
  createChore: async (groupPublicId, choreData) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID(); // 멱등성 키

    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupPublicId}/chores`),
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey, // 필수 헤더
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify(choreData),
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.detail ||
          errorBody.message ||
          `API 요청 실패: ${response.status}`,
      );
    }

    return response.json();
  },

  // 3. 업무 수정
  updateChore: async (groupPublicId, choreId, updateData, version) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    // 🌟 HTTP 표준에 맞게 버전을 큰따옴표로 묶어줍니다 (예: '"0"')
    const etag = `"${version}"`;

    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupPublicId}/chores/${choreId}`),
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey,
          "If-Match": etag, // 👈 따옴표가 포함된 값 전송
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.detail ||
          errorBody.message ||
          `API 요청 실패: ${response.status}`,
      );
    }

    return response.json();
  },

  // 4. 업무 삭제 (DELETE)
  deleteChore: async (groupPublicId, choreId, version) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    const etag = `"${version}"`;

    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupPublicId}/chores/${choreId}`),
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Idempotency-Key": idempotencyKey,
          "If-Match": etag,
          [csrf.headerName]: csrf.token,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    // 🌟 200 OK라도 본문이 비어있을 경우 JSON 파싱 에러 방지
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },
};
