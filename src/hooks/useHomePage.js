import { useEffect, useState } from "react";

import { createSubstituteRequest } from "../api/notificationApi";
import { rotationApi } from "../api/rotationApi";
import { filterPendingTasks } from "../utils/homeUtils";

export default function useHomePage(activeGroup) {
  const groupId = activeGroup?.groupPublicId;
  const [myTasks, setMyTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (!groupId) {
      return;
    }

    async function fetchMyTasks() {
      try {
        const response = await rotationApi.getOccurrences(groupId, {
          mineOnly: true,
        });
        const occurrences = response.items || response || [];
        setMyTasks(filterPendingTasks(occurrences));
      } catch (error) {
        console.error("내 업무를 불러오는 중 에러 발생:", error);
      }
    }

    fetchMyTasks();
  }, [groupId]);

  async function completeTask(task) {
    const confirmed = window.confirm(
      `'${task.choreName}' 업무를 완료하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await rotationApi.completeOccurrence(
        groupId,
        task.occurrenceId,
        task.version,
      );
      setMyTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.occurrenceId !== task.occurrenceId,
        ),
      );
    } catch (error) {
      console.error("업무 완료 처리 실패:", error);
      alert("업무 완료 처리에 실패했습니다.");
    }
  }

  async function requestSubstitute(reason) {
    await createSubstituteRequest({
      groupId,
      occurrenceId: selectedTask.occurrenceId,
      reason,
      version: selectedTask.version,
    });
  }

  return {
    weeklyTasks: {
      groupId,
      tasks: myTasks,
      onComplete: completeTask,
      onRequestSubstitute: setSelectedTask,
    },
    substituteModal: selectedTask
      ? {
          task: selectedTask,
          onClose: () => setSelectedTask(null),
          onSubmit: requestSubstitute,
        }
      : null,
  };
}
