export const CALENDAR_DAY_LABELS = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
];

// 월간 달력에 표시할 날짜 칸을 만듭니다.
export function createCalendarCells(
  year,
  month,
) {
  const firstDate = new Date(
    year,
    month,
    1,
  );

  const lastDate = new Date(
    year,
    month + 1,
    0,
  );

  const cells = [];

  // 그달 1일 이전의 빈 칸을 추가합니다.
  for (
    let index = 0;
    index < firstDate.getDay();
    index += 1
  ) {
    cells.push(null);
  }

  for (
    let day = 1;
    day <= lastDate.getDate();
    day += 1
  ) {
    cells.push(
      new Date(year, month, day),
    );
  }

  return cells;
}

// Date 객체를 YYYY-MM-DD 형식으로 변환합니다.
export function formatDateKey(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD 문자열을 로컬 Date 객체로 변환합니다.
export function parseDateKey(dateKey) {
  if (!dateKey) {
    return null;
  }

  const [year, month, day] =
    dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
  );
}

// 백엔드 dueAt 시간을 해당 업무의 타임존 날짜로 변환합니다.
export function getOccurrenceDateKey(
  occurrence,
) {
  if (!occurrence?.dueAt) {
    return "";
  }

  const dueDate = new Date(
    occurrence.dueAt,
  );

  if (
    Number.isNaN(dueDate.getTime())
  ) {
    return "";
  }

  const timeZone =
    occurrence.timeZoneIdSnapshot ||
    "Asia/Seoul";

  const parts =
    new Intl.DateTimeFormat(
      "ko-KR",
      {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    ).formatToParts(dueDate);

  const dateParts = {};

  parts.forEach((part) => {
    if (
      part.type === "year" ||
      part.type === "month" ||
      part.type === "day"
    ) {
      dateParts[part.type] =
        part.value;
    }
  });

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

// 날짜가 백엔드의 5주 계획 범위 안에 있는지 확인합니다.
export function isDateInPlanningRange(
  dateKey,
  range,
) {
  if (
    !dateKey ||
    !range?.fromInclusive ||
    !range?.toExclusive
  ) {
    return false;
  }

  return (
    dateKey >= range.fromInclusive &&
    dateKey < range.toExclusive
  );
}

// 종료일은 미포함이므로 하루를 빼서 실제 마지막 날짜를 구합니다.
export function getPlanningLastDate(
  toExclusive,
) {
  const exclusiveDate =
    parseDateKey(toExclusive);

  if (!exclusiveDate) {
    return null;
  }

  exclusiveDate.setDate(
    exclusiveDate.getDate() - 1,
  );

  return exclusiveDate;
}

// 선택한 일정 범위에 맞는 업무만 남깁니다.
export function filterCalendarOccurrences(
  occurrences,
  calendarTab,
  actorMembershipId,
) {
  if (calendarTab === "all") {
    return occurrences;
  }

  return occurrences.filter(
    (occurrence) =>
      occurrence.currentAssignee
        ?.membershipId ===
      actorMembershipId,
  );
}

// 업무를 마감 날짜별로 묶어 달력에서 빠르게 조회할 수 있게 합니다.
export function groupOccurrencesByDate(
  occurrences,
) {
  const occurrenceMap = new Map();

  occurrences.forEach(
    (occurrence) => {
      const dateKey =
        getOccurrenceDateKey(
          occurrence,
        );

      if (!dateKey) {
        return;
      }

      const dateOccurrences =
        occurrenceMap.get(dateKey) ??
        [];

      dateOccurrences.push(occurrence);
      occurrenceMap.set(
        dateKey,
        dateOccurrences,
      );
    },
  );

  return occurrenceMap;
}

// 백엔드가 제공한 일정 범위를 기준으로 월 이동 가능 여부를 계산합니다.
export function getCalendarMonthNavigation(
  displayedMonth,
  planningRange,
) {
  const planningStartDate =
    parseDateKey(
      planningRange?.fromInclusive,
    );

  const planningLastDate =
    getPlanningLastDate(
      planningRange?.toExclusive,
    );

  const displayedMonthNumber =
    displayedMonth.year * 12 +
    displayedMonth.month;

  const firstPlanningMonthNumber =
    planningStartDate
      ? planningStartDate.getFullYear() *
          12 +
        planningStartDate.getMonth()
      : displayedMonthNumber;

  const lastPlanningMonthNumber =
    planningLastDate
      ? planningLastDate.getFullYear() *
          12 +
        planningLastDate.getMonth()
      : displayedMonthNumber;

  return {
    canMovePrevious:
      displayedMonthNumber >
      firstPlanningMonthNumber,

    canMoveNext:
      displayedMonthNumber <
      lastPlanningMonthNumber,
  };
}
