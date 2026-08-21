import { useState } from "react";

import { rotationApi } from "../api/rotationApi";
import { useGroupMembers } from "./useGroupMember";
import useTasks from "./useTasks";

const ROTATION_PREVIEW_OFFSETS = [
  0,
  1,
  2,
  3,
];

function useTaskPage(activeGroup) {
  const activeGroupId =
    activeGroup?.groupPublicId ?? "";

  const tasks = useTasks(
    activeGroupId,
  );

  const { members: groupMembers } =
    useGroupMembers(tasks.groupId);

  const [
    expandedChoreId,
    setExpandedChoreId,
  ] = useState(null);

  const [
    rotationMap,
    setRotationMap,
  ] = useState({});

  async function toggleRotation(chore) {
    const choreId =
      typeof chore === "object"
        ? chore.choreId
        : chore;

    if (expandedChoreId === choreId) {
      setExpandedChoreId(null);
      return;
    }

    setExpandedChoreId(choreId);

    if (rotationMap[choreId]) {
      return;
    }

    try {
      const responses =
        await Promise.all(
          ROTATION_PREVIEW_OFFSETS.map(
            (weekOffset) =>
              rotationApi.getWeeklyPreview(
                tasks.groupId,
                {
                  choreId,
                  weekOffset,
                },
              ),
          ),
        );

      const allOccurrences =
        responses.flatMap(
          (response) =>
            response.items || [],
        );

      const targetOccurrences =
        allOccurrences.filter(
          (occurrence) =>
            occurrence.choreId ===
            choreId,
        );

      const displayNames =
        targetOccurrences
          .filter(
            (occurrence) =>
              occurrence.currentAssignee,
          )
          .map(
            (occurrence) =>
              occurrence
                .currentAssignee
                .displayName,
          )
          .slice(0, 5);

      setRotationMap(
        (currentRotationMap) => ({
          ...currentRotationMap,
          [choreId]:
            displayNames.length > 0
              ? displayNames
              : [
                  "예정된 당번이 없습니다.",
                ],
        }),
      );
    } catch (error) {
      console.error(
        "미래 로테이션 조회 실패",
        error,
      );

      setRotationMap(
        (currentRotationMap) => ({
          ...currentRotationMap,
          [choreId]: [
            "미래 로테이션 정보를 불러오지 못했습니다.",
          ],
        }),
      );
    }
  }

  return {
    header: {
      onAdd: tasks.openAddModal,
    },

    list: {
      chores: tasks.chores,
      groupMembers,
      expandedChoreId,
      rotationMap,
      onToggleRotation:
        toggleRotation,
      onEdit: tasks.openEditModal,
      onDelete: tasks.handleDelete,
    },

    modal: {
      isOpen: tasks.isModalOpen,
      editingChore:
        tasks.editingChore,
      onClose: tasks.closeModal,
      onSubmit:
        tasks.handleChoreSubmit,
      groupId: tasks.groupId,
    },
  };
}

export default useTaskPage;
