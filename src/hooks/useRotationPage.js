import { useMemo, useState } from "react";

import useCalendar from "./useCalendar";
import useMembers from "./useMembers";
import useTasks from "./useTasks";
import {
  createCalendarCells,
  formatDateKey,
  getCalendarMonthNavigation,
  groupOccurrencesByDate,
} from "../utils/calendarUtils";
import {
  filterChoreOccurrencesByScope,
  findCurrentOccurrence,
  getChoreOccurrences,
} from "../utils/rotationUtils";

export default function useRotationPage(activeGroup) {
  const groupId = activeGroup?.groupPublicId ?? "";
  const houseName = activeGroup?.groupName ?? "현재 하우스";
  const today = new Date();
  const initialMonth = {
    year: today.getFullYear(),
    month: today.getMonth(),
  };

  const [selectedChore, setSelectedChore] = useState(null);
  const [calendarTab, setCalendarTab] = useState("mine");
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [displayedMonth, setDisplayedMonth] = useState(initialMonth);

  const { chores, isLoading: isTaskLoading } = useTasks(groupId);
  const calendar = useCalendar(groupId);
  const members = useMembers(groupId);

  const selectedChoreOccurrences = useMemo(
    () =>
      getChoreOccurrences(calendar.occurrences, selectedChore?.choreId),
    [calendar.occurrences, selectedChore],
  );
  const visibleOccurrences = useMemo(
    () =>
      filterChoreOccurrencesByScope(
        selectedChoreOccurrences,
        calendarTab,
        members.actorMembershipId,
      ),
    [selectedChoreOccurrences, calendarTab, members.actorMembershipId],
  );
  const occurrencesByDate = useMemo(
    () => groupOccurrencesByDate(visibleOccurrences),
    [visibleOccurrences],
  );
  const calendarCells = useMemo(
    () => createCalendarCells(displayedMonth.year, displayedMonth.month),
    [displayedMonth.year, displayedMonth.month],
  );

  const selectedOccurrences = selectedDateKey
    ? occurrencesByDate.get(selectedDateKey) ?? []
    : [];
  const currentOccurrence = useMemo(
    () => findCurrentOccurrence(selectedChoreOccurrences),
    [selectedChoreOccurrences],
  );
  const { canMovePrevious, canMoveNext } = getCalendarMonthNavigation(
    displayedMonth,
    calendar.planningRange,
  );
  const isLoading =
    isTaskLoading || calendar.isLoading || members.isLoading;
  const errorMessage = calendar.errorMessage || members.errorMessage;

  function openChoreCalendar(chore) {
    setSelectedChore(chore);
    setCalendarTab("mine");
    setSelectedDateKey("");
    setDisplayedMonth(initialMonth);
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

  function changeCalendarTab(tab) {
    setCalendarTab(tab);
    setSelectedDateKey("");
  }

  function closeChoreCalendar() {
    setSelectedChore(null);
    setSelectedDateKey("");
  }

  return {
    overview: {
      houseName,
      chores,
      occurrences: calendar.occurrences,
      isLoading,
      errorMessage,
      onOpenCalendar: openChoreCalendar,
    },
    calendar: selectedChore
      ? {
          selectedChore,
          houseName,
          currentOccurrence,
          actorMembershipId: members.actorMembershipId,
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
          planningRange: calendar.planningRange,
          selectedDateKey,
          setSelectedDateKey,
          selectedOccurrences,
          todayKey: formatDateKey(today),
          onClose: closeChoreCalendar,
        }
      : null,
  };
}
