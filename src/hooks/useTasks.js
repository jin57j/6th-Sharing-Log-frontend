import { useState, useEffect } from "react";
import { choreApi } from "../api/choreApi"; // 경로에 맞게 수정해주세요
import { getMyGroup } from "../api/groupApi"; // 경로에 맞게 수정해주세요

export default function useTasks() {
  const [groupId, setGroupId] = useState(null);
  const [chores, setChores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChore, setEditingChore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 그룹 정보 로드
  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const response = await getMyGroup();
        const group = response?.data || response;
        const targetGroupId = group?.groupPublicId;

        if (targetGroupId) {
          setGroupId(targetGroupId);
        }
      } catch (error) {
        console.error("❌ 그룹 정보를 가져오는 중 에러 발생:", error);
      }
    };

    fetchUserGroup();
  }, []);

  // 2. 업무 목록 로드
  const loadChores = async (currentGroupId) => {
    try {
      setIsLoading(true);
      const data = await choreApi.getChores(currentGroupId);
      setChores(data.items || data || []);
    } catch (error) {
      console.error("Failed to fetch chores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 그룹 ID가 세팅되면 업무 목록을 자동으로 불러옵니다.
  useEffect(() => {
    if (!groupId) return;
    loadChores(groupId);
  }, [groupId]);

  // 3. 모달 제어 핸들러
  const openAddModal = () => {
    setEditingChore(null);
    setIsModalOpen(true);
  };

  const openEditModal = (chore) => {
    setEditingChore(chore);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingChore(null);
  };

  // 4. API 동작 핸들러 (생성/수정)
  const handleChoreSubmit = async (formData) => {
    if (!groupId) return;

    try {
      if (editingChore) {
        await choreApi.updateChore(
          groupId,
          editingChore.choreId,
          formData,
          String(editingChore.version),
        );
      } else {
        await choreApi.createChore(groupId, formData);
      }

      await loadChores(groupId); // 목록 새로고침
      closeModal();
    } catch (error) {
      console.error("Failed to submit chore:", error);
    }
  };

  // 5. API 동작 핸들러 (삭제)
  const handleDelete = async (choreId, version) => {
    if (!groupId) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await choreApi.deleteChore(groupId, choreId, String(version));
      loadChores(groupId);
    } catch (error) {
      console.error("Failed to delete chore:", error);
    }
  };

  // 컴포넌트에서 필요한 데이터와 함수만 반환
  return {
    chores,
    isModalOpen,
    editingChore,
    isLoading,
    openAddModal,
    openEditModal,
    closeModal,
    handleChoreSubmit,
    handleDelete,
  };
}
