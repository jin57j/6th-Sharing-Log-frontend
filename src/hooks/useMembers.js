import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { memberApi } from "../api/memberApi";
import { sortMembers } from "../utils/memberUtils";

export default function useMembers(groupId) {
  const [members, setMembers] = useState([]);

  const [
    actorMembershipId,
    setActorMembershipId,
  ] = useState("");

  const [canManage, setCanManage] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    // 하우스 ID가 준비되지 않았다면 API를 호출하지 않습니다.
    if (!groupId) {
      return undefined;
    }

    let cancelled = false;

    async function loadMembers() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response =
          await memberApi.getRotationMembers(
            groupId,
          );

        if (cancelled) return;

        setMembers(
          Array.isArray(response?.items)
            ? response.items
            : [],
        );

        setActorMembershipId(
          response?.actorMembershipId ?? "",
        );

        setCanManage(
          response?.canManage === true,
        );
      } catch (error) {
        if (cancelled) return;

        console.error(
          "하우스 멤버 목록을 불러오지 못했습니다.",
          error,
        );

        setErrorMessage(
          "멤버 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 하우스 ID가 없다면 이전 하우스의 멤버가 보이지 않도록
  // 빈 배열을 사용합니다.
  const currentMembers = useMemo(
    () => (groupId ? members : []),
    [groupId, members],
  );

  // 관리자 승격 성공 후 해당 멤버의 역할을 바로 변경합니다.
  function updateMemberRole(
    membershipId,
    role,
  ) {
    setMembers((currentMemberList) =>
      currentMemberList.map((member) =>
        member.membershipId === membershipId
          ? {
              ...member,
              role,
            }
          : member,
      ),
    );
  }

  // 관리자를 먼저 표시하고 같은 역할에서는 닉네임순으로 정렬합니다.
  const sortedMembers = useMemo(
    () => sortMembers(currentMembers),
    [currentMembers],
  );

  // 현재 하우스의 관리자 수입니다.
  const ownerCount = useMemo(
    () =>
      currentMembers.filter(
        (member) =>
          member.role === "OWNER",
      ).length,
    [currentMembers],
  );

  return {
    members: currentMembers,
    sortedMembers,
    actorMembershipId:
      groupId
        ? actorMembershipId
        : "",
    canManage:
      Boolean(groupId) && canManage,
    ownerCount,
    isLoading:
      Boolean(groupId) && isLoading,
    errorMessage:
      groupId ? errorMessage : "",
    updateMemberRole,
  };
}