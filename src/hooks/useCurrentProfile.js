import { useEffect, useState } from "react";

import { getCurrentUser } from "../api/authApi";
import { getMyGroups } from "../api/groupApi";
import {
  resolveActiveGroup,
  saveActiveGroupId,
} from "../utils/activeGroup";

export default function useCurrentProfile() {
  const [user, setUser] =
    useState(null);

  // 사용자가 가입한 전체 하우스 목록입니다.
  const [groups, setGroups] =
    useState([]);

  // 현재 화면에서 사용 중인 하우스입니다.
  const [activeGroup, setActiveGroup] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentProfile() {
      try {
        const [
          currentUser,
          currentGroups,
        ] = await Promise.all([
          getCurrentUser(),
          getMyGroups(),
        ]);

        if (cancelled) {
          return;
        }

        setUser(currentUser);
        setGroups(currentGroups);

        setActiveGroup(
          resolveActiveGroup(
            currentGroups,
          ),
        );
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

  const nickname =
    user?.nickname?.trim() || "사용자";

  const houseName =
    activeGroup?.groupName ||
    "선택된 하우스 없음";

  function updateCurrentUser(updatedUser) {
    setUser(updatedUser);
  }

  function selectActiveGroup(group) {
    if (!group?.groupPublicId) {
      return;
    }

    saveActiveGroupId(
      group.groupPublicId,
    );

    setActiveGroup(group);
  }

  return {
    user,

    // 전체 하우스 목록
    groups,

    // 새 코드에서 사용할 현재 하우스 이름
    activeGroup,

    // 기존 Layout·예약·계정 코드와의 호환을 위해 유지합니다.
    // group도 activeGroup과 같은 값을 가리킵니다.
    group: activeGroup,

    nickname,
    houseName,

    isLoading,
    errorMessage,

    updateCurrentUser,
    selectActiveGroup,
  };
}