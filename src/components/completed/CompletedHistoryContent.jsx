import CompletedCalendarView from "./CompletedCalendarView";
import CompletedChoreList from "./CompletedChoreList";
import CompletedSummaryCards from "./CompletedSummaryCards";
import CompletedViewTabs from "./CompletedViewTabs";

export default function CompletedHistoryContent({
  summary,
  view,
  choreList,
  calendar,
}) {
  return (
    <>
      <CompletedSummaryCards
        {...summary}
      />

      <CompletedViewTabs
        viewMode={view.viewMode}
        hasSelectedChore={Boolean(
          calendar.selectedChore,
        )}
        onShowChores={view.showChoreList}
        onShowCalendar={
          view.showAllCalendar
        }
      />

      {view.viewMode === "chores" && (
        <CompletedChoreList
          choreSummaries={
            choreList.choreSummaries
          }
          onOpenCalendar={
            choreList.openChoreCalendar
          }
        />
      )}

      {view.viewMode === "calendar" && (
        <CompletedCalendarView
          {...calendar}
        />
      )}
    </>
  );
}
