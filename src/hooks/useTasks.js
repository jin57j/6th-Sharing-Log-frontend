import { useState } from "react";
import { mockMyTasks } from "../mocks/homeData";

export default function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem("activeTasks"));
    if (savedTasks && savedTasks.length > 0) {
      return savedTasks;
    }
    return mockMyTasks;
  });

  const handleCompleteTask = (taskToComplete) => {
    // 현재 진행 중인 목록에서 해당 업무 제거
    const updatedTasks = tasks.filter((task) => task.id !== taskToComplete.id);
    setTasks(updatedTasks);
    localStorage.setItem("activeTasks", JSON.stringify(updatedTasks));

    const existingCompleted =
      JSON.parse(localStorage.getItem("completedTasks")) || [];

    // 이미 완료 목록에 똑같은 업무(id)가 있는지 검사
    const isDuplicate = existingCompleted.some(
      (task) => task.id === taskToComplete.id
    );

    // 중복이 아닐 때만 추가
    if (!isDuplicate) {
      const updatedCompleted = [...existingCompleted, taskToComplete];
      localStorage.setItem("completedTasks", JSON.stringify(updatedCompleted));
    }
  };

  return {
    tasks,
    handleCompleteTask,
  };
}