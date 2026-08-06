import { fetchAuth } from "./apiClient";
import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

export const choreApi = {
  // 🌟 1. 업무 목록 조회 (이 함수가 지워져서 났던 에러입니다!)
  getChores: (groupId, params = { active: true }) => {
    const searchParams = new URLSearchParams();
    if (params.active !== undefined)
      searchParams.append("active", String(params.active));
    if (params.frequency) searchParams.append("frequency", params.frequency);

    return fetchAuth(
      `/api/groups/${groupId}/chores?${searchParams.toString()}`,
    );
  },

  // 2. 신규 업무 생성 (완벽하게 성공한 최신 로직)
  createChore: async (groupId, choreData) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID(); // 멱등성 키

    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupId}/chores`),
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

  updateChore: async (groupId, choreId, updateData, version) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    // 🌟 HTTP 표준에 맞게 버전을 큰따옴표로 묶어줍니다 (예: '"0"')
    const etag = `"${version}"`;

    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupId}/chores/${choreId}`),
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
  deleteChore: async (groupId, choreId, version) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    // 🌟 HTTP 표준에 맞게 버전을 큰따옴표로 묶어줍니다
    const etag = `"${version}"`;

    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupId}/chores/${choreId}`),
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Idempotency-Key": idempotencyKey,
          "If-Match": etag, // 👈 따옴표가 포함된 값 전송
          [csrf.headerName]: csrf.token,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
  },
};
