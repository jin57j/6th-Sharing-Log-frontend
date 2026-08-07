import { fetchAuth } from "./apiClient";
import { getCsrfToken } from "./authApi";
import { buildBackendUrl } from "./apiConfig";

export const rotationApi = {
  getOccurrences: (groupPublicId, params = {}) => {
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
      `/api/groups/${groupPublicId}/occurrences?${searchParams.toString()}`,
    );
  },

  getDueSoon: (groupPublicId) => {
    return fetchAuth(`/api/groups/${groupPublicId}/occurrences/due-soon`);
  },

  getCompletedHistory: (groupPublicId, params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.mineOnly !== undefined)
      searchParams.append("mineOnly", String(params.mineOnly));
    if (params.choreId) searchParams.append("choreId", params.choreId);
    return fetchAuth(
      `/api/groups/${groupPublicId}/occurrences/completed-history?${searchParams.toString()}`,
    );
  },

  // 🌟 백엔드 스펙에 맞게 CSRF, 멱등성 키, If-Match(버전) 추가
  completeOccurrence: async (
    groupPublicId,
    occurrenceId,
    version,
    note = "",
  ) => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupPublicId}/occurrences/${occurrenceId}/complete`,
      ),
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey,
          "If-Match": `"${version}"`, // 👈 따옴표 포함
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({ note }),
      },
    );
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    return response.json();
  },

  // 🌟 완료 취소도 동일하게 수정
  undoComplete: async (groupPublicId, occurrenceId, version, note = "") => {
    const csrf = await getCsrfToken();
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(
      buildBackendUrl(
        `/api/groups/${groupPublicId}/occurrences/${occurrenceId}/undo-complete`,
      ),
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey,
          "If-Match": `"${version}"`,
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({ note }),
      },
    );
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    return response.json();
  },

  getWeeklyPreview: (groupPublicId, params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.weekOffset !== undefined)
      searchParams.append("weekOffset", params.weekOffset);
    if (params.frequency) searchParams.append("frequency", params.frequency);
    if (params.choreId) searchParams.append("choreId", params.choreId);
    return fetchAuth(
      `/api/groups/${groupPublicId}/occurrences/weekly-preview?${searchParams.toString()}`,
    );
  },
};
