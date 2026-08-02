import { http, HttpResponse } from "msw";

import {
  mockNotificationOccurrences,
  mockSubstituteRequests,
} from "../notificationData";

// MSW에서만 사용하는 responded 값을 응답에서 제거하는 함수
function createSubstituteResponse(request) {
  const responseBody = { ...request };

  // MSW 내부에서만 쓰는 값이므로 실제 API 응답에서는 제거
  delete responseBody.responded;

  return responseBody;
}

// 내 업무 목록 조회
const getOccurrencesHandler = http.get(
  "/api/groups/:groupId/occurrences",
  ({ params }) => {
    return HttpResponse.json({
      groupId: params.groupId,
      frequency: null,
      query: {
        activeOn: null,
        timeZoneId: "Asia/Seoul",
      },
      items: mockNotificationOccurrences,
      nextCursor: null,
      hasNext: false,
    });
  },
);

// 내가 받은 대타 요청 목록 조회
const getSubstituteRequestsHandler = http.get(
  "/api/groups/:groupId/substitute-requests",
  ({ params }) => {
    const pendingRequests = mockSubstituteRequests
      .filter((request) => !request.responded)
      .map(createSubstituteResponse);

    return HttpResponse.json({
      groupId: params.groupId,
      box: "INBOX",
      items: pendingRequests,
      totalCount: pendingRequests.length,
    });
  },
);

// 대타 요청 수락
const acceptSubstituteRequestHandler = http.post(
  "/api/groups/:groupId/substitute-requests/:requestId/accept",
  ({ params }) => {
    const targetRequest = mockSubstituteRequests.find(
      (request) => request.requestId === params.requestId,
    );

    if (!targetRequest) {
      return HttpResponse.json(
        {
          message: "대타 요청을 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (targetRequest.responded) {
      return HttpResponse.json(
        {
          message: "이미 응답한 대타 요청입니다.",
        },
        {
          status: 409,
        },
      );
    }

    const respondedAt = new Date().toISOString();

    targetRequest.status = "ACCEPTED";
    targetRequest.acceptedBy = {
      membershipId: "member-1",
      displayName: "김지수",
      avatarUrl: null,
      status: "ACTIVE",
    };
    targetRequest.lastResponseAt = respondedAt;
    targetRequest.resolvedAt = respondedAt;
    targetRequest.version += 1;
    targetRequest.responded = true;

    targetRequest.recipients = targetRequest.recipients.map((recipient) => ({
      ...recipient,
      status: "ACCEPTED",
      respondedAt,
    }));

    return HttpResponse.json(createSubstituteResponse(targetRequest));
  },
);

// 대타 요청 거절
const rejectSubstituteRequestHandler = http.post(
  "/api/groups/:groupId/substitute-requests/:requestId/reject",
  ({ params }) => {
    const targetRequest = mockSubstituteRequests.find(
      (request) => request.requestId === params.requestId,
    );

    if (!targetRequest) {
      return HttpResponse.json(
        {
          message: "대타 요청을 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (targetRequest.responded) {
      return HttpResponse.json(
        {
          message: "이미 응답한 대타 요청입니다.",
        },
        {
          status: 409,
        },
      );
    }

    const respondedAt = new Date().toISOString();

    targetRequest.lastResponseAt = respondedAt;
    targetRequest.version += 1;
    targetRequest.responded = true;

    targetRequest.recipients = targetRequest.recipients.map((recipient) => ({
      ...recipient,
      status: "DECLINED",
      respondedAt,
    }));

    return HttpResponse.json(createSubstituteResponse(targetRequest));
  },
);

export const notificationHandler = [
  getOccurrencesHandler,
  getSubstituteRequestsHandler,
  acceptSubstituteRequestHandler,
  rejectSubstituteRequestHandler,
];