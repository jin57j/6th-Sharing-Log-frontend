import { useEffect, useMemo, useState } from "react";
import { memberApi } from "../api/memberApi";
import { sortMembers } from "../utils/memberUtils";

export default function useMembers(groupId) {
  const [members, setMembers] = useState([]);
  const [actorMembershipId, setActorMembershipId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 아직 하우스 정보가 준비되지 않았다면 멤버 API를 요청하지 않습니다.
    if (!groupId) {
      return undefined;
    }

    let cancelled = false;

    async function loadMembers() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await memberApi.getRotationMembers(groupId);

        if (cancelled) return;

        // 실제 멤버 배열은 백엔드 응답의 items에 들어 있습니다.
        setMembers(
          Array.isArray(response?.items) ? response.items : [],
        );

        // 현재 로그인한 사용자의 멤버십 ID입니다.
        setActorMembershipId(response?.actorMembershipId ?? "");
      } catch (error) {
        if (cancelled) return;

        console.error("하우스 멤버 목록을 불러오지 못했습니다.", error);
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

    // 화면을 벗어난 후 API 응답이 도착해도 화면 상태를 변경하지 않도록 처리합니다.
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 관리자를 먼저 보여주고, 같은 역할이면 닉네임 순서로 정렬합니다.
  const sortedMembers = useMemo(() => sortMembers(members), [members]);

  // 전체 멤버 중 OWNER 역할을 가진 사람의 수입니다.
  const ownerCount = useMemo(
    () => members.filter((member) => member.role === "OWNER").length,
    [members],
  );

  return {
    members,
    sortedMembers,
    actorMembershipId,
    ownerCount,
    isLoading,
    errorMessage,
  };
}