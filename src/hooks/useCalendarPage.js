import {
  useMemo,
  useState,
} from "react";

import {
  createCalendarCells,
  filterCalendarOccurrences,
  formatDateKey,
  getCalendarMonthNavigation,
  groupOccurrencesByDate,
} from "../utils/calendarUtils";
import useCalendar from "./useCalendar";
import useMembers from "./useMembers";

function useCalendarPage(activeGroup) {
  const groupId =
    activeGroup?.groupPublicId ?? "";

  const houseName =
    activeGroup?.groupName ??
    "현재 하우스";

  const today = new Date();

  const [
    calendarTab,
    setCalendarTab,
  ] = useState("mine");

  const [
    displayedMonth,
    setDisplayedMonth,
  ] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [
    selectedDateKey,
    setSelectedDateKey,
  ] = useState("");

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

  const visibleOccurrences =
    useMemo(
      () =>
        filterCalendarOccurrences(
          occurrences,
          calendarTab,
          actorMembershipId,
        ),
      [
        occurrences,
        calendarTab,
        actorMembershipId,
      ],
    );

  const occurrencesByDate =
    useMemo(
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
    [
      displayedMonth.year,
      displayedMonth.month,
    ],
  );

  const selectedOccurrences =
    selectedDateKey
      ? occurrencesByDate.get(
          selectedDateKey,
        ) ?? []
      : [];

  const {
    canMovePrevious,
    canMoveNext,
  } = getCalendarMonthNavigation(
    displayedMonth,
    planningRange,
  );

  const isLoading =
    isCalendarLoading ||
    isMemberLoading;

  const errorMessage =
    calendarErrorMessage ||
    memberErrorMessage;

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

    setSelectedDateKey("");
  }

  function changeTab(nextTab) {
    setCalendarTab(nextTab);
    setSelectedDateKey("");
  }

  function selectDate(dateKey) {
    setSelectedDateKey(dateKey);
  }

  return {
    houseName,
    calendarTab,
    changeTab,

    status: {
      isLoading,
      errorMessage,
    },

    month: {
      year: displayedMonth.year,
      month: displayedMonth.month,
      canMovePrevious,
      canMoveNext,
      onMovePrevious: () =>
        moveMonth(-1),
      onMoveNext: () => moveMonth(1),
    },

    grid: {
      calendarCells,
      occurrencesByDate,
      planningRange,
      selectedDateKey,
      todayKey: formatDateKey(today),
      calendarTab,
      onSelectDate: selectDate,
    },

    selectedDate: selectedDateKey
      ? {
          selectedDateKey,
          selectedOccurrences,
          actorMembershipId,
          calendarTab,
        }
      : null,
  };
}

export default useCalendarPage;
