import {
  http,
  HttpResponse,
} from "msw";

import { mockMembers } from "../memberData";

export const memberHandler = [
  http.get(
    "/api/groups/:groupId/rotation-members",
    ({ params }) => {
      return HttpResponse.json({
        groupId: params.groupId,

        // 첫 번째 Mock 멤버를 현재 로그인 사용자로 가정합니다.
        actorMembershipId:
          mockMembers[0].membershipId,

        // Mock 사용자는 OWNER이므로 관리 권한이 있습니다.
        canManage: true,

        items: mockMembers,
      });
    },
  ),
];