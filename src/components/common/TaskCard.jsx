import { LuClock, LuHandshake, LuCheck } from "react-icons/lu";
import { getChoreIcon } from "../../utils/choreUtils";
import { CalendarDays } from "lucide-react";

// 마감 시간 계산 헬퍼 함수
const calculateTimeInfo = (dueAt) => {
  if (!dueAt) return { timeLeft: "기한 미정", isUrgent: false };

  const now = new Date();
  const due = new Date(dueAt);
  const diffMs = due - now;

  if (diffMs < 0) return { timeLeft: "마감 지남", isUrgent: true };

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
  const { timeLeft, isUrgent } = calculateTimeInfo(task.dueAt);
  const icon = getChoreIcon(task.choreName);

  const formattedDate = task.dueAt
    ? new Date(task.dueAt).toLocaleDateString("ko-KR", {
        month: "numeric",
        day: "numeric",
        weekday: "short",
      })
    : "상시";

  return (
    <li
      className={`shrink-0 w-full sm:w-[calc(50%-8px)] sm:min-w-[300px] rounded-[20px] p-4 sm:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border transition-all ${
        isUrgent ? "bg-[#FFF9D2] border-[#FDE68A]" : "bg-white border-gray-200"
      }`}
    >
      {/* 상단: 아이콘 & 남은 시간 배지 */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <span
          aria-hidden="true"
          className="shrink-0 text-[36px] leading-none sm:text-[44px]"
        >
          {icon}
        </span>

        <div
          className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shrink-0 ${
            isUrgent ? "bg-[#CD5C5C] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          <LuClock className="w-3.5 h-3.5" />
          {timeLeft}
        </div>
      </div>

      {/* 업무 정보 */}
      <h3 className="mb-1 text-lg sm:text-xl font-bold text-[#111] truncate">
        {task.choreName}
      </h3>
      <p className="mb-5 sm:mb-7 flex items-center gap-1.5 text-xs sm:text-[14px] text-[#888]">
        <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span>마감일: {formattedDate}</span>
      </p>

      {/* 하단 버튼 그룹 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onRequestSubstitute(task)}
          className="flex-1 py-2.5 sm:py-2.5 bg-[#E63946] text-white rounded-full font-bold text-xs sm:text-[14px] flex justify-center items-center gap-1 sm:gap-1.5 hover:bg-[#d62837] active:scale-[0.98] transition-all shadow-sm"
        >
          <LuHandshake className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
          <span>대타 요청</span>
        </button>

        <button
          type="button"
          onClick={() => onComplete(task)}
          className="flex-1 py-2.5 sm:py-2.5 bg-[#78D6A4] rounded-full text-[#111] font-bold text-xs sm:text-[14px] flex justify-center items-center gap-1 sm:gap-1.5 hover:bg-[#68C393] active:scale-[0.98] transition-all shadow-sm"
        >
          <LuCheck className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[3] shrink-0" />
          <span>업무 완료</span>
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
