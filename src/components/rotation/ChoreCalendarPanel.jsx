import CalendarMonthHeader from "../calendar/CalendarMonthHeader";
import OccurrenceList from "../calendar/OccurrenceList";
import ChoreCalendarGrid from "./ChoreCalendarGrid";

function ChoreCalendarPanel({
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
  actorMembershipId,
  calendarTab,
  todayKey,
}) {
  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm">
      <CalendarMonthHeader
        year={displayedMonth.year}
        month={displayedMonth.month}
        canMovePrevious={canMovePrevious}
        canMoveNext={canMoveNext}
        onMovePrevious={() => moveMonth(-1)}
        onMoveNext={() => moveMonth(1)}
      />

      {isLoading && (
        <div className="border-t border-[#1A1428]/10 px-5 py-14 text-center">
          <p role="status" className="text-sm font-semibold text-[#8B8575]">
            로테이션 일정을 불러오는 중이에요...
          </p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div
          role="alert"
          className="border-t border-[#E63946]/15 bg-[#E63946]/5 px-5 py-8 text-center"
        >
          <p className="text-sm font-semibold leading-6 text-[#E63946]">
            {errorMessage}
          </p>
        </div>
      )}

      {!isLoading && !errorMessage && (
        <>
          <ChoreCalendarGrid
            calendarCells={calendarCells}
            occurrencesByDate={occurrencesByDate}
            planningRange={planningRange}
            selectedDateKey={selectedDateKey}
            todayKey={todayKey}
            onSelectDate={setSelectedDateKey}
          />

          {selectedDateKey && (
            <OccurrenceList
              selectedDateKey={selectedDateKey}
              selectedOccurrences={selectedOccurrences}
              actorMembershipId={actorMembershipId}
              calendarTab={calendarTab}
            />
          )}
        </>
      )}
    </section>
  );
}

export default ChoreCalendarPanel;
