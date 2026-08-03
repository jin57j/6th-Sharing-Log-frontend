import { useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import { createGroup } from "../api/groupApi";
import { createInvitation } from "../api/invitationApi";

export default function useCreateHouse() {
  const navigate = useNavigate();

  const [houseName, setHouseName] = useState("");
  const [address, setAddress] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    // 1. 서버에서 CSRF 보안 토큰을 가져옵니다.
    const csrf = await getCsrfToken();

    // 2. 사용자가 입력한 이름으로 하우스를 생성합니다.
    const group = await createGroup({
      name: houseName.trim(),
      csrf,
    });

    // 3. 생성된 하우스의 초대 코드를 발급합니다.
    const invitation = await createInvitation({
      groupId: group.groupId,
      csrf,
    });

    // 4. 초대 코드 화면으로 이동합니다.
    navigate("/invite-house", {
      state: {
        houseName: group.name,
        groupId: group.groupId,
        inviteCode: invitation.code,
        inviteUrl: invitation.inviteUrl,
        expiresAt: invitation.expiresAt,
      },
    });
  }

  return {
    houseName,
    setHouseName,
    address,
    setAddress,
    handleSubmit,
  };
}