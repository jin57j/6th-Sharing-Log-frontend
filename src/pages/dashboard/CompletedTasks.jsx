import { useState } from "react";

function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("completedTasks")) || [];
  });

  // 내역 전체 지우기
  const handleClearHistory = () => {
    localStorage.removeItem("completedTasks");
    setCompletedTasks([]);
  };

  const handleCancelCompletion = (taskToCancel) => {
    // 완료된 목록(현재 화면)에서 제거
    const updatedCompleted = completedTasks.filter(
      (task) => task.id !== taskToCancel.id,
    );
    setCompletedTasks(updatedCompleted);
    localStorage.setItem("completedTasks", JSON.stringify(updatedCompleted));

    // 진행 중인 목록(activeTasks)으로 다시 복구
    const existingActive =
      JSON.parse(localStorage.getItem("activeTasks")) || [];

    // 중복 방지
    if (!existingActive.some((task) => task.id === taskToCancel.id)) {
      const updatedActive = [...existingActive, taskToCancel];
      localStorage.setItem("activeTasks", JSON.stringify(updatedActive));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#111]">완료된 업무 내역 🏆</h2>
        {completedTasks.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            내역 지우기
          </button>
        )}
      </div>

      {completedTasks.length === 0 ? (
        <p className="text-gray-500">아직 완료된 업무가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {completedTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-5 bg-white border border-gray-100 shadow-sm rounded-xl"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{task.icon}</span>
                  <h4 className="m-0 text-lg font-semibold text-gray-400 line-through">
                    {task.title}
                  </h4>
                </div>
                <p className="m-0 text-sm text-gray-400 ml-8">
                  {task.frequency}
                </p>
              </div>

              <button
                onClick={() => handleCancelCompletion(task)}
                className="px-4 py-2 text-sm font-bold text-gray-500 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompletedTasks;
