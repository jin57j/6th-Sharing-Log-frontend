import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

export const memberApi = {
  // 1. 로테이션 멤버 목록 조회 (GET)
  // GET 요청은 데이터를 수정하지 않으므로 CSRF 토큰과 멱등성 키가 필요하지 않습니다.
  getRotationMembers: async (groupId) => {
    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupId}/rotation-members`),
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    return response.json();
  },

  // 2. 멤버의 할 일 참여/제외 설정 (PATCH)
  updateChoreParticipations: async (
    groupId,
    membershipId,
    addChoreIds = [],
    removeChoreIds = [],
  ) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupId}/rotation-members/${membershipId}/chore-participations`,
      ),
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey, // 👈 필수 헤더
          [csrf.headerName]: csrf.token, // 👈 CSRF 토큰 주입
        },
        body: JSON.stringify({
          addChoreIds,
          removeChoreIds,
          applicationScope: "NEXT_OCCURRENCE",
        }),
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

    return response.status === 204 ? null : response.json();
  },

  // 3. 멤버 그룹 탈퇴/나가기 (POST)
  leaveGroup: async (groupId, membershipId) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupId}/members/${membershipId}/leave`),
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey, // 👈 필수 헤더
          [csrf.headerName]: csrf.token, // 👈 CSRF 토큰 주입
        },
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

    return response.status === 204 ? null : response.json();
  },
};
