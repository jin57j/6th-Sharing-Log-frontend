import { WEEKDAY_LABELS } from "../constants/rotation";

// 현재 담당자가 없으면 마지막 담당자를 반환합니다.
export function getOccurrenceAssignee(occurrence) {
  return (
    occurrence?.currentAssignee ??
    occurrence?.lastAssignee ??
    null
  );
}

// 업무 설정에 저장된 마감 시간을 HH:mm 형식으로 표시합니다.
export function formatScheduleTime(dueTime) {
  if (!dueTime) return "시간 미정";
  return dueTime.slice(0, 5);
}

// 업무의 반복 주기와 마감 정보를 만듭니다.
export function formatChoreSchedule(chore) {
  const schedule = chore?.schedule;
  if (!schedule) return "일정 미정";

  const dueTime = formatScheduleTime(schedule.dueTime);

  if (schedule.frequency === "DAILY") return `매일 ${dueTime}`;
  if (schedule.frequency === "WEEKLY") {
    const weekday = WEEKDAY_LABELS[schedule.weeklyDueDay] ?? "요일 미정";
    return `매주 ${weekday} ${dueTime}`;
  }
  if (schedule.frequency === "BIWEEKLY") return `격주 ${dueTime}`;

  return `마감 ${dueTime}`;
}

// 발생 업무의 마감 날짜와 시간을 표시합니다.
export function formatOccurrenceDateTime(occurrence) {
  if (!occurrence?.dueAt) return "마감 미정";

  const dueDate = new Date(occurrence.dueAt);
  if (Number.isNaN(dueDate.getTime())) return "마감 미정";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: occurrence.timeZoneIdSnapshot || "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dueDate);
}

// 현재 또는 가장 가까운 발생 업무를 찾습니다.
export function findCurrentOccurrence(occurrences) {
  const sortedOccurrences = [...occurrences].sort(
    (first, second) => new Date(first.dueAt) - new Date(second.dueAt)
  );

  const assignedOccurrence = sortedOccurrences.find(
    (occurrence) => occurrence.status === "ASSIGNED"
  );

  return assignedOccurrence ?? sortedOccurrences[0] ?? null;
}

// 선택한 업무의 회차를 마감 시간순으로 반환합니다.
export function getChoreOccurrences(occurrences, choreId) {
  if (!choreId) {
    return [];
  }

  return occurrences
    .filter((occurrence) => occurrence.choreId === choreId)
    .sort(
      (first, second) =>
        new Date(first.dueAt) - new Date(second.dueAt),
    );
}

// 선택한 달력 범위에 맞는 업무 회차만 반환합니다.
export function filterChoreOccurrencesByScope(
  occurrences,
  calendarTab,
  actorMembershipId,
) {
  if (calendarTab === "all") {
    return occurrences;
  }

  return occurrences.filter(
    (occurrence) =>
      getOccurrenceAssignee(occurrence)?.membershipId === actorMembershipId,
  );
}

// 주차별 담당자 로테이션 계산 함수
export const getAssignee = (task, weekIndex) => {
  // 실제 데이터 구조인 eligibility.members 배열을 참조하도록 변경
  const members = task.eligibility?.members;

  // 방어 코드
  if (!members || members.length === 0) {
    return null;
  }

  const totalMembers = members.length;
  const targetIndex = weekIndex % totalMembers;

  return members[targetIndex];
};
