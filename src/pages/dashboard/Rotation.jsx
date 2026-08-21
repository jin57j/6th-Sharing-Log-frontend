import { useMemo, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { useOutletContext } from "react-router";

import ChoreCalendarView from "../../components/rotation/ChoreCalendarView";
import ChoreCategoryList from "../../components/rotation/ChoreCategoryList";
import useCalendar from "../../hooks/useCalendar";
import useMembers from "../../hooks/useMembers";
import useTasks from "../../hooks/useTasks";
import {
  createCalendarCells,
  formatDateKey,
  getOccurrenceDateKey,
  getPlanningLastDate,
  parseDateKey,
} from "../../utils/calendarUtils";
import {
  findCurrentOccurrence,
  getOccurrenceAssignee,
} from "../../utils/rotationUtils";

function Rotation() {
  const { activeGroup } = useOutletContext();
  const groupId = activeGroup?.groupPublicId ?? "";
  const houseName = activeGroup?.groupName ?? "현재 하우스";
  const today = new Date();

  // 상태 관리
  const [selectedChore, setSelectedChore] = useState(null);
  const [calendarTab, setCalendarTab] = useState("mine");
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [displayedMonth, setDisplayedMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  // 데이터 패칭
  const { chores, isLoading: isTaskLoading } = useTasks(groupId);
  const {
    occurrences,
    planningRange,
    isLoading: isCalendarLoading,
    errorMessage: calendarErrorMessage,
  } = useCalendar(groupId);
  const {
    actorMembershipId,
    isLoading: isMemberLoading,
    errorMessage: memberErrorMessage,
  } = useMembers(groupId);

  const isLoading = isTaskLoading || isCalendarLoading || isMemberLoading;
  const errorMessage = calendarErrorMessage || memberErrorMessage;

  // 파생 데이터 (Memo)
  const selectedChoreOccurrences = useMemo(() => {
    if (!selectedChore) return [];
    return occurrences
      .filter((occ) => occ.choreId === selectedChore.choreId)
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  }, [occurrences, selectedChore]);

  const visibleOccurrences = useMemo(() => {
    if (calendarTab === "all") return selectedChoreOccurrences;
    return selectedChoreOccurrences.filter(
      (occ) => getOccurrenceAssignee(occ)?.membershipId === actorMembershipId,
    );
  }, [selectedChoreOccurrences, calendarTab, actorMembershipId]);

  const occurrencesByDate = useMemo(() => {
    const map = new Map();
    visibleOccurrences.forEach((occ) => {
      const dateKey = getOccurrenceDateKey(occ);
      if (!dateKey) return;
      const list = map.get(dateKey) ?? [];
      list.push(occ);
      map.set(dateKey, list);
    });
    return map;
  }, [visibleOccurrences]);

  const calendarCells = useMemo(
    () => createCalendarCells(displayedMonth.year, displayedMonth.month),
    [displayedMonth.year, displayedMonth.month],
  );

  const selectedOccurrences = selectedDateKey
    ? (occurrencesByDate.get(selectedDateKey) ?? [])
    : [];
  const currentOccurrence = useMemo(
    () => findCurrentOccurrence(selectedChoreOccurrences),
    [selectedChoreOccurrences],
  );
  const planningStartDate = parseDateKey(planningRange?.fromInclusive);
  const planningLastDate = getPlanningLastDate(planningRange?.toExclusive);

  const displayedMonthNumber = displayedMonth.year * 12 + displayedMonth.month;
  const firstPlanningMonthNumber = planningStartDate
    ? planningStartDate.getFullYear() * 12 + planningStartDate.getMonth()
    : displayedMonthNumber;
  const lastPlanningMonthNumber = planningLastDate
    ? planningLastDate.getFullYear() * 12 + planningLastDate.getMonth()
    : displayedMonthNumber;

  const canMovePrevious = displayedMonthNumber > firstPlanningMonthNumber;
  const canMoveNext = displayedMonthNumber < lastPlanningMonthNumber;

  // 이벤트 핸들러
  function openChoreCalendar(chore) {
    setSelectedChore(chore);
    setCalendarTab("mine");
    setSelectedDateKey("");
    setDisplayedMonth({ year: today.getFullYear(), month: today.getMonth() });
  }

  function moveMonth(amount) {
    const nextDate = new Date(
      displayedMonth.year,
      displayedMonth.month + amount,
      1,
    );
    setDisplayedMonth({
      year: nextDate.getFullYear(),
      month: nextDate.getMonth(),
    });
    setSelectedDateKey("");
  }

  // 1. 달력 상세 뷰
  if (selectedChore) {
    return (
      <ChoreCalendarView
        selectedChore={selectedChore}
        houseName={houseName}
        currentOccurrence={currentOccurrence}
        actorMembershipId={actorMembershipId}
        calendarTab={calendarTab}
        changeCalendarTab={(tab) => {
          setCalendarTab(tab);
          setSelectedDateKey("");
        }}
        displayedMonth={displayedMonth}
        moveMonth={moveMonth}
        canMovePrevious={canMovePrevious}
        canMoveNext={canMoveNext}
        isLoading={isLoading}
        errorMessage={errorMessage}
        calendarCells={calendarCells}
        occurrencesByDate={occurrencesByDate}
        planningRange={planningRange}
        selectedDateKey={selectedDateKey}
        setSelectedDateKey={setSelectedDateKey}
        selectedOccurrences={selectedOccurrences}
        todayKey={formatDateKey(today)}
        onClose={() => {
          setSelectedChore(null);
          setSelectedDateKey("");
        }}
      />
    );
  }

  // 2. 메인 로테이션 목록 뷰
  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-2xl p-5 pb-8 sm:p-8">
        <header>
          <p className="text-sm text-[#8B8575]">{houseName}의 당번을 한눈에</p>
          <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
            <RotateCcw size={28} aria-hidden="true" />
            업무 로테이션
          </h1>
        </header>

        <div className="mt-5 rounded-2xl border border-[#06D6A0]/30 bg-[#06D6A0]/10 p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Sparkles size={16} className="text-[#06A77D]" aria-hidden="true" />
            업무를 누르면 담당자 일정을 달력으로 확인할 수 있어요.
          </p>
          <p className="mt-1 pl-6 text-xs leading-5 text-[#8B8575]">
            로테이션은 참여 멤버 순서에 따라 자동으로 배정돼요.
          </p>
        </div>

        {/* 상태별 화면 */}
        {isLoading && (
          <div className="mt-6 rounded-2xl border border-[#1A1428]/10 bg-white px-5 py-12 text-center">
            <p role="status" className="text-sm font-semibold text-[#8B8575]">
              업무 로테이션을 불러오는 중이에요...
            </p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-[#E63946]/20 bg-[#E63946]/5 px-5 py-5"
          >
            <p className="text-sm font-semibold leading-6 text-[#E63946]">
              {errorMessage}
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && chores.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#1A1428]/15 bg-white px-5 py-12 text-center">
            <RotateCcw
              size={34}
              className="mx-auto text-[#8B8575]"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-bold">아직 등록된 업무가 없어요.</p>
            <p className="mt-1 text-xs text-[#8B8575]">
              업무 관리 화면에서 반복 업무를 추가해 주세요.
            </p>
          </div>
        )}

        {/* 업무 목록 렌더링 */}
        {!isLoading && !errorMessage && (
          <ChoreCategoryList
            chores={chores}
            occurrences={occurrences}
            onOpenCalendar={openChoreCalendar}
          />
        )}
      </div>
    </div>
  );
}

export default Rotation;
