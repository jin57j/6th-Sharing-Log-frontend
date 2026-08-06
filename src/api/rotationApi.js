import { fetchAuth } from "./apiClient";

export const rotationApi = {
  // 일정(로테이션) 목록 조회
  getOccurrences: (groupId, params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.frequency) searchParams.append("frequency", params.frequency);
    if (params.activeOn) searchParams.append("activeOn", params.activeOn);
    if (params.mineOnly !== undefined)
      searchParams.append("mineOnly", String(params.mineOnly));
    if (params.choreId) searchParams.append("choreId", params.choreId);

    if (params.status && Array.isArray(params.status)) {
      params.status.forEach((status) => searchParams.append("status", status));
    }

    return fetchAuth(
      `/api/groups/${groupId}/occurrences?${searchParams.toString()}`,
    );
  },

  // 마감 임박 일정 조회
  getDueSoon: (groupId) => {
    return fetchAuth(`/api/groups/${groupId}/occurrences/due-soon`);
  },

  // 완료된 일정 히스토리 조회
  getCompletedHistory: (groupId, params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.mineOnly !== undefined)
      searchParams.append("mineOnly", String(params.mineOnly));
    if (params.choreId) searchParams.append("choreId", params.choreId);

    return fetchAuth(
      `/api/groups/${groupId}/occurrences/completed-history?${searchParams.toString()}`,
    );
  },

  // 일정 완료 처리
  completeOccurrence: (groupId, occurrenceId, note = "") => {
    return fetchAuth(
      `/api/groups/${groupId}/occurrences/${occurrenceId}/complete`,
      {
        method: "POST",
        body: JSON.stringify({ note }),
      },
    );
  },

  // 일정 완료 취소
  undoComplete: (groupId, occurrenceId, note = "") => {
    return fetchAuth(
      `/api/groups/${groupId}/occurrences/${occurrenceId}/undo-complete`,
      {
        method: "POST",
        body: JSON.stringify({ note }),
      },
    );
  },
};
