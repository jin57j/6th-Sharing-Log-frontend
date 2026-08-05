import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getDeadlineOccurrences,
  getNotificationSummary,
  getSubstituteRequests,
  respondToSubstituteRequest,
} from "../api/notificationApi";

// 아직 알림 데이터가 없을 때 사용할 기본값
const EMPTY_SUMMARY = {
  dueSoonCount: 0,
  pendingSubstituteRequestCount: 0,
  unreadCount: 0,
};

// 알림에 필요한 세 종류의 데이터를 동시에 조회합니다.
async function requestNotifications(groupId) {
  const [
    summaryResponse,
    occurrences,
    requests,
  ] = await Promise.all([
    getNotificationSummary(groupId),
    getDeadlineOccurrences(groupId),
    getSubstituteRequests(groupId),
  ]);

  return {
    summary:
      summaryResponse ?? EMPTY_SUMMARY,

    occurrences,
    requests,
  };
}

export default function useNotifications(
  groupId,
) {
  // 백엔드의 알림 개수 요약
  const [summary, setSummary] =
    useState(EMPTY_SUMMARY);

  // 내가 담당한 미완료 업무
  const [deadlineItems, setDeadlineItems] =
    useState([]);

  // 내가 받은 미응답 대타 요청
  const [
    substituteRequests,
    setSubstituteRequests,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    respondingRequestId,
    setRespondingRequestId,
  ] = useState(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  // 새로고침 또는 대타 처리 후
  // 알림 데이터를 다시 조회하는 함수입니다.
  const loadNotifications = useCallback(
    async (showLoading = true) => {
      // 하우스 정보를 아직 가져오지 못했다면
      // 잘못된 groupId로 API를 호출하지 않습니다.
      if (!groupId) {
        setSummary(EMPTY_SUMMARY);
        setDeadlineItems([]);
        setSubstituteRequests([]);
        setLoading(false);

        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        }

        setErrorMessage("");

        const {
          summary: nextSummary,
          occurrences,
          requests,
        } = await requestNotifications(
          groupId,
        );

        setSummary(nextSummary);
        setDeadlineItems(occurrences);
        setSubstituteRequests(requests);
      } catch (error) {
        setErrorMessage(
          error.message ??
            "알림을 불러오지 못했습니다.",
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [groupId],
  );

  // groupId를 가져오면 알림을 처음 조회합니다.
  useEffect(() => {
    // 하우스 ID가 아직 없다면
    // 백엔드에 요청하지 않습니다.
    if (!groupId) {
      return undefined;
    }

    // 화면이 사라진 뒤에는
    // 비동기 응답으로 상태를 변경하지 않습니다.
    let cancelled = false;

    async function loadInitialNotifications() {
      try {
        const {
          summary: nextSummary,
          occurrences,
          requests,
        } = await requestNotifications(
          groupId,
        );

        if (cancelled) {
          return;
        }

        setSummary(nextSummary);
        setDeadlineItems(occurrences);
        setSubstituteRequests(requests);
        setErrorMessage("");
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message ??
              "알림을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialNotifications();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 대타 요청 수락 또는 거절
  async function handleSubstituteResponse(
    requestId,
    action,
  ) {
    // 이미 다른 요청을 처리 중이면 중복 실행하지 않습니다.
    if (respondingRequestId) {
      return;
    }

    // 현재 화면에 있는 요청에서 version을 찾습니다.
    const targetRequest =
      substituteRequests.find(
        (request) =>
          request.requestId === requestId,
      );

    if (!targetRequest) {
      setErrorMessage(
        "대타 요청 정보를 찾을 수 없습니다.",
      );

      return;
    }

    try {
      setRespondingRequestId(requestId);
      setErrorMessage("");

      await respondToSubstituteRequest({
        groupId,
        requestId,
        action,

        // 백엔드의 If-Match 헤더에 사용할 값입니다.
        version: targetRequest.version,
      });

      // 수락 또는 거절 후 목록과 숫자를 다시 조회합니다.
      await loadNotifications(false);
    } catch (error) {
      setErrorMessage(
        error.message ??
          "대타 요청을 처리하지 못했습니다.",
      );
    } finally {
      setRespondingRequestId(null);
    }
  }

  return {
    summary,
    deadlineItems,
    substituteRequests,

    // 사이드바 배지에는 백엔드가 계산한 값을 사용합니다.
    notificationCount:
      summary.unreadCount ?? 0,

    // groupId가 없다면 로딩 화면을 계속 표시하지 않습니다.
    loading: Boolean(groupId) && loading,

    respondingRequestId,
    errorMessage,

    // 새로고침 버튼에서 사용합니다.
    reload: () => loadNotifications(true),

    handleSubstituteResponse,
  };
}