import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { memberApi } from "../api/memberApi";
import { sortMembers } from "../utils/memberUtils";

export default function useMembers(groupId) {
  // 백엔드에서 불러온 멤버 목록입니다.
  const [members, setMembers] =
    useState([]);

  // 현재 로그인한 사용자의 membershipId입니다.
  const [
    actorMembershipId,
    setActorMembershipId,
  ] = useState("");

  // 현재 사용자가 멤버를 관리할 수 있는지 나타냅니다.
  // 백엔드에서 현재 사용자가 OWNER라면 true를 전달합니다.
  const [canManage, setCanManage] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    // 하우스 ID가 없다면 API를 요청하지 않습니다.
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

        // 화면이 사라진 후 응답이 도착했다면
        // React 상태를 변경하지 않습니다.
        if (cancelled) {
          return;
        }

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
        if (cancelled) {
          return;
        }

        console.error(
          "하우스 멤버 목록을 불러오지 못했습니다.",
          error,
        );

        setMembers([]);
        setActorMembershipId("");
        setCanManage(false);

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

  // 하우스 ID가 없을 때 이전 하우스의 멤버가
  // 화면에 표시되지 않도록 빈 배열을 사용합니다.
  const currentMembers = useMemo(
    () => (groupId ? members : []),
    [groupId, members],
  );

  // 관리자 승격 성공 후 해당 멤버의 역할을
  // 화면에서 바로 OWNER로 변경합니다.
  function updateMemberRole(
    membershipId,
    role,
  ) {
    setMembers((currentMemberList) =>
      currentMemberList.map((member) =>
        member.membershipId ===
        membershipId
          ? {
              ...member,
              role,
            }
          : member,
      ),
    );
  }

  // 강퇴 성공 후 해당 멤버를
  // 화면의 멤버 목록에서 바로 제거합니다.
  function removeMember(membershipId) {
    setMembers((currentMemberList) =>
      currentMemberList.filter(
        (member) =>
          member.membershipId !==
          membershipId,
      ),
    );
  }

  // 관리자를 먼저 보여주고,
  // 역할이 같다면 닉네임순으로 정렬합니다.
  const sortedMembers = useMemo(
    () => sortMembers(currentMembers),
    [currentMembers],
  );

  // 현재 하우스의 관리자 수를 계산합니다.
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

    actorMembershipId: groupId
      ? actorMembershipId
      : "",

    canManage:
      Boolean(groupId) && canManage,

    ownerCount,

    isLoading:
      Boolean(groupId) && isLoading,

    errorMessage: groupId
      ? errorMessage
      : "",

    // 관리자 승격 후 사용하는 함수
    updateMemberRole,

    // 강퇴 후 사용하는 함수
    removeMember,
  };
}