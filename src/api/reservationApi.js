// 개발 모드(MSW)일 때는 "omit"(쿠키 끔)
// 나중에 배포/진짜 백엔드 연결 시엔 "include"(쿠키 켬)
const CREDENTIALS_MODE = import.meta.env.DEV ? "omit" : "include";

async function handleResponse(
  response,
) {
  if (response.status === 204) {
    return null;
  }

  const responseBody =
    await response.json();

  if (!response.ok) {
    throw new Error(
      responseBody.message ||
        "요청 처리에 실패했습니다.",
    );
  }

  return responseBody;
}

export async function getSpaces(
  groupId,
) {
  const response = await fetch(
    `/api/groups/${groupId}/spaces`,
    {
      credentials: CREDENTIALS_MODE,
    },
  );

  const responseBody =
    await handleResponse(response);

  return responseBody.spaces;
}

export async function createSpace(
  groupId,
  name,
) {
  const response = await fetch(
    `/api/groups/${groupId}/spaces`,
    {
      method: "POST",
      credentials: CREDENTIALS_MODE,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    },
  );

  return handleResponse(response);
}

export async function getReservations({
  groupId,
  date,
  spaceId,
}) {
  const searchParams =
    new URLSearchParams({
      date,
      spaceId: String(spaceId),
    });

  const response = await fetch(
    `/api/groups/${groupId}/reservations?${searchParams}`,
    {
      credentials: CREDENTIALS_MODE,
    },
  );

  const responseBody =
    await handleResponse(response);

  return responseBody.reservations;
}

export async function createReservation(
  groupId,
  reservationData,
) {
  const response = await fetch(
    `/api/groups/${groupId}/reservations`,
    {
      method: "POST",
      credentials: CREDENTIALS_MODE,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        reservationData,
      ),
    },
  );

  return handleResponse(response);
}

export async function cancelReservation(
  groupId,
  reservationId,
) {
  const response = await fetch(
    `/api/groups/${groupId}/reservations/${reservationId}`,
    {
      method: "DELETE",
      credentials: CREDENTIALS_MODE,
    },
  );

  return handleResponse(response);
}