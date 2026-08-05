import { useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import { leaveGroup } from "../api/groupApi";

// Layout에서 이미 조회한 하우스 정보를 전달받습니다.
export default function useLeaveHouse(house) {
  const navigate = useNavigate();

  const [isLeaving, setIsLeaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleLeaveHouse() {
    // 하우스 정보가 없거나 이미 탈퇴 요청 중이면 실행하지 않습니다.
    if (!house || isLeaving) {
      return;
    }

    const confirmed = window.confirm(
      `"${house.groupName}"에서 정말 탈퇴하시겠어요?\n탈퇴 후에는 하우스 업무와 일정을 확인할 수 없어요.`,
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setIsLeaving(true);

    try {
      // 상태 변경 요청에 필요한 CSRF 토큰을 받습니다.
      const csrf = await getCsrfToken();

      // 하우스 탈퇴 API를 요청합니다.
      await leaveGroup({
        groupPublicId: house.groupPublicId,
        membershipPublicId:
          house.membershipPublicId,
        membershipVersion:
          house.membershipVersion,
        csrf,
      });

      // 사용자 계정은 유지되므로 하우스 선택 화면으로 이동합니다.
      navigate("/house-choice", {
        replace: true,
      });
    } catch (error) {
      // 로그인 세션이 만료된 경우
      if (error.status === 401) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      // 마지막 오너가 탈퇴하려는 경우
      if (
        error.code ===
        "LAST_OWNER_CANNOT_LEAVE"
      ) {
        setErrorMessage(
          "마지막 소유자는 하우스를 탈퇴할 수 없어요. 다른 멤버에게 소유자 권한을 넘긴 후 다시 시도해 주세요.",
        );

        return;
      }

      // 조회한 이후 멤버십 버전이 변경된 경우
      if (error.code === "VERSION_CONFLICT") {
        setErrorMessage(
          "하우스 정보가 변경되었어요. 페이지를 새로고침한 뒤 다시 시도해 주세요.",
        );

        return;
      }

      setErrorMessage(
        error.message ??
          "하우스에서 탈퇴하지 못했습니다.",
      );
    } finally {
      setIsLeaving(false);
    }
  }

  return {
    isLeaving,
    errorMessage,
    handleLeaveHouse,
  };
}