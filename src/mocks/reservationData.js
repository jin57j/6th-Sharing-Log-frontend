function getToday() {
  const today = new Date();

  const timezoneOffset =
    today.getTimezoneOffset() * 60 * 1000;

  return new Date(
    today.getTime() - timezoneOffset,
  )
    .toISOString()
    .slice(0, 10);
}

const today = getToday();

export const mockSpaces = [
  {
    spaceId: 1,
    name: "세탁실",
  },
  {
    spaceId: 2,
    name: "공용 주방",
  },
  {
    spaceId: 3,
    name: "스터디룸",
  },
];

export const mockReservations = [
  {
    reservationId: 1,
    spaceId: 1,
    spaceName: "세탁실",
    memberId: 2,
    memberName: "김민준",
    date: today,
    startTime: "10:00",
    endTime: "11:00",
    mine: false,
  },
  {
    reservationId: 2,
    spaceId: 1,
    spaceName: "세탁실",
    memberId: 1,
    memberName: "나",
    date: today,
    startTime: "14:00",
    endTime: "15:00",
    mine: true,
  },
];