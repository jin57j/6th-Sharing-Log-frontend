import { useEffect, useState } from "react";

import { getCurrentUser } from "../api/authApi";
import { getMyGroups } from "../api/groupApi";
import {
  resolveActiveGroup,
  saveActiveGroupId,
} from "../utils/activeGroup";

export default function useCurrentProfile() {
  const [user, setUser] = useState(null);

  // 사용자가 가입한 전체 하우스 목록입니다.
  const [groups, setGroups] = useState([]);

  // 현재 화면에서 선택한 하우스입니다.
  const [activeGroup, setActiveGroup] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentProfile() {
      try {
        const [currentUser, currentGroups] = await Promise.all([
          getCurrentUser(),
          getMyGroups(),
        ]);

        if (cancelled) {
          return;
        }

        setUser(currentUser);
        setGroups(currentGroups);

        setActiveGroup(
          resolveActiveGroup(currentGroups),
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

  const nickname = user?.nickname?.trim() || "사용자";

  const houseName =
    activeGroup?.groupName || "선택된 하우스 없음";

  // 닉네임 수정 성공 후 사용자 정보를 갱신합니다.
  function updateCurrentUser(updatedUser) {
    setUser(updatedUser);
  }

  // 하우스 정보 수정 성공 후
  // 전체 하우스 목록과 현재 하우스를 함께 갱신합니다.
  function updateCurrentGroup(updatedGroup) {
    if (!updatedGroup?.groupPublicId) {
      return;
    }

    function applyUpdatedInformation(group) {
      if (
        group.groupPublicId !== updatedGroup.groupPublicId
      ) {
        return group;
      }

      return {
        ...group,
        groupName: updatedGroup.name,
        groupAddress: updatedGroup.address,
      };
    }

    // 사용자가 가입한 전체 하우스 목록을 갱신합니다.
    setGroups((currentGroups) =>
      currentGroups.map(applyUpdatedInformation),
    );

    // 현재 선택된 하우스 정보도 갱신합니다.
    setActiveGroup((currentGroup) => {
      if (!currentGroup) {
        return currentGroup;
      }

      return applyUpdatedInformation(currentGroup);
    });
  }

  // 하우스 선택 화면에서 선택한 하우스를 저장합니다.
  function selectActiveGroup(group) {
    if (!group?.groupPublicId) {
      return;
    }

    saveActiveGroupId(group.groupPublicId);
    setActiveGroup(group);
  }

  return {
    user,

    // 사용자가 가입한 전체 하우스 목록
    groups,

    // 현재 선택한 하우스
    activeGroup,

    // 기존 코드와의 호환성을 위해 유지합니다.
    // group과 activeGroup은 같은 값을 가리킵니다.
    group: activeGroup,

    nickname,
    houseName,

    isLoading,
    errorMessage,

    updateCurrentUser,
    updateCurrentGroup,
    selectActiveGroup,
  };
}
