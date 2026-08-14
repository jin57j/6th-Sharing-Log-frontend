import { LuClock, LuHandshake, LuCheck } from "react-icons/lu";
import { getChoreIcon } from "../../utils/choreUtils";

//마감 시간 계산 헬퍼 함수
const calculateTimeInfo = (dueAt) => {
  if (!dueAt) return { timeLeft: "기한 미정", isUrgent: false };

  const now = new Date();
  const due = new Date(dueAt);
  const diffMs = due - now;

  if (diffMs < 0) return { timeLeft: "마감 지남", isUrgent: true };

  // 남은 시간을 각각 일, 시간, 분 단위로 계산합니다.
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return { timeLeft: `${diffDays}일 남음`, isUrgent: false };
  } else if (diffHours > 0) {
    return { timeLeft: `${diffHours}시간 남음`, isUrgent: true };
  } else {
    return {
      timeLeft: diffMinutes > 0 ? `${diffMinutes}분 남음` : "1분 미만",
      isUrgent: true,
    };
  }
};

function TaskCard({ task, onComplete, onRequestSubstitute }) {
  // task 데이터에서 필요한 정보 추출 및 계산
  const { timeLeft, isUrgent } = calculateTimeInfo(task.dueAt);
  const icon = getChoreIcon(task.choreName);

  // 날짜 포맷 (예: 8/10(월))
  const formattedDate = task.dueAt
    ? new Date(task.dueAt).toLocaleDateString("ko-KR", {
        month: "numeric",
        day: "numeric",
        weekday: "short",
      })
    : "상시";

  return (
    <li
      className={`shrink-0 w-[calc(50%-8px)] min-w-[300px] rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border ${
        isUrgent ? "bg-[#FFF9D2] border-[#FDE68A]" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[36px]">{icon}</span>

        <div
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 ${
            isUrgent ? "bg-[#CD5C5C] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          <LuClock className="w-3.5 h-3.5" />
          {timeLeft}
        </div>
      </div>

      <h3 className="mb-1 text-xl font-bold text-[#111]">{task.choreName}</h3>
      <p className="mb-7 text-[14px] text-[#888]">마감일: {formattedDate}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onRequestSubstitute(task)}
          className="flex-1 py-2.5 bg-white border border-gray-200 rounded-full text-[#111] font-bold text-[14px] flex justify-center items-center gap-1.5 hover:bg-gray-50 transition-colors"
        >
          <LuHandshake className="w-[18px] h-[18px]" />
          대타 요청
        </button>

        <button
          type="button"
          onClick={() => onComplete(task)}
          className="flex-1 py-2.5 bg-[#78D6A4] rounded-full text-[#111] font-bold text-[14px] flex justify-center items-center gap-1.5 hover:bg-[#68C393] transition-colors"
        >
          <LuCheck className="w-[18px] h-[18px] stroke-[3]" />
          업무 완료
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
