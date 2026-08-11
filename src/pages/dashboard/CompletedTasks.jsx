import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { rotationApi } from "../../api/rotationApi";
import { choreApi } from "../../api/choreApi";

// 업무 이름에 따른 자동 아이콘 매핑
const getChoreIcon = (choreName = "") => {
  if (choreName.includes("쓰레기") || choreName.includes("분리수거"))
    return "🗑️";
  if (choreName.includes("주방") || choreName.includes("설거지")) return "🍽️";
  if (choreName.includes("화장실") || choreName.includes("청소")) return "🚽";
  if (choreName.includes("빨래") || choreName.includes("세탁")) return "🧺";
  return "📝";
};

function CompletedTasks() {
  const { activeGroup } = useOutletContext();
  const groupId = activeGroup?.groupPublicId;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 서버에서 완료 내역과 현재 살아있는 업무 목록을 동시에 불러와서 필터링
  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Promise.all을 사용해 두 API를 동시에 호출하여 속도 최적화
        const [historyRes, choresRes] = await Promise.all([
          rotationApi.getCompletedHistory(groupId),
          choreApi.getChores(groupId),
        ]);

        const history = historyRes.items || historyRes || [];
        const activeChores = choresRes.items || choresRes || [];

        // 핵심 로직: 현재 존재하는 업무의 choreId만 추출하여 Set으로 만듦
        const activeChoreIds = new Set(
          activeChores.map((chore) => chore.choreId),
        );

        // 완료 내역 중에서, 현재 존재하는 업무(activeChoreIds)에 속한 내역만 남김
        const validHistory = history.filter((task) =>
          activeChoreIds.has(task.choreId),
        );

        setCompletedTasks(validHistory);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  //  완료 취소
  const handleCancelCompletion = async (taskToCancel) => {
    if (
      !window.confirm(
        `'${taskToCancel.choreName}' 업무 완료를 취소하시겠습니까?`,
      )
    )
      return;

    try {
      await rotationApi.undoComplete(
        groupId,
        taskToCancel.occurrenceId,
        taskToCancel.version,
      );

      setCompletedTasks((prev) =>
        prev.filter((task) => task.occurrenceId !== taskToCancel.occurrenceId),
      );
    } catch (error) {
      console.error("완료 취소 실패:", error);
      alert("완료 취소 처리에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#111]">완료된 업무 내역 🏆</h2>
      </div>

      {isLoading ? (
        <p className="text-gray-500">내역을 불러오는 중...</p>
      ) : completedTasks.length === 0 ? (
        <p className="text-gray-500">아직 완료된 업무가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {completedTasks.map((task) => {
            const icon = getChoreIcon(task.choreName);
            const completedDate = task.completedAt
              ? new Date(task.completedAt).toLocaleString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <li
                key={task.occurrenceId}
                className="flex items-center justify-between p-5 bg-white border border-gray-100 shadow-sm rounded-xl"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{icon}</span>
                    <h4 className="m-0 text-lg font-semibold text-gray-400 line-through">
                      {task.choreName}
                    </h4>
                  </div>
                  <p className="m-0 text-sm text-gray-400 ml-8">
                    {completedDate} 완료
                  </p>
                </div>

                <button
                  onClick={() => handleCancelCompletion(task)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CompletedTasks;
