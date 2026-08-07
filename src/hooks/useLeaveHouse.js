import { useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import { leaveGroup } from "../api/groupApi";
import { clearActiveGroupId } from "../utils/activeGroup";

export default function useLeaveHouse(house) {
  const navigate = useNavigate();

  const [isLeaving, setIsLeaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleLeaveHouse() {
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
      const csrf = await getCsrfToken();

      await leaveGroup({
        groupPublicId:
          house.groupPublicId,
        membershipPublicId:
          house.membershipPublicId,
        membershipVersion:
          house.membershipVersion,
        csrf,
      });

      // 탈퇴한 하우스가 현재 하우스로 남지 않게 제거합니다.
      clearActiveGroupId();

      // 남은 하우스를 다시 선택할 수 있도록 이동합니다.
      navigate("/house-choice", {
        replace: true,
      });
    } catch (error) {
      if (error.status === 401) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      if (
        error.code ===
        "LAST_OWNER_CANNOT_LEAVE"
      ) {
        setErrorMessage(
          "다른 멤버가 남아 있는 마지막 소유자는 탈퇴할 수 없어요. 다른 소유자를 지정한 후 다시 시도해 주세요.",
        );

        return;
      }

      if (
        error.code ===
        "VERSION_CONFLICT"
      ) {
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