import { ChevronLeft } from "lucide-react";

import { formatChoreSchedule } from "../../utils/rotationUtils";

function ChoreCalendarHeader({ selectedChore, houseName, onClose }) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="mb-5 flex items-center gap-2 text-sm font-bold text-[#8B8575] transition hover:text-[#1A1428]"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        업무 목록으로
      </button>

      <header>
        <p className="text-sm text-[#8B8575]">{houseName}의 로테이션</p>
        <h1 className="mt-1 font-display text-[28px] font-black tracking-[-0.03em]">
          {selectedChore.name}
        </h1>
        <p className="mt-1 text-sm text-[#8B8575]">
          {formatChoreSchedule(selectedChore)} · 로테이션
        </p>
      </header>
    </>
  );
}

export default ChoreCalendarHeader;
