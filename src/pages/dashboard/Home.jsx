import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";

import SubstituteRequestModal from "../../components/common/SubstituteRequestModal";
import WeeklyTaskCarousel from "../../components/home/WeeklyTaskCarousel";
import Calendar from "./Calendar";
import { createSubstituteRequest } from "../../api/notificationApi";
import { rotationApi } from "../../api/rotationApi";

function Home() {
  const { activeGroup } = useOutletContext();

  const groupId = activeGroup?.groupPublicId;
  const [myTasks, setMyTasks] = useState([]);
  

  const [selectedTask, setSelectedTask] = useState(null);

  // 실제 내 업무(Occurrences) 불러오기
  useEffect(() => {
    if (!groupId) return;

    const fetchMyTasks = async () => {
      try {
        // 나에게 배정된 업무만 가져옵니다.
        const response = await rotationApi.getOccurrences(groupId, {
          mineOnly: true,
        });

        const occurrences = response.items || response || [];
        const now = new Date(); // 현재 시간

        // 완료되지 않았으면서 && 마감 시간이 지나지 않은 업무만 필터링
        const pendingTasks = occurrences.filter((task) => {
          const isNotCompleted = task.status !== "COMPLETED";
          // dueAt이 존재하고, 현재 시간보다 과거라면 true
          const isPastDue = task.dueAt ? new Date(task.dueAt) < now : false;

          // 완료 안 됨 + 마감 안 지남 = 화면에 표시
          return isNotCompleted && !isPastDue;
        });

        setMyTasks(pendingTasks);
      } catch (error) {
        console.error("내 업무를 불러오는 중 에러 발생:", error);
      }
    };

    fetchMyTasks();
  }, [groupId]);

  const handleCompleteTask = async (task) => {
    // API 연동: 업무 완료 처리 로직 준비
    if (!window.confirm(`'${task.choreName}' 업무를 완료하시겠습니까?`)) return;

    try {
      await rotationApi.completeOccurrence(
        groupId,
        task.occurrenceId,
        task.version,
      );
      // 완료 후 목록 새로고침을 위해 임시로 상태에서 제거 (또는 fetchMyTasks 재호출)
      setMyTasks((prev) =>
        prev.filter((t) => t.occurrenceId !== task.occurrenceId),
      );
    } catch (error) {
      console.error("업무 완료 처리 실패:", error);
      alert("업무 완료 처리에 실패했습니다.");
    }
  };

  // 대타 요청 처리 함수 추가
  const handleSubstituteRequest = async (reason) => {
    await createSubstituteRequest({
      groupId,
      occurrenceId: selectedTask.occurrenceId,
      reason,
      version: selectedTask.version,
    });
    // 요청 완료 후 모달 닫기 (필요시 추가)
    // setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] px-5 py-10">
      <div className="mx-auto max-w-4xl">
      {/* 업무 섹션 */}
      <section className="mb-12">
        <header className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-1.5 text-xl font-bold">
              이번 주 내 업무
            </h2>
          </div>
          <span className="rounded-full bg-[#FCE8E8] px-3.5 py-1.5 text-[13px] font-bold text-[#D9534F]">
            {myTasks.length}개 남음
          </span>
        </header>

        {myTasks.length > 0 ? (
          <WeeklyTaskCarousel
            key={groupId}
            tasks={myTasks}
            onComplete={handleCompleteTask}
            onRequestSubstitute={
              setSelectedTask
            }
          />
        ) : (
          <div className="py-10 text-center bg-white rounded-[20px] border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-bold">
              이번 주 배정된 업무가 없습니다 🎉
            </p>
          </div>
        )}
      </section>

      <Calendar embedded />

      {/*  대타 요청 모달 추가 */}
      {selectedTask && (
        <SubstituteRequestModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmit={handleSubstituteRequest}
        />
      )}
      </div>
    </div>
  );
}

export default Home;
