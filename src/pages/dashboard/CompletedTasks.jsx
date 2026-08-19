import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOutletContext } from "react-router";

import CalendarDayHeader from "../../components/calendar/CalendarDayHeader";
import { rotationApi } from "../../api/rotationApi";
import {
  createCalendarCells,
  formatDateKey,
  getOccurrenceDateKey,
} from "../../utils/calendarUtils";
import { getChoreIcon } from "../../utils/choreUtils";

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getWeekRange(today) {
  const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay();
  const start = addDays(today, mondayOffset);
  return { start, end: addDays(start, 6) };
}

function getDatesBetween(start, end) {
  const dates = [];
  for (let date = new Date(start); date <= end; date = addDays(date, 1)) {
    dates.push(formatDateKey(date));
  }
  return dates;
}

function getClosedDateKey(occurrence) {
  if (!occurrence?.closedAt) return "";
  return formatDateKey(new Date(occurrence.closedAt));
}

function CompletionRate({ completedCount, totalCount }) {
  const rate =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <section className="flex flex-col justify-between rounded-3xl border border-[#1A1428]/10 bg-white p-6 sm:p-7 shadow-sm min-h-[400px] sm:min-h-[448px]">
      <h2 className="text-lg font-black">이번 주 완료율</h2>
      <div className="my-auto flex flex-col items-center justify-center py-4">
        <div
          className="grid h-44 w-44 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#91F43F ${rate}%, #EFEBE2 ${rate}% 100%)`,
          }}
          aria-label={`이번 주 완료율 ${rate}%`}
        >
          <div className="grid h-[132px] w-[132px] place-items-center rounded-full bg-white">
            <span className="text-3xl font-black">{rate}%</span>
          </div>
        </div>
        <p className="mt-4 text-base font-bold">
          {completedCount}/{totalCount} 완료
        </p>
        <p className="mt-1 text-xs text-[#8B8575]">
          완료 업무 ÷ 전체 대상 업무
        </p>
      </div>
    </section>
  );
}

