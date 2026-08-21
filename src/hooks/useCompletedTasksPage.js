import {
  useMemo,
  useState,
} from "react";

import {
  getCompletedSummary,
  getTodayCompletedOccurrences,
} from "../utils/completedTaskUtils";
import useCompletedCalendarView from "./useCompletedCalendarView";
import useCompletedHistory from "./useCompletedHistory";
import useCompletedOccurrenceActions from "./useCompletedOccurrenceActions";
import useWeeklyCompletionRate from "./useWeeklyCompletionRate";

function useCompletedTasksPage(
  activeGroup,
) {
  const groupId =
    activeGroup?.groupPublicId ?? "";
  const membershipId =
    activeGroup?.membershipPublicId ??
    "";
  const houseName =
    activeGroup?.groupName ??
    "현재 하우스";

  const [today] = useState(
    () => new Date(),
  );
  const [scope, setScope] =
    useState("mine");

  const {
    occurrences,
    isLoading,
    errorMessage,
    reload: reloadHistory,
  } = useCompletedHistory(
    groupId,
    scope === "mine",
  );

  const weeklyRate =
    useWeeklyCompletionRate(
      groupId,
      membershipId,
    );

  const calendarView =
    useCompletedCalendarView(
      occurrences,
      today,
    );

  function reloadData() {
    reloadHistory();
    weeklyRate.reload();
  }

  const actions =
    useCompletedOccurrenceActions({
      groupId,
      onReload: reloadData,
    });

  const summary = useMemo(
    () =>
      getCompletedSummary(
        occurrences,
      ),
    [occurrences],
  );

  const todayCompletedOccurrences =
    useMemo(
      () =>
        getTodayCompletedOccurrences(
          occurrences,
          membershipId,
          today,
        ),
      [
        membershipId,
        occurrences,
        today,
      ],
    );

  function changeScope(nextScope) {
    setScope(nextScope);
    calendarView.resetToCurrentMonth();
  }

  return {
    houseName,
    scope,
    changeScope,
    history: {
      isLoading,
      errorMessage,
    },
    weeklyRate,
    todayCompleted: {
      occurrences:
        todayCompletedOccurrences,
      processingOccurrenceId:
        actions.processingOccurrenceId,
      onUndoComplete:
        actions.handleUndoComplete,
    },
    summary,
    view: calendarView.view,
    choreList:
      calendarView.choreList,
    calendar: {
      ...calendarView.calendar,
      scope,
      processingOccurrenceId:
        actions.processingOccurrenceId,
      handleComplete:
        actions.handleComplete,
      handleUndoComplete:
        actions.handleUndoComplete,
    },
  };
}

export default useCompletedTasksPage;
