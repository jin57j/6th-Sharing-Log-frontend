import { useEffect, useState } from "react";

import {
  getDeadlineOccurrences,
  getSubstituteRequests,
  respondToSubstituteRequest,
} from "../api/notificationApi";

// TODO:
// 실제 하우스 선택 상태가 연결되면
// 선택한 하우스의 groupPublicId로 교체해야 함
const TEMPORARY_GROUP_PUBLIC_ID = "group-1";

export default function useNotifications() {
  const [deadlineItems, setDeadlineItems] = useState([]);
  const [substituteRequests, setSubstituteRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [respondingRequestId, setRespondingRequestId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 새로고침 버튼을 눌렀을 때 실행하는 함수
  async function loadNotifications() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [occurrences, requests] = await Promise.all([
        getDeadlineOccurrences(TEMPORARY_GROUP_PUBLIC_ID),
        getSubstituteRequests(TEMPORARY_GROUP_PUBLIC_ID),
      ]);

      setDeadlineItems(occurrences);
      setSubstituteRequests(requests);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // 알림 화면이 처음 열렸을 때 실행
  useEffect(() => {
    let cancelled = false;

    async function loadInitialNotifications() {
      try {
        const [occurrences, requests] = await Promise.all([
          getDeadlineOccurrences(TEMPORARY_GROUP_PUBLIC_ID),
          getSubstituteRequests(TEMPORARY_GROUP_PUBLIC_ID),
        ]);

        // 화면이 사라진 뒤에는 상태를 변경하지 않음
        if (cancelled) {
          return;
        }

        setDeadlineItems(occurrences);
        setSubstituteRequests(requests);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message);
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
  }, []);

  // 대타 요청 수락 또는 거절
  async function handleSubstituteResponse(requestId, action) {
    // 다른 요청을 처리 중이면 중복 요청 방지
    if (respondingRequestId) {
      return;
    }

    try {
      setRespondingRequestId(requestId);
      setErrorMessage("");

      const updatedRequest = await respondToSubstituteRequest({
        groupId: TEMPORARY_GROUP_PUBLIC_ID,
        requestId,
        action,
      });

      setSubstituteRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.requestId === requestId
            ? {
                ...updatedRequest,

                // 화면에서 수락과 거절 결과를 구분하는 프론트 전용 값
                myResponse: action,
              }
            : request,
        ),
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setRespondingRequestId(null);
    }
  }

  return {
    deadlineItems,
    substituteRequests,
    loading,
    respondingRequestId,
    errorMessage,
    reload: loadNotifications,
    handleSubstituteResponse,
  };
}