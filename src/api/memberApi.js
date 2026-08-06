import { fetchAuth } from "./apiClient";

export const memberApi = {
  // 로테이션 멤버 목록 조회
  getRotationMembers: (groupId) => {
    return fetchAuth(`/api/groups/${groupId}/rotation-members`);
  },

  // 멤버의 할 일 참여/제외 설정
  updateChoreParticipations: (
    groupId,
    membershipId,
    addChoreIds = [],
    removeChoreIds = [],
  ) => {
    return fetchAuth(
      `/api/groups/${groupId}/rotation-members/${membershipId}/chore-participations`,
      {
        method: "PATCH",
        body: JSON.stringify({
          addChoreIds,
          removeChoreIds,
          applicationScope: "NEXT_OCCURRENCE",
        }),
      },
    );
  },

  // 멤버 그룹 탈퇴/나가기
  leaveGroup: (groupId, membershipId) => {
    return fetchAuth(`/api/groups/${groupId}/members/${membershipId}/leave`, {
      method: "POST",
    });
  },
};
