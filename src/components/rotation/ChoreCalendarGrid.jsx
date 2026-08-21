import {
  formatDateKey,
  isDateInPlanningRange,
} from "../../utils/calendarUtils";
import CalendarDayHeader from "../calendar/CalendarDayHeader";

function ChoreCalendarGrid({
  calendarCells,
  occurrencesByDate,
  planningRange,
  selectedDateKey,
  todayKey,
  onSelectDate,
}) {
  return (
    <>
      <CalendarDayHeader />
      <div className="grid grid-cols-7 px-3 pb-4 pt-1">
        {calendarCells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-11" />;
          }

          const dateKey = formatDateKey(date);
          const dateOccurrences = occurrencesByDate.get(dateKey) ?? [];
          const hasOccurrence = dateOccurrences.length > 0;
          const isInRange = isDateInPlanningRange(dateKey, planningRange);
          const isSelected = dateKey === selectedDateKey;
          const isToday = dateKey === todayKey;

          return (
            <div
              key={dateKey}
              className="flex min-h-11 items-center justify-center py-0.5"
            >
              <button
                type="button"
                disabled={!isInRange}
                onClick={() => onSelectDate(isSelected ? "" : dateKey)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                  isSelected
                    ? "bg-[#1A1428] text-white"
                    : hasOccurrence
                      ? isToday
                        ? "bg-[#E63946]/10 text-[#E63946] hover:bg-[#E63946]/15"
                        : "bg-[#E63946]/10 text-[#1A1428] hover:bg-[#E63946]/15"
                      : isToday
                        ? "text-[#E63946] hover:bg-[#EFEBE2]"
                        : isInRange
                          ? "text-[#8B8575] hover:bg-[#EFEBE2]"
                          : "cursor-not-allowed text-[#8B8575]/25"
                }`}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ChoreCalendarGrid;
