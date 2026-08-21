export function hasAction(occurrence, actionName) {
  return (
    Array.isArray(occurrence?.availableActions) &&
    occurrence.availableActions.includes(actionName)
  );
}

export function isSubstituteCompletion(occurrence) {
  const originalMembershipId = occurrence?.originalAssignee?.membershipId;
  const completedMembershipId = occurrence?.completedBy?.membershipId;

  return Boolean(
    originalMembershipId &&
      completedMembershipId &&
      originalMembershipId !== completedMembershipId,
  );
}

export function getMonthNumber(year, month) {
  return year * 12 + month;
}

export function getCompletedSummary(
  occurrences,
) {
  return {
    completedCount: occurrences.filter(
      (occurrence) =>
        occurrence.status ===
        "COMPLETED",
    ).length,
    overdueCount: occurrences.filter(
      (occurrence) =>
        occurrence.status ===
        "ASSIGNED",
    ).length,
    substituteCount: occurrences.filter(
      isSubstituteCompletion,
    ).length,
  };
}

export function groupOccurrencesByDate(
  occurrences,
) {
  const grouped = new Map();

  occurrences.forEach((occurrence) => {
    const dateKey =
      getOccurrenceDateKey(occurrence);

    if (!dateKey) {
      return;
    }

    const dateOccurrences =
      grouped.get(dateKey) ?? [];

    dateOccurrences.push(occurrence);
    grouped.set(
      dateKey,
      dateOccurrences,
    );
  });

  grouped.forEach(
    (dateOccurrences) => {
      dateOccurrences.sort(
        (first, second) =>
          new Date(first.dueAt) -
          new Date(second.dueAt),
      );
    },
  );

  return grouped;
}

export function getTodayCompletedOccurrences(
  occurrences,
  membershipId,
  today,
) {
  const todayDateKey =
    formatDateKey(today);

  return occurrences
    .filter((occurrence) => {
      if (
        occurrence.status !==
          "COMPLETED" ||
        occurrence.completedBy
          ?.membershipId !== membershipId ||
        !hasAction(
          occurrence,
          "UNDO_COMPLETE",
        ) ||
        !occurrence.closedAt
      ) {
        return false;
      }

      const closedDate = new Date(
        occurrence.closedAt,
      );
      const occurrenceDateKey =
        getOccurrenceDateKey(
          occurrence,
        );

      return (
        !Number.isNaN(
          closedDate.getTime(),
        ) &&
        formatDateKey(closedDate) ===
          todayDateKey &&
        occurrenceDateKey ===
          todayDateKey
      );
    })
    .sort(
      (first, second) =>
        new Date(second.closedAt) -
        new Date(first.closedAt),
    );
}

export function getLatestOccurrenceDate(occurrences) {
  const validDates = occurrences
    .map((occurrence) => new Date(occurrence.dueAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((firstDate, secondDate) => secondDate - firstDate);

  return validDates[0] ?? new Date();
}

export function buildChoreSummaries(occurrences) {
  const choreMap = new Map();

  occurrences.forEach((occurrence) => {
    const choreId = occurrence.choreId;

    if (!choreId) {
      return;
    }

    const current = choreMap.get(choreId) ?? {
      choreId,
      name: occurrence.choreName ?? "이름 없는 업무",
      frequency: occurrence.frequency ?? "UNKNOWN",
      occurrences: [],
    };

    current.occurrences.push(occurrence);

    choreMap.set(choreId, current);
  });

  return Array.from(choreMap.values())
    .map((chore) => {
      const completedCount = chore.occurrences.filter(
        (occurrence) => occurrence.status === "COMPLETED",
      ).length;

      const overdueCount = chore.occurrences.filter(
        (occurrence) => occurrence.status === "ASSIGNED",
      ).length;

      const substituteCount = chore.occurrences.filter(
        isSubstituteCompletion,
      ).length;

      return {
        ...chore,
        completedCount,
        overdueCount,
        substituteCount,
      };
    })
    .sort((first, second) => first.name.localeCompare(second.name, "ko"));
}
import {
  formatDateKey,
  getOccurrenceDateKey,
} from "./calendarUtils";
