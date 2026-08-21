import {
  formatDateKey,
  isDateInPlanningRange,
} from "../../utils/calendarUtils";

import CalendarDayHeader from "./CalendarDayHeader";

function CalendarGrid({
  calendarCells,
  occurrencesByDate,
  planningRange,
  selectedDateKey,
  todayKey,
  calendarTab,
  onSelectDate,
}) {
  return (
    <>
      <CalendarDayHeader />

      <div className="grid grid-cols-7 px-3 pb-4 pt-1">
        {calendarCells.map(
          (date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-14"
                />
              );
            }

            const dateKey =
              formatDateKey(date);

            const dateOccurrences =
              occurrencesByDate.get(
                dateKey,
              ) ?? [];

            const occurrenceCount =
              dateOccurrences.length;

            const hasOccurrence =
              occurrenceCount > 0;

            const isInRange =
              isDateInPlanningRange(
                dateKey,
                planningRange,
              );

            const isSelected =
              dateKey === selectedDateKey;

            const isToday =
              dateKey === todayKey;

            return (
              <div
                key={dateKey}
                className="flex min-h-14 flex-col items-center py-0.5"
              >
                <button
                  type="button"
                  disabled={!isInRange}
                  onClick={() =>
                    onSelectDate(
                      isSelected
                        ? ""
                        : dateKey,
                    )
                  }
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

                {!isSelected &&
                  occurrenceCount > 0 && (
                    <span
                      aria-label={`업무 ${occurrenceCount}개`}
                      className={`mt-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black ${
                        calendarTab ===
                        "mine"
                          ? "bg-[#E63946] text-white"
                          : "bg-[#1A1428] text-white"
                      }`}
                    >
                      {occurrenceCount > 99
                        ? "99+"
                        : occurrenceCount}
                    </span>
                  )}
              </div>
            );
          },
        )}
      </div>
    </>
  );
}

export default CalendarGrid;
