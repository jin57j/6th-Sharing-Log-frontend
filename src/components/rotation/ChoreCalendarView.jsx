import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  formatDateKey,
  isDateInPlanningRange,
} from "../../utils/calendarUtils";
import {
  formatChoreSchedule,
  formatOccurrenceDateTime,
  getOccurrenceAssignee,
} from "../../utils/rotationUtils";
import CalendarDayHeader from "../calendar/CalendarDayHeader";
import OccurrenceList from "../calendar/OccurrenceList";
import MemberAvatar from "../member/MemberAvatar";

function ChoreCalendarView({
  selectedChore,
  houseName,
  currentOccurrence,
  actorMembershipId,
  calendarTab,
  changeCalendarTab,
  displayedMonth,
  moveMonth,
  canMovePrevious,
  canMoveNext,
  isLoading,
  errorMessage,
  calendarCells,
  occurrencesByDate,
  planningRange,
  selectedDateKey,
  setSelectedDateKey,
  selectedOccurrences,
  todayKey,
  onClose,
}) {
  const currentAssignee =
    getOccurrenceAssignee(
      currentOccurrence,
    );

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-2xl p-5 pb-8 sm:p-8">
        {/* 업무 목록으로 돌아가기 */}
        <button
          type="button"
          onClick={onClose}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[#8B8575] transition hover:text-[#1A1428]"
        >
          <ChevronLeft
            size={16}
            aria-hidden="true"
          />
          업무 목록으로
        </button>

        {/* 선택한 업무 정보 */}
        <header>
          <p className="text-sm text-[#8B8575]">
            {houseName}의 로테이션
          </p>

          <h1 className="mt-1 font-display text-[28px] font-black tracking-[-0.03em]">
            {selectedChore.name}
          </h1>

          <p className="mt-1 text-sm text-[#8B8575]">
            {formatChoreSchedule(
              selectedChore,
            )}{" "}
            · 로테이션
          </p>
        </header>

        {/* 다음 마감과 현재 담당자 */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-4">
            <p className="text-[11px] font-bold text-[#8B8575]">
              다음 마감
            </p>

            <p className="mt-1.5 text-sm font-black text-[#E63946] sm:text-base">
              {formatOccurrenceDateTime(
                currentOccurrence,
              )}
            </p>
          </section>

          <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-4">
            <p className="text-[11px] font-bold text-[#8B8575]">
              현재 담당자
            </p>

            {currentAssignee ? (
              <div className="mt-1.5 flex min-w-0 items-center gap-2">
                <MemberAvatar
                  name={
                    currentAssignee.displayName
                  }
                  memberId={
                    currentAssignee.membershipId
                  }
                  size="sm"
                />

                <p className="truncate text-sm font-bold">
                  {
                    currentAssignee.displayName
                  }

                  {currentAssignee.membershipId ===
                  actorMembershipId
                    ? " (나)"
                    : ""}
                </p>
              </div>
            ) : (
              <p className="mt-1.5 text-sm font-semibold text-[#8B8575]">
                담당자 미정
              </p>
            )}
          </section>
        </div>

        {/* 내 일정만 / 전체 일정 */}
        <div className="mt-5 flex rounded-2xl bg-[#EFEBE2] p-1.5">
          <button
            type="button"
            onClick={() =>
              changeCalendarTab(
                "mine",
              )
            }
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
              calendarTab === "mine"
                ? "bg-white text-[#E63946] shadow-sm"
                : "text-[#8B8575]"
            }`}
          >
            내 일정만 보기
          </button>

          <button
            type="button"
            onClick={() =>
              changeCalendarTab(
                "all",
              )
            }
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
              calendarTab === "all"
                ? "bg-white text-[#E63946] shadow-sm"
                : "text-[#8B8575]"
            }`}
          >
            전체 일정
          </button>
        </div>

        {/* 선택한 업무의 달력 */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm">
          {/* 현재 연도와 월 */}
          <header className="flex items-center justify-between px-5 py-4">
            <p className="font-display text-base font-black">
              {displayedMonth.year}년{" "}
              {displayedMonth.month + 1}
              월
            </p>

            <div className="flex gap-0.5">
              <button
                type="button"
                onClick={() =>
                  moveMonth(-1)
                }
                disabled={
                  !canMovePrevious
                }
                aria-label="이전 달"
                className="rounded-lg p-2 transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ChevronLeft
                  size={16}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  moveMonth(1)
                }
                disabled={!canMoveNext}
                aria-label="다음 달"
                className="rounded-lg p-2 transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ChevronRight
                  size={16}
                  aria-hidden="true"
                />
              </button>
            </div>
          </header>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="border-t border-[#1A1428]/10 px-5 py-14 text-center">
              <p
                role="status"
                className="text-sm font-semibold text-[#8B8575]"
              >
                로테이션 일정을
                불러오는 중이에요...
              </p>
            </div>
          )}

          {/* 오류 상태 */}
          {!isLoading &&
            errorMessage && (
              <div
                role="alert"
                className="border-t border-[#E63946]/15 bg-[#E63946]/5 px-5 py-8 text-center"
              >
                <p className="text-sm font-semibold leading-6 text-[#E63946]">
                  {errorMessage}
                </p>
              </div>
            )}

          {/* 달력 내용 */}
          {!isLoading &&
            !errorMessage && (
              <>
                <CalendarDayHeader />

                <div className="grid grid-cols-7 px-3 pb-4 pt-1">
                  {calendarCells.map(
                    (date, index) => {
                      if (!date) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="h-11"
                          />
                        );
                      }

                      const dateKey =
                        formatDateKey(
                          date,
                        );

                      const dateOccurrences =
                        occurrencesByDate.get(
                          dateKey,
                        ) ?? [];

                      const hasOccurrence =
                        dateOccurrences.length >
                        0;

                      const isInRange =
                        isDateInPlanningRange(
                          dateKey,
                          planningRange,
                        );

                      const isSelected =
                        dateKey ===
                        selectedDateKey;

                      const isToday =
                        dateKey ===
                        todayKey;

                      return (
                        <div
                          key={dateKey}
                          className="flex min-h-11 items-center justify-center py-0.5"
                        >
                          <button
                            type="button"
                            disabled={
                              !isInRange
                            }
                            onClick={() => {
                              setSelectedDateKey(
                                isSelected
                                  ? ""
                                  : dateKey,
                              );
                            }}
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
                    },
                  )}
                </div>

                {/* 선택한 날짜의 담당 정보 */}
                {selectedDateKey && (
                  <OccurrenceList
                    selectedDateKey={
                      selectedDateKey
                    }
                    selectedOccurrences={
                      selectedOccurrences
                    }
                    actorMembershipId={
                      actorMembershipId
                    }
                    calendarTab={
                      calendarTab
                    }
                  />
                )}
              </>
            )}
        </section>
      </div>
    </div>
  );
}

export default ChoreCalendarView;
