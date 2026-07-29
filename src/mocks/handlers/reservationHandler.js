// 예약 핸들러
import { http, HttpResponse } from "msw";
import { mockReservations, mockSpaces } from "../reservationData";

function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

/*
 * 공간 목록 조회
 */
const getSpacesHandler = http.get("/api/groups/:groupId/spaces", () => {
  return HttpResponse.json({ spaces: mockSpaces });
});

/*
 * 새로운 공간 추가
 */
const createSpaceHandler = http.post(
  "/api/groups/:groupId/spaces",
  async ({ request }) => {
    const requestBody = await request.json();
    const name = requestBody.name?.trim();

    if (!name) {
      return HttpResponse.json(
        { code: "INVALID_SPACE_NAME", message: "공간 이름을 입력해 주세요." },
        { status: 400 }
      );
    }

    const alreadyExists = mockSpaces.some(
      (space) => space.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      return HttpResponse.json(
        { code: "SPACE_ALREADY_EXISTS", message: "이미 등록된 공간입니다." },
        { status: 409 }
      );
    }

    const newSpace = {
      spaceId: Math.max(...mockSpaces.map((space) => space.spaceId), 0) + 1,
      name,
    };

    mockSpaces.push(newSpace);
    return HttpResponse.json(newSpace, { status: 201 });
  }
);

/*
 * 특정 날짜와 공간의 예약 목록 조회
 */
const getReservationsHandler = http.get(
  "/api/groups/:groupId/reservations",
  ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const spaceId = Number(url.searchParams.get("spaceId"));

    const reservations = mockReservations
      .filter(
        (reservation) =>
          reservation.date === date && reservation.spaceId === spaceId
      )
      .sort((first, second) =>
        first.startTime.localeCompare(second.startTime)
      );

    return HttpResponse.json({ reservations });
  }
);

/*
 * 새로운 예약 생성
 */
const createReservationHandler = http.post(
  "/api/groups/:groupId/reservations",
  async ({ request }) => {
    const requestBody = await request.json();
    const { spaceId, date, startTime, endTime } = requestBody;

    if (!spaceId || !date || !startTime || !endTime) {
      return HttpResponse.json(
        { code: "INVALID_RESERVATION", message: "예약 정보를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return HttpResponse.json(
        { code: "INVALID_RESERVATION_TIME", message: "종료 시간은 시작 시간보다 늦어야 합니다." },
        { status: 400 }
      );
    }

    if (endMinutes - startMinutes < 30) {
      return HttpResponse.json(
        { code: "RESERVATION_TOO_SHORT", message: "예약은 최소 30분 이상이어야 합니다." },
        { status: 400 }
      );
    }

    const selectedSpace = mockSpaces.find(
      (space) => space.spaceId === Number(spaceId)
    );

    if (!selectedSpace) {
      return HttpResponse.json(
        { code: "SPACE_NOT_FOUND", message: "공간을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const hasOverlap = mockReservations.some(
      (reservation) =>
        reservation.spaceId === Number(spaceId) &&
        reservation.date === date &&
        reservation.startTime < endTime &&
        reservation.endTime > startTime
    );

    if (hasOverlap) {
      return HttpResponse.json(
        { code: "RESERVATION_TIME_CONFLICT", message: "이미 예약된 시간과 겹칩니다." },
        { status: 409 }
      );
    }

    const newReservation = {
      reservationId:
        Math.max(
          ...mockReservations.map((reservation) => reservation.reservationId),
          0
        ) + 1,
      spaceId: Number(spaceId),
      spaceName: selectedSpace.name,
      memberId: 1,
      memberName: "나",
      date,
      startTime,
      endTime,
      mine: true,
    };

    mockReservations.push(newReservation);
    return HttpResponse.json(newReservation, { status: 201 });
  }
);

/*
 * 본인의 예약 취소
 */
const cancelReservationHandler = http.delete(
  "/api/groups/:groupId/reservations/:reservationId",
  ({ params }) => {
    const reservationId = Number(params.reservationId);
    const reservationIndex = mockReservations.findIndex(
      (reservation) => reservation.reservationId === reservationId
    );

    if (reservationIndex === -1) {
      return HttpResponse.json(
        { code: "RESERVATION_NOT_FOUND", message: "예약을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const reservation = mockReservations[reservationIndex];

    if (!reservation.mine) {
      return HttpResponse.json(
        { code: "RESERVATION_CANCEL_FORBIDDEN", message: "다른 사용자의 예약은 취소할 수 없습니다." },
        { status: 403 }
      );
    }

    mockReservations.splice(reservationIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }
);

// 분리한 예약 관련 핸들러 배열
export const reservationHandler = [
  getSpacesHandler,
  createSpaceHandler,
  getReservationsHandler,
  createReservationHandler,
  cancelReservationHandler,
];