function CompletedTasks() {
  const { activeGroup } = useOutletContext();
  const groupId = activeGroup?.groupPublicId;
  const [occurrences, setOccurrences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  useEffect(() => {
    if (!groupId) return undefined;
    let cancelled = false;

    async function loadOccurrences() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const historyStart = addDays(today, -29);
        const week = getWeekRange(today);
        const queryStart =
          historyStart < week.start ? historyStart : week.start;
        const queryEnd = today > week.end ? today : week.end;
        const [completedHistoryResponse, ...responses] = await Promise.all([
          rotationApi.getCompletedHistory(groupId, { mineOnly: true }),
          ...getDatesBetween(queryStart, queryEnd).map((activeOn) =>
            rotationApi.getOccurrences(groupId, { activeOn, mineOnly: true }),
          ),
        ]);
        if (cancelled) return;

        const occurrenceMap = new Map();
        // 완료 이력 API는 본인이 완료한 업무만 반환합니다.
        (completedHistoryResponse.items ?? []).forEach((occurrence) => {
          occurrenceMap.set(occurrence.occurrenceId, occurrence);
        });

        // 일반 회차 API의 mineOnly는 현재 본인에게 배정된 미완료 업무만 반환합니다.
        responses.forEach((response) => {
          (response.items ?? response ?? []).forEach((occurrence) => {
            if (occurrence.status !== "CANCELLED") {
              occurrenceMap.set(occurrence.occurrenceId, occurrence);
            }
          });
        });
        setOccurrences(Array.from(occurrenceMap.values()));
      } catch (error) {
        if (!cancelled) {
          console.error("완료 업무 내역을 불러오지 못했습니다.", error);
          setErrorMessage(
            "완료 업무 내역을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadOccurrences();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const today = new Date();
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const historyStartKey = formatDateKey(addDays(todayAtMidnight, -29));
  const todayKey = formatDateKey(todayAtMidnight);
  const week = getWeekRange(todayAtMidnight);
  const weekStartKey = formatDateKey(week.start);
  const weekEndKey = formatDateKey(week.end);

  const occurrencesByDate = useMemo(() => {
    const grouped = new Map();
    occurrences.forEach((occurrence) => {
      const dateKey = getOccurrenceDateKey(occurrence);
      if (!dateKey || dateKey < historyStartKey || dateKey > todayKey) return;
      const items = grouped.get(dateKey) ?? [];
      items.push(occurrence);
      grouped.set(dateKey, items);
    });
    return grouped;
  }, [historyStartKey, occurrences, todayKey]);

  // 완료 취소는 이번 주에 내가 완료한 업무만 제공합니다.
  const completedTasks = useMemo(
    () =>
      occurrences
        .filter(
          (occurrence) =>
            occurrence.status === "COMPLETED" &&
            getClosedDateKey(occurrence) >= weekStartKey &&
            getClosedDateKey(occurrence) <= weekEndKey,
        )
        .sort(
          (first, second) =>
            new Date(second.closedAt) - new Date(first.closedAt),
        ),
    [occurrences, weekEndKey, weekStartKey],
  );
  const weeklyOccurrences = useMemo(
    () =>
      occurrences.filter((occurrence) => {
        const dateKey = getOccurrenceDateKey(occurrence);
        return (
          dateKey >= weekStartKey &&
          dateKey <= weekEndKey &&
          occurrence.status !== "SKIPPED"
        );
      }),
    [occurrences, weekEndKey, weekStartKey],
  );
  const weeklyCompletedCount = weeklyOccurrences.filter(
    (occurrence) => occurrence.status === "COMPLETED",
  ).length;
  const calendarCells = useMemo(
    () => createCalendarCells(displayedMonth.year, displayedMonth.month),
    [displayedMonth],
  );
  const selectedDay = selectedDateKey
    ? (occurrencesByDate.get(selectedDateKey) ?? [])
    : [];
  const selectedCompletedCount = selectedDay.filter(
    (occurrence) => occurrence.status === "COMPLETED",
  ).length;

  async function handleCancelCompletion(task) {
    if (!window.confirm(`'${task.choreName}' 업무 완료를 취소하시겠습니까?`))
      return;
    try {
      await rotationApi.undoComplete(groupId, task.occurrenceId, task.version);
      setOccurrences((previous) =>
        previous.map((occurrence) =>
          occurrence.occurrenceId === task.occurrenceId
            ? { ...occurrence, status: "ASSIGNED", closedAt: null }
            : occurrence,
        ),
      );
    } catch (error) {
      console.error("완료 취소 실패:", error);
      alert("완료 취소 처리에 실패했습니다.");
    }
  }

  function moveMonth(amount) {
    const date = new Date(
      displayedMonth.year,
      displayedMonth.month + amount,
      1,
    );
    setDisplayedMonth({ year: date.getFullYear(), month: date.getMonth() });
    setSelectedDateKey("");
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 text-[#1A1428] sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 sm:mb-10">
          <h1 className="font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">
            완료 업무
          </h1>
          <p className="mt-2 text-sm text-[#8B8575]">
            완료한 업무와 이번 주 완료율을 확인할 수 있어요.
          </p>
        </header>

        {isLoading ? (
          <p className="py-16 text-center text-sm font-semibold text-[#8B8575]">
            완료 업무 내역을 불러오는 중이에요...
          </p>
        ) : errorMessage ? (
          <p
            role="alert"
            className="rounded-2xl bg-[#E63946]/10 p-5 text-center text-sm font-semibold text-[#E63946]"
          >
            {errorMessage}
          </p>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-10">
            {/* 상단 2개 카드 (grid-cols-1 md:grid-cols-2 로 강제 분리) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              <section className="flex flex-col justify-between min-h-[400px] rounded-3xl border border-[#1A1428]/10 bg-white p-6 sm:p-7 shadow-sm sm:min-h-[448px]">
                <div>
                  <h2 className="border-b border-[#1A1428]/20 pb-4 text-lg font-black">
                    완료 취소
                  </h2>
                  {completedTasks.length === 0 ? (
                    <p className="py-12 text-center text-sm text-[#8B8575]">
                      이번 주에 완료한 업무가 없습니다.
                    </p>
                  ) : (
                    <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                      {completedTasks.map((task) => (
                        <li
                          key={task.occurrenceId}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-[#FCFBF9] p-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={getChoreIcon(task.choreName)}
                              alt=""
                              className="h-10 w-10 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#8B8575] line-through">
                                {task.choreName}
                              </p>
                              <p className="mt-1 text-xs text-[#8B8575]">
                                {task.closedAt
                                  ? new Date(task.closedAt).toLocaleDateString(
                                      "ko-KR",
                                      { month: "short", day: "numeric" },
                                    )
                                  : ""}{" "}
                                완료
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCancelCompletion(task)}
                            className="shrink-0 rounded-xl bg-[#EFEBE2] px-3 py-2 text-xs font-bold transition hover:bg-[#E5DED1]"
                          >
                            완료 취소
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <CompletionRate
                completedCount={weeklyCompletedCount}
                totalCount={weeklyOccurrences.length}
              />
            </div>

            {/* 하단 달력 카드 */}
            <section className="min-h-[440px] overflow-hidden rounded-3xl border border-[#1A1428]/10 bg-white shadow-sm">
              <header className="flex items-center justify-between px-6 py-5">
                <div>
                  <h2 className="text-lg font-black">달력</h2>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-[#6F6A60]">
                    <span className="flex items-center gap-1.5">
                      <i className="h-2.5 w-2.5 rounded-full bg-[#2E9B62]" />
                      모두 완료
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="h-2.5 w-2.5 rounded-full border border-[#63B885] bg-[#DDF3E5]" />
                      일부 완료
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="h-2.5 w-2.5 rounded-full border border-[#D58A62] bg-[#FFF0E8]" />
                      미완료
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveMonth(-1)}
                    aria-label="이전 달"
                    className="rounded-lg p-2 hover:bg-[#EFEBE2]"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <p className="min-w-20 text-center text-sm font-black">
                    {displayedMonth.year}년 {displayedMonth.month + 1}월
                  </p>
                  <button
                    type="button"
                    onClick={() => moveMonth(1)}
                    aria-label="다음 달"
                    className="rounded-lg p-2 hover:bg-[#EFEBE2]"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </header>
              <CalendarDayHeader />
              <div className="grid grid-cols-7 px-3 pb-5 pt-2 sm:px-6">
                {calendarCells.map((date, index) => {
                  if (!date)
                    return (
                      <div key={`empty-${index}`} className="h-14 sm:h-20" />
                    );
                  const dateKey = formatDateKey(date);
                  const items = occurrencesByDate.get(dateKey) ?? [];
                  const completedCount = items.filter(
                    (item) => item.status === "COMPLETED",
                  ).length;
                  const isInHistory =
                    dateKey >= historyStartKey && dateKey <= todayKey;
                  const isSelected = selectedDateKey === dateKey;
                  const statusClass =
                    !isInHistory || items.length === 0
                      ? "text-[#1A1428]"
                      : completedCount === items.length
                        ? "bg-[#2E9B62] text-white ring-2 ring-[#2E9B62]/20"
                        : completedCount > 0
                          ? "border border-[#63B885] bg-[#DDF3E5] text-[#1C6B42]"
                          : "border border-[#D58A62] bg-[#FFF0E8] text-[#A64A24]";
                  return (
                    <div
                      key={dateKey}
                      className="flex h-14 items-center justify-center sm:h-20"
                    >
                      <button
                        type="button"
                        disabled={!isInHistory || items.length === 0}
                        onClick={() =>
                          setSelectedDateKey(isSelected ? "" : dateKey)
                        }
                        className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition sm:h-11 sm:w-11 ${isSelected ? "bg-[#1A1428] text-white" : statusClass}`}
                      >
                        {date.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>
              {selectedDateKey && (
                <div className="border-t border-[#1A1428]/10 bg-[#FCFBF9] px-6 py-4 text-center text-sm font-bold">
                  {selectedDateKey}: {selectedCompletedCount}개 완료
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompletedTasks;
