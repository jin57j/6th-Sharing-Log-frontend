import {
  useMemo,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useOutletContext } from "react-router";

import CalendarDayHeader from "../../components/calendar/CalendarDayHeader";
import OccurrenceList from "../../components/calendar/OccurrenceList";
import useCalendar from "../../hooks/useCalendar";
import useMembers from "../../hooks/useMembers";
import {
  createCalendarCells,
  formatDateKey,
  getOccurrenceDateKey,
  getPlanningLastDate,
  isDateInPlanningRange,
  parseDateKey,
} from "../../utils/calendarUtils";

function Calendar({ embedded = false }) {
  const { activeGroup } =
    useOutletContext();

  const groupId =
    activeGroup?.groupPublicId ?? "";

  const houseName =
    activeGroup?.groupName ??
    "현재 하우스";

  const today = new Date();

  // mine: 내 일정만 표시
  // all: 하우스의 전체 일정 표시
  const [
    calendarTab,
    setCalendarTab,
  ] = useState("mine");

  // 현재 달력에서 보고 있는 연도와 월
  const [
    displayedMonth,
    setDisplayedMonth,
  ] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  // 사용자가 선택한 날짜
  const [
    selectedDateKey,
    setSelectedDateKey,
  ] = useState("");

  // 이번 주부터 4주 후까지 총 5주 일정 조회
  const {
    occurrences,
    planningRange,
    isLoading: isCalendarLoading,
    errorMessage: calendarErrorMessage,
  } = useCalendar(groupId);

  // 현재 사용자의 membershipId 조회
  const {
    actorMembershipId,
    isLoading: isMemberLoading,
    errorMessage: memberErrorMessage,
  } = useMembers(groupId);

  // 선택한 탭에 맞는 업무만 남깁니다.
  const visibleOccurrences =
    useMemo(() => {
      if (calendarTab === "all") {
        return occurrences;
      }

      return occurrences.filter(
        (occurrence) =>
          occurrence.currentAssignee
            ?.membershipId ===
          actorMembershipId,
      );
    }, [
      occurrences,
      calendarTab,
      actorMembershipId,
    ]);

  // 조회한 업무들을 날짜별로 묶습니다.
  // 예: "2026-08-14" → 해당 날짜의 업무 배열
  const occurrencesByDate =
    useMemo(() => {
      const occurrenceMap =
        new Map();

      visibleOccurrences.forEach(
        (occurrence) => {
          const dateKey =
            getOccurrenceDateKey(
              occurrence,
            );

          if (!dateKey) {
            return;
          }

          const dateOccurrences =
            occurrenceMap.get(
              dateKey,
            ) ?? [];

          dateOccurrences.push(
            occurrence,
          );

          occurrenceMap.set(
            dateKey,
            dateOccurrences,
          );
        },
      );

      return occurrenceMap;
    }, [visibleOccurrences]);

  // 현재 표시 중인 달의 날짜 칸을 만듭니다.
  const calendarCells = useMemo(
    () =>
      createCalendarCells(
        displayedMonth.year,
        displayedMonth.month,
      ),
    [
      displayedMonth.year,
      displayedMonth.month,
    ],
  );

  // 사용자가 선택한 날짜에 있는 업무 목록
  const selectedOccurrences =
    selectedDateKey
      ? occurrencesByDate.get(
          selectedDateKey,
        ) ?? []
      : [];

  // 백엔드에서 제공한 5주 일정의 시작일과 마지막 날
  const planningStartDate =
    parseDateKey(
      planningRange?.fromInclusive,
    );

  const planningLastDate =
    getPlanningLastDate(
      planningRange?.toExclusive,
    );

  // 연도와 월을 하나의 숫자로 변환하여
  // 이전 달과 다음 달 이동 가능 여부를 계산합니다.
  const displayedMonthNumber =
    displayedMonth.year * 12 +
    displayedMonth.month;

  const firstPlanningMonthNumber =
    planningStartDate
      ? planningStartDate.getFullYear() *
          12 +
        planningStartDate.getMonth()
      : displayedMonthNumber;

  const lastPlanningMonthNumber =
    planningLastDate
      ? planningLastDate.getFullYear() *
          12 +
        planningLastDate.getMonth()
      : displayedMonthNumber;

  const canMovePrevious =
    displayedMonthNumber >
    firstPlanningMonthNumber;

  const canMoveNext =
    displayedMonthNumber <
    lastPlanningMonthNumber;

  const todayKey =
    formatDateKey(today);

  const isLoading =
    isCalendarLoading ||
    isMemberLoading;

  const errorMessage =
    calendarErrorMessage ||
    memberErrorMessage;

  // 이전 달 또는 다음 달로 이동합니다.
  function moveMonth(amount) {
    const nextDate = new Date(
      displayedMonth.year,
      displayedMonth.month +
        amount,
      1,
    );

    setDisplayedMonth({
      year: nextDate.getFullYear(),
      month: nextDate.getMonth(),
    });

    // 달이 바뀌면 선택한 날짜를 초기화합니다.
    setSelectedDateKey("");
  }

  // 내 일정과 전체 일정 탭을 변경합니다.
  function changeTab(nextTab) {
    setCalendarTab(nextTab);
    setSelectedDateKey("");
  }

  return (
    <div
      id={embedded ? "home-calendar" : undefined}
      className={
        embedded
          ? "mb-12 text-[#1A1428]"
          : "min-h-full text-[#1A1428]"
      }
    >
      <div
        className={
          embedded
            ? ""
            : "mx-auto max-w-2xl p-5 pb-8 sm:p-8"
        }
      >

        {/* 페이지 제목 */}
        <header className="mb-5 flex items-end justify-between">
          <div>
            <h2
              className={`mb-1 flex items-center gap-1.5 font-bold ${
                embedded
                  ? "text-xl"
                  : "text-lg"
              }`}
            >
              달력
            </h2>
            <p className="text-[13px] text-[#888]">
              {houseName}의 업무 일정
            </p>
          </div>
        </header>

        {/* 내 일정만 / 전체 일정 탭 */}
        <div className="mt-5 flex rounded-2xl bg-[#EFEBE2] p-1.5">
          <button
            type="button"
            onClick={() =>
              changeTab("mine")
            }
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
              calendarTab === "mine"
                ? "bg-white text-[#E63946] shadow-sm"
                : "text-[#8B8575]"
            }`}
          >
            내 일정
          </button>

          <button
            type="button"
            onClick={() =>
              changeTab("all")
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

        {/* 달력 카드 */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm">
          {/* 연도, 월 및 이동 버튼 */}
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
                5주 동안의 일정을
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
                {/* 일요일부터 토요일까지 요일 표시 */}
                <CalendarDayHeader />

                {/* 날짜 표시 */}
                <div className="grid grid-cols-7 px-3 pb-4 pt-1">
                  {calendarCells.map(
                    (date, index) => {
                      // 그달 1일 이전의 빈 칸
                      if (!date) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="h-14"
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
                        dateKey ===
                        selectedDateKey;

                      const isToday =
                        dateKey ===
                        todayKey;

                      return (
                        <div
                          key={dateKey}
                          className="flex min-h-14 flex-col items-center py-0.5"
                        >
                          {/* 날짜 버튼 */}
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

                          {/* 해당 날짜의 업무 개수 */}
                          {!isSelected &&
                            occurrenceCount >
                              0 && (
                              <span
                                aria-label={`업무 ${occurrenceCount}개`}
                                className={`mt-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black ${
                                  calendarTab ===
                                  "mine"
                                    ? "bg-[#E63946] text-white"
                                    : "bg-[#1A1428] text-white"
                                }`}
                              >
                                {occurrenceCount >
                                99
                                  ? "99+"
                                  : occurrenceCount}
                              </span>
                            )}
                        </div>
                      );
                    },
                  )}
                </div>

                {/* 선택한 날짜의 업무 목록 */}
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

export default Calendar;
