import { LuClock, LuHandshake, LuCheck } from "react-icons/lu";

function TaskCard({ task, onComplete }) {
  const isUrgent = task.isUrgent;

  return (
    <li
      className={`shrink-0 w-[calc(50%-8px)] min-w-[300px] rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border ${
        isUrgent ? "bg-[#FFF9D2] border-[#FDE68A]" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[36px]">{task.icon}</span>

        <div
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 ${
            isUrgent ? "bg-[#CD5C5C] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          <LuClock className="w-3.5 h-3.5" />
          {task.timeLeft}
        </div>
      </div>

      <h3 className="mb-1 text-xl font-bold text-[#111]">{task.title}</h3>
      <p className="mb-7 text-[14px] text-[#888]">{task.frequency}</p>

      <div className="flex gap-2">
        <button
          type="button"
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
