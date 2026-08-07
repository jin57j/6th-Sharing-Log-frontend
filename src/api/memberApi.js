import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

export const memberApi = {
  getRotationMembers: async (groupPublicId) => {
    const response = await fetch(
      buildBackendUrl(`/api/groups/${groupPublicId}/rotation-members`),
      {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      },
    );
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    return response.json();
  },

  updateChoreParticipations: async (
    groupPublicId,
    membershipId,
    addChoreIds = [],
    removeChoreIds = [],
  ) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupPublicId}/rotation-members/${membershipId}/chore-participations`,
      ),
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey,
          [csrf.headerName]: csrf.token,
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

  // 🌟 탈퇴(leave) 시 멤버 정보의 version을 받아 If-Match로 전달하도록 수정
  leaveGroup: async (groupPublicId, membershipId, version) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupPublicId}/members/${membershipId}/leave`,
      ),
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey,
          "If-Match": `"${version}"`, // 👈 필수 헤더 추가
          [csrf.headerName]: csrf.token,
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
