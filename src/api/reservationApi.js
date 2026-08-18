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
      responseBody =
        await response.json();
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
function normalizeReservation(
  reservation,
) {
  // 백엔드는 현재 로그인한 사용자의 예약이면
  // member.me를 true로 반환합니다.
  const isMine =
    reservation.member?.me === true;

  // 예약자 닉네임을 우선 사용합니다.
  //
  // 닉네임이 없는 기존 사용자가 있을 수 있으므로
  // 닉네임 → 이메일 → "멤버" 순서로 대체합니다.
  const memberDisplayName =
    reservation.member?.nickname?.trim() ||
    reservation.member?.email ||
    "멤버";

  return {
    ...reservation,

    // 중첩된 member 객체에서 멤버십 ID를 꺼냅니다.
    memberId:
      reservation.member?.membershipId,

    // 내 예약은 "나"로 표시하고,
    // 다른 사용자의 예약은 닉네임으로 표시합니다.
    memberName: isMine
      ? "나"
      : memberDisplayName,

    mine: isMine,

    // 10:00:00 형식을 10:00 형식으로 변경합니다.
    startTime: normalizeTime(
      reservation.startTime,
    ),

    endTime: normalizeTime(
      reservation.endTime,
    ),
  };
}

// 공간 목록 조회
export async function getSpaces(
  groupId,
) {
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

  // 백엔드는 공간 목록을 items에 담아서 반환합니다.
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
        "Content-Type":
          "application/json",
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

  // 예약마다 백엔드 형식을 프론트 화면 형식으로 변경합니다.
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
        "Content-Type":
          "application/json",
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

  return normalizeReservation(
    responseBody,
  );
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

  return normalizeReservation(
    responseBody,
  );
}
