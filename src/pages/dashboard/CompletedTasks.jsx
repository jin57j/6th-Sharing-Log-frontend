import { useOutletContext } from "react-router";

import CompletedHistoryContent from "../../components/completed/CompletedHistoryContent";
import CompletedHistoryStatus from "../../components/completed/CompletedHistoryStatus";
import CompletedScopeTabs from "../../components/completed/CompletedScopeTabs";
import CompletedTasksHeader from "../../components/completed/CompletedTasksHeader";
import TodayCompletedTasks from "../../components/completed/TodayCompletedTasks";
import WeeklyCompletionRate from "../../components/completed/WeeklyCompletionRate";
import useCompletedTasksPage from "../../hooks/useCompletedTasksPage";

function CompletedTasks() {
  const { activeGroup } =
    useOutletContext();

  const page = useCompletedTasksPage(
    activeGroup,
  );

  const hasHistoryError = Boolean(
    page.history.errorMessage,
  );

  const canShowHistory =
    !page.history.isLoading &&
    !hasHistoryError;

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-3xl p-5 pb-10 sm:p-8">
        <CompletedTasksHeader
          houseName={page.houseName}
        />

        <WeeklyCompletionRate
          completedCount={
            page.weeklyRate
              .completedCount
          }
          totalCount={
            page.weeklyRate.totalCount
          }
          isLoading={
            page.weeklyRate.isLoading
          }
          errorMessage={
            page.weeklyRate
              .errorMessage
          }
        />

        {canShowHistory && (
          <TodayCompletedTasks
            {...page.todayCompleted}
          />
        )}

        <CompletedScopeTabs
          scope={page.scope}
          onChange={page.changeScope}
        />

        <CompletedHistoryStatus
          {...page.history}
        />

        {canShowHistory && (
          <CompletedHistoryContent
            summary={page.summary}
            view={page.view}
            choreList={page.choreList}
            calendar={page.calendar}
          />
        )}
      </div>
    </div>
  );
}

export default CompletedTasks;
