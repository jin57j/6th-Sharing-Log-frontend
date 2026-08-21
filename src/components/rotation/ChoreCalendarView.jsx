import CalendarScopeTabs from "../calendar/CalendarScopeTabs";
import ChoreAssignmentSummary from "./ChoreAssignmentSummary";
import ChoreCalendarHeader from "./ChoreCalendarHeader";
import ChoreCalendarPanel from "./ChoreCalendarPanel";

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
  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-2xl p-5 pb-8 sm:p-8">
        <ChoreCalendarHeader
          selectedChore={selectedChore}
          houseName={houseName}
          onClose={onClose}
        />
        <ChoreAssignmentSummary
          currentOccurrence={currentOccurrence}
          actorMembershipId={actorMembershipId}
        />
        <CalendarScopeTabs
          calendarTab={calendarTab}
          onChange={changeCalendarTab}
          mineLabel="내 일정만"
        />
        <ChoreCalendarPanel
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
          actorMembershipId={actorMembershipId}
          calendarTab={calendarTab}
          todayKey={todayKey}
        />
      </div>
    </div>
  );
}

export default ChoreCalendarView;
