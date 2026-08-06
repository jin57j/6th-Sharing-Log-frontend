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
        const data = await memberApi.getMembers(groupId);
        setMembers(data);
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
    setSelectedIds((prev) =>
      prev.includes(membershipId)
        ? prev.filter((id) => id !== membershipId) // 이미 있으면 제거
        : [...prev, membershipId] // 없으면 추가
    );
  };

  // 3. 전체 선택 (ALL_ACTIVE_MEMBERS 모드일 때 유용)
  const selectAll = () => {
    setSelectedIds(members.map((m) => m.membershipId));
  };

  // 컴포넌트에서 쓸 데이터와 함수들만 밖으로 던져줌
  return {
    members,
    selectedIds,
    isLoading,
    toggleMember,
    selectAll,
    setSelectedIds, // 폼 초기화 시 필요할 수 있음
  };
};