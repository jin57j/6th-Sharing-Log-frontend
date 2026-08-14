import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

export const memberApi = {
  // 현재 하우스에서 활동 중인 멤버 목록을 조회합니다.
  getRotationMembers: async (
    groupPublicId,
  ) => {
    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupPublicId}/rotation-members`,
      ),
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `멤버 목록 조회 실패: ${response.status}`,
      );
    }

    return response.json();
  },

  // 특정 멤버가 참여할 업무를 변경합니다.
  updateChoreParticipations: async (
    groupPublicId,
    membershipId,
    addChoreIds = [],
    removeChoreIds = [],
  ) => {
    const csrf = await getCsrfToken();
    const idempotencyKey =
      crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupPublicId}/rotation-members/${membershipId}/chore-participations`,
      ),
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
          "Idempotency-Key":
            idempotencyKey,
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({
          addChoreIds,
          removeChoreIds,
          applicationScope:
            "NEXT_OCCURRENCE",
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({}));

      throw new Error(
        errorBody.detail ||
          errorBody.message ||
          `업무 참여 설정 변경 실패: ${response.status}`,
      );
    }

    return response.status === 204
      ? null
      : response.json();
  },

  // 관리자가 선택한 멤버를 하우스에서 강퇴합니다.
  removeMember: async (
    groupPublicId,
    membershipId,
    version,
  ) => {
    const csrf = await getCsrfToken();
    const idempotencyKey =
      crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupPublicId}/members/${membershipId}/leave`,
      ),
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Idempotency-Key":
            idempotencyKey,
          "If-Match": `"${version}"`,
          [csrf.headerName]: csrf.token,
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({}));

      const error = new Error(
        errorBody.detail ||
          errorBody.message ||
          `멤버 강퇴 요청 실패: ${response.status}`,
      );

      // 훅에서 오류 종류를 구분할 수 있도록
      // HTTP 상태 코드와 백엔드 오류 코드를 저장합니다.
      error.status = response.status;
      error.code = errorBody.code;

      throw error;
    }

    return response.status === 204
      ? null
      : response.json();
  },
};