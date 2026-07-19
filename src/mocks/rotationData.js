export const mockMembers = [
    {
        memberId: 1,
        name: "김지수",
        role: "OWNER",
        me: true,
    },
    {
        memberId: 2,
        name: "이민준",
        role: "MEMBER",
        me: false,
    },
    {
        memberId: 3,
        name: "박서연",
        role: "MEMBER",
        me: false,
    },
    {
        memberId: 4,
        name: "최태양",
        role: "MEMBER",
        me: false,
    },
];

export const mockTasks = [
    {
        taskId: 1,
        name: "거실 청소",
        icon: "🧹",
        frequency: "WEEKLY",
        startAssigneeId: 1, // 업무를 맨 처음으로 시작한 사람의 id
        rotationMemberIds: [1, 2, 3, 4], // 이 업무를 같이 하는 사람들의 id
    },
    {
        taskId: 2,
        name: "쓰레기 버리기",
        icon: "🗑️",
        frequency: "DAILY",
        startAssigneeId: 2,
        rotationMemberIds: [1, 2, 3, 4],
    },
    {
        taskId: 3,
        name: "분리수거",
        icon: "♻️",
        frequency: "BIWEEKLY",
        startAssigneeId: 3,
        rotationMemberIds: [1, 2, 4],
   },
]

// 나중에는 실시간으로 날짜에 따라 값이 바뀌게 만들 예정
export const mockWeeks = [
  {
      weekId: 0,
      label: "이번 주 · 7/13 — 7/19",
  },
  {
      weekId: 1,
      label: "1주 후 · 7/20 — 7/26",
  },
  {
      weekId: 2,
      label: "2주 후 · 7/27 — 8/2",
  },
  {
      weekId: 3,
      label: "3주 후 · 8/3 — 8/9",
  },
];