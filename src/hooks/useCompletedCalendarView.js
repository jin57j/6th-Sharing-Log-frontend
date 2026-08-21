import {
  useMemo,
  useState,
} from "react";

import { createCalendarCells } from "../utils/calendarUtils";
import {
  buildChoreSummaries,
  getLatestOccurrenceDate,
  getMonthNumber,
  groupOccurrencesByDate,
} from "../utils/completedTaskUtils";

function useCompletedCalendarView(
  occurrences,
  today,
) {
  const [viewMode, setViewMode] =
    useState("chores");
  const [
    selectedChoreId,
    setSelectedChoreId,
  ] = useState("");
  const [
    selectedDateKey,
    setSelectedDateKey,
  ] = useState("");
  const [
    displayedMonth,
    setDisplayedMonth,
  ] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const choreSummaries = useMemo(
    () =>
      buildChoreSummaries(
        occurrences,
      ),
    [occurrences],
  );

  const selectedChore = useMemo(
    () =>
      choreSummaries.find(
        (chore) =>
          chore.choreId ===
          selectedChoreId,
      ) ?? null,
    [
      choreSummaries,
      selectedChoreId,
    ],
  );

  const visibleOccurrences = useMemo(
    () =>
      selectedChoreId
        ? occurrences.filter(
            (occurrence) =>
              occurrence.choreId ===
              selectedChoreId,
          )
        : occurrences,
    [
      occurrences,
      selectedChoreId,
    ],
  );

  const occurrencesByDate = useMemo(
    () =>
      groupOccurrencesByDate(
        visibleOccurrences,
      ),
    [visibleOccurrences],
  );

  const calendarCells = useMemo(
    () =>
      createCalendarCells(
        displayedMonth.year,
        displayedMonth.month,
      ),
    [displayedMonth],
  );

  const displayedMonthNumber =
    getMonthNumber(
      displayedMonth.year,
      displayedMonth.month,
    );
  const currentMonthNumber =
    getMonthNumber(
      today.getFullYear(),
      today.getMonth(),
    );

  function resetToCurrentMonth() {
    setSelectedChoreId("");
    setSelectedDateKey("");
    setDisplayedMonth({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
  }

  function showChoreList() {
    setViewMode("chores");
    setSelectedChoreId("");
    setSelectedDateKey("");
  }

  function showAllCalendar() {
    setViewMode("calendar");
    resetToCurrentMonth();
  }

  function openChoreCalendar(chore) {
    const latestDate =
      getLatestOccurrenceDate(
        chore.occurrences,
      );

    setSelectedChoreId(
      chore.choreId,
    );
    setSelectedDateKey("");
    setDisplayedMonth({
      year: latestDate.getFullYear(),
      month: latestDate.getMonth(),
    });
    setViewMode("calendar");
  }

  function moveMonth(amount) {
    const nextMonth = new Date(
      displayedMonth.year,
      displayedMonth.month + amount,
      1,
    );

    setDisplayedMonth({
      year: nextMonth.getFullYear(),
      month: nextMonth.getMonth(),
    });
    setSelectedDateKey("");
  }

  return {
    resetToCurrentMonth,
    view: {
      viewMode,
      showChoreList,
      showAllCalendar,
    },
    choreList: {
      choreSummaries,
      openChoreCalendar,
    },
    calendar: {
      selectedChore,
      showChoreList,
      displayedMonth,
      moveMonth,
      canMoveNext:
        displayedMonthNumber <
        currentMonthNumber,
      calendarCells,
      occurrencesByDate,
      today,
      selectedDateKey,
      setSelectedDateKey,
      selectedOccurrences:
        selectedDateKey
          ? occurrencesByDate.get(
              selectedDateKey,
            ) ?? []
          : [],
    },
  };
}

export default useCompletedCalendarView;
