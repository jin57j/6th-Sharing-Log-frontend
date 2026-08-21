import {
  CalendarDays,
  ListFilter,
} from "lucide-react";

export default function CompletedViewTabs({
  viewMode,
  hasSelectedChore,
  onShowChores,
  onShowCalendar,
}) {
  return (
    <div className="mt-6 flex rounded-2xl border border-[#1A1428]/10 bg-white p-1.5">
      <button
        type="button"
        onClick={onShowChores}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
          viewMode === "chores"
            ? "bg-[#1A1428] text-white"
            : "text-[#8B8575] hover:bg-[#F8F4EE]"
        }`}
      >
        <ListFilter
          size={16}
          aria-hidden="true"
        />
        업무별 기록
      </button>
      <button
        type="button"
        onClick={onShowCalendar}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
          viewMode === "calendar" &&
          !hasSelectedChore
            ? "bg-[#1A1428] text-white"
            : "text-[#8B8575] hover:bg-[#F8F4EE]"
        }`}
      >
        <CalendarDays
          size={16}
          aria-hidden="true"
        />
        전체 달력
      </button>
    </div>
  );
}
