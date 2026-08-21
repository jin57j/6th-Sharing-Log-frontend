import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarDayHeader from "../calendar/CalendarDayHeader";
import OccurrenceRecord from "./OccurrenceRecord";
import { formatDateKey } from "../../utils/calendarUtils";

export default function CompletedCalendarView({
  selectedChore,
  scope,
  showChoreList,
  displayedMonth,
  moveMonth,
  canMoveNext,
  calendarCells,
  occurrencesByDate,
  today,
  selectedDateKey,
  setSelectedDateKey,
  selectedOccurrences,
  processingOccurrenceId,
  handleComplete,
  handleUndoComplete,
}) {
  return (
    <div className="mt-6">
      {selectedChore && (
        <button
          type="button"
          onClick={showChoreList}
          className="mb-4 flex items-center gap-2 text-sm font-bold text-[#8B8575] transition hover:text-[#1A1428]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          업무 목록으로
        </button>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm">
        <header className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-black">
              {selectedChore
                ? selectedChore.name
                : scope === "mine"
                  ? "내 전체 기록"
                  : "하우스 전체 기록"}
            </p>
            <p className="mt-1 text-xs text-[#8B8575]">
              날짜의 숫자는 해당 날짜의 업무 개수예요.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="이전 달"
              className="rounded-lg p-2 transition hover:bg-[#EFEBE2]"
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>

            <p className="min-w-24 text-center text-sm font-black">
              {displayedMonth.year}년 {displayedMonth.month + 1}월
            </p>

            <button
              type="button"
              onClick={() => moveMonth(1)}
              disabled={!canMoveNext}
              aria-label="다음 달"
              className="rounded-lg p-2 transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </header>

        <CalendarDayHeader />

        <div className="grid grid-cols-7 px-3 pb-4 pt-1 sm:px-5">
          {calendarCells.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-14 sm:h-16" />;
            }

            const dateKey = formatDateKey(date);
            const dateOccurrences = occurrencesByDate.get(dateKey) ?? [];
            const completedOnDate = dateOccurrences.filter(
              (occ) => occ.status === "COMPLETED",
            ).length;
            const overdueOnDate = dateOccurrences.filter(
              (occ) => occ.status === "ASSIGNED",
            ).length;
            const hasOccurrences = dateOccurrences.length > 0;
            const isSelected = selectedDateKey === dateKey;
            const isToday = dateKey === formatDateKey(today);

            let dateStyle = "text-[#8B8575] hover:bg-[#EFEBE2]";
            if (hasOccurrences && overdueOnDate > 0) {
              dateStyle = "bg-[#FFF0E8] text-[#A64A24]";
            } else if (hasOccurrences && completedOnDate === dateOccurrences.length) {
              dateStyle = "bg-[#DDF3E5] text-[#1C6B42]";
            } else if (isToday) {
              dateStyle = "text-[#E63946] hover:bg-[#EFEBE2]";
            }

            if (isSelected) {
              dateStyle = "bg-[#1A1428] text-white";
            }

            return (
              <div key={dateKey} className="flex h-14 items-center justify-center sm:h-16">
                <button
                  type="button"
                  disabled={!hasOccurrences}
                  onClick={() => setSelectedDateKey(isSelected ? "" : dateKey)}
                  className={`relative grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition ${dateStyle} ${
                    isToday ? "!text-[#E63946]" : ""
                  } disabled:cursor-default`}
                >
                  {date.getDate()}
                  {hasOccurrences && (
                    <span
                      className={`absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-black ${
                        isSelected
                          ? "bg-[#E63946] text-white"
                          : "bg-[#1A1428] text-white"
                      }`}
                    >
                      {dateOccurrences.length}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {!selectedDateKey && (
          <div className="border-t border-[#1A1428]/10 bg-[#FCFBF9] px-5 py-4 text-center">
            <p className="text-xs font-semibold text-[#8B8575]">
              기록이 있는 날짜를 선택하면 상세 내용을 볼 수 있어요.
            </p>
          </div>
        )}

        {selectedDateKey && (
          <div className="border-t border-[#1A1428]/10 bg-[#FCFBF9] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black">{selectedDateKey}</h3>
              <span className="text-xs font-bold text-[#8B8575]">
                {selectedOccurrences.length}건
              </span>
            </div>

            {selectedOccurrences.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#8B8575]">
                이 날짜에는 업무 기록이 없어요.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedOccurrences.map((occurrence) => (
                  <OccurrenceRecord
                    key={occurrence.occurrenceId}
                    occurrence={occurrence}
                    isProcessing={processingOccurrenceId === occurrence.occurrenceId}
                    onComplete={handleComplete}
                    onUndoComplete={handleUndoComplete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
