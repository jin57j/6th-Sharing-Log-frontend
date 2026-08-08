import { buildBackendUrl } from "./apiConfig";

// 백엔드 응답을 처리하는 공통 함수
async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  let responseBody = null;

  if (contentType.includes("json")) {
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }
  }

  if (!response.ok) {
    const error = new Error(
      responseBody?.detail ??
        responseBody?.message ??
        responseBody?.title ??
        "요청 처리에 실패했습니다.",
    );

    error.status = response.status;
    error.code = responseBody?.code;

    throw error;
  }

  return responseBody;
}

// 백엔드의 시간 형식을 화면에서 사용하는 HH:mm 형식으로 변경
function normalizeTime(time) {
  return time?.slice(0, 5) ?? "";
}

// 백엔드 예약 응답을 기존 프론트 화면 형식으로 변경
function normalizeReservation(reservation) {
  const isMine =
    reservation.member?.me === true;

  return {
    ...reservation,

    memberId:
      reservation.member?.membershipId,

    memberName: isMine
      ? "나"
      : reservation.member?.email ?? "멤버",

    mine: isMine,

    startTime: normalizeTime(
      reservation.startTime,
    ),

    endTime: normalizeTime(
      reservation.endTime,
    ),
  };
}

// 공간 목록 조회
export async function getSpaces(groupId) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeURIComponent(groupId)}/spaces`,
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const responseBody =
    await handleResponse(response);

  // 백엔드는 spaces가 아닌 items로 반환합니다.
  return responseBody.items;
}

// 새로운 공간 추가
export async function createSpace({
  groupId,
  name,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeURIComponent(groupId)}/spaces`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        // 상태 변경 요청에 필요한 CSRF 토큰
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify({
        name,
      }),
    },
  );

  return handleResponse(response);
}

// 예약 공간 삭제
export async function deleteSpace({
  groupId,
  spaceId,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeURIComponent(groupId)}/spaces/${encodeURIComponent(spaceId)}`,
    ),
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",

        // 상태 변경 요청에 필요한 CSRF 토큰
        [csrf.headerName]: csrf.token,
      },
    },
  );

  // 성공하면 백엔드가 204 No Content를 반환합니다.
  return handleResponse(response);
}

// 선택한 공간·날짜의 예약 목록 조회
export async function getReservations({
  groupId,
  date,
  spaceId,
}) {
  const searchParams =
    new URLSearchParams({
      date,
    });

  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeURIComponent(groupId)}/spaces/${encodeURIComponent(spaceId)}/reservations?${searchParams}`,
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const responseBody =
    await handleResponse(response);

  // 백엔드는 reservations가 아닌 items로 반환합니다.
  return responseBody.items.map(
    normalizeReservation,
  );
}

// 새로운 예약 생성
export async function createReservation({
  groupId,
  spaceId,
  date,
  startTime,
  endTime,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeURIComponent(groupId)}/spaces/${encodeURIComponent(spaceId)}/reservations`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify({
        date,
        startTime,
        endTime,
      }),
    },
  );

  const responseBody =
    await handleResponse(response);

  return normalizeReservation(responseBody);
}

// 본인의 예약 취소
export async function cancelReservation({
  groupId,
  reservationId,
  version,
  csrf,
}) {
  const response = await fetch(
    buildBackendUrl(
      `/api/groups/${encodeURIComponent(groupId)}/reservations/${encodeURIComponent(reservationId)}/cancel`,
    ),
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,

        // 조회한 예약의 현재 버전을 전달합니다.
        "If-Match": String(version),
      },
    },
  );

  const responseBody =
    await handleResponse(response);

  return normalizeReservation(responseBody);
}