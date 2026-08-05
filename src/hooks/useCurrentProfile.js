import { useEffect, useState } from "react";

import { getCurrentUser } from "../api/authApi";
import { getMyGroup } from "../api/groupApi";

export default function useCurrentProfile() {
  // API에서 받은 사용자 전체 정보를 저장합니다.
  const [user, setUser] = useState(null);

  // API에서 받은 하우스 전체 정보를 저장합니다.
  const [group, setGroup] = useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentProfile() {
      try {
        // 사용자 정보와 하우스 정보를 동시에 요청합니다.
        const [currentUser, currentGroup] =
          await Promise.all([
            getCurrentUser(),
            getMyGroup(),
          ]);

        if (cancelled) {
          return;
        }

        setUser(currentUser);
        setGroup(currentGroup);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setErrorMessage(
          error.message ??
            "사용자 정보를 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCurrentProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // 사이드바와 홈에서 편하게 사용할 값입니다.
  const nickname =
    user?.nickname?.trim() || "사용자";

  const houseName =
    group?.groupName || "참여 중인 하우스 없음";

  // 닉네임 수정 API의 응답으로 공통 사용자 정보를 갱신합니다.
  function updateCurrentUser(updatedUser) {
    setUser(updatedUser);
  }

  return {
    // 계정 페이지에서 사용하는 전체 정보
    user,
    group,

    // 사이드바와 홈에서 사용하는 간단한 정보
    nickname,
    houseName,

    isLoading,
    errorMessage,

    updateCurrentUser,
  };
}