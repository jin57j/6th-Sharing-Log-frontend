// 현재 시각으로부터 몇 시간 뒤의 시간을 만들어 주는 함수
function getHoursLater(hours) {
  const date = new Date();

  date.setHours(date.getHours() + hours);

  return date.toISOString();
}

// 마감 임박 업무 Mock 데이터
export const mockNotificationOccurrences = [
  {
    occurrenceId: "occurrence-1",
    choreId: "chore-1",
    choreName: "장보기",
    frequency: "WEEKLY",
    periodStart: "2026-08-02",
    periodEndExclusive: "2026-08-09",
    timeZoneIdSnapshot: "Asia/Seoul",

    // 지금부터 7시간 뒤 마감
    dueAt: getHoursLater(7),

    status: "ASSIGNED",

    currentAssignee: {
      membershipId: "member-1",
      displayName: "김지수",
      avatarUrl: null,
      status: "ACTIVE",
    },

    lastAssignee: null,
    attention: null,
    availableActions: ["COMPLETE", "REQUEST_SUBSTITUTE"],
    closedAt: null,
    version: 1,
  },
  {
    occurrenceId: "occurrence-2",
    choreId: "chore-2",
    choreName: "거실 청소",
    frequency: "WEEKLY",
    periodStart: "2026-08-02",
    periodEndExclusive: "2026-08-09",
    timeZoneIdSnapshot: "Asia/Seoul",

    // 지금부터 6일 3시간 뒤 마감
    dueAt: getHoursLater(24 * 6 + 3),

    status: "ASSIGNED",

    currentAssignee: {
      membershipId: "member-1",
      displayName: "김지수",
      avatarUrl: null,
      status: "ACTIVE",
    },

    lastAssignee: null,
    attention: null,
    availableActions: ["COMPLETE", "REQUEST_SUBSTITUTE"],
    closedAt: null,
    version: 1,
  },
];

// 대타 요청 Mock 데이터
export const mockSubstituteRequests = [
  {
    requestId: "substitute-request-1",
    status: "PENDING",
    reason: "이번 주말에 본가에 내려가야 해요.",

    requester: {
      membershipId: "member-2",
      displayName: "이서준",
      avatarUrl: null,
      status: "ACTIVE",
    },

    acceptedBy: null,
    choreId: "chore-3",
    choreName: "분리수거",
    periodStart: "2026-08-02",
    periodEndExclusive: "2026-08-09",
    dueAt: getHoursLater(26),

    occurrence: {
      occurrenceId: "occurrence-3",
      status: "ASSIGNED",
      version: 1,
    },

    recipients: [
      {
        member: {
          membershipId: "member-1",
          displayName: "김지수",
          avatarUrl: null,
          status: "ACTIVE",
        },
        status: "PENDING",
        respondedAt: null,
      },
    ],

    createdAt: new Date().toISOString(),
    lastResponseAt: null,
    resolvedAt: null,
    version: 1,

    // MSW 내부에서만 사용하는 값
    responded: false,
  },
  {
    requestId: "substitute-request-2",
    status: "PENDING",
    reason: "시험 일정과 겹쳐서 대타가 필요해요.",

    requester: {
      membershipId: "member-3",
      displayName: "박민서",
      avatarUrl: null,
      status: "ACTIVE",
    },

    acceptedBy: null,
    choreId: "chore-4",
    choreName: "욕실 청소",
    periodStart: "2026-08-02",
    periodEndExclusive: "2026-08-09",
    dueAt: getHoursLater(50),

    occurrence: {
      occurrenceId: "occurrence-4",
      status: "ASSIGNED",
      version: 1,
    },

    recipients: [
      {
        member: {
          membershipId: "member-1",
          displayName: "김지수",
          avatarUrl: null,
          status: "ACTIVE",
        },
        status: "PENDING",
        respondedAt: null,
      },
    ],

    createdAt: new Date().toISOString(),
    lastResponseAt: null,
    resolvedAt: null,
    version: 1,
    responded: false,
  },
];