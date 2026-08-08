import { useState, useEffect } from "react";
import { memberApi } from "../api/memberApi";

export const useGroupMembers = (groupId) => {
  const [members, setMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 멤버 목록 불러오기
  useEffect(() => {
    if (!groupId) return;

    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const data = await memberApi.getRotationMembers(groupId);

        // 서버 응답에서 실제 배열 데이터 추출
        const memberList = Array.isArray(data) ? data : data?.items || [];
        setMembers(memberList);
      } catch (error) {
        console.error("멤버 목록 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [groupId]);

  // 2. 개별 멤버 선택/해제 토글
  const toggleMember = (membershipId) => {
    setSelectedIds(
      (prev) =>
        prev.includes(membershipId)
          ? prev.filter((id) => id !== membershipId) // 이미 있으면 제거
          : [...prev, membershipId], // 없으면 추가
    );
  };

  // 3. 전체 선택
  const selectAll = () => {
    // members는 이미 상태로 관리되는 배열이므로 바로 map 사용
    setSelectedIds(members.map((m) => m.membershipId));
  };

  return {
    members,
    selectedIds,
    isLoading,
    toggleMember,
    selectAll,
    setSelectedIds,
  };
};
