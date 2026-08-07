import { useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import {
  deleteGroup,
  leaveGroup,
} from "../api/groupApi";
import { memberApi } from "../api/memberApi";
import { clearActiveGroupId } from "../utils/activeGroup";

export default function useLeaveHouse(house) {
  const navigate = useNavigate();

  const [
    isCheckingMembers,
    setIsCheckingMembers,
  ] = useState(false);

  const [isLeaving, setIsLeaving] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  function moveToHouseChoice() {
    // 삭제하거나 탈퇴한 하우스가 현재 하우스로
    // 계속 선택되지 않도록 저장값을 제거합니다.
    clearActiveGroupId();

    // 사용자가 다른 하우스를 선택할 수 있도록
    // 하우스 선택 화면으로 이동합니다.
    navigate("/house-choice", {
      replace: true,
    });
  }

  async function handleLeaveHouse() {
    if (
      !house ||
      isCheckingMembers ||
      isLeaving ||
      isDeleting
    ) {
      return;
    }

    setErrorMessage("");
    setIsCheckingMembers(true);

    let activeMembers;

    try {
      // 현재 하우스의 구성원 목록을 조회합니다.
      const response =
        await memberApi.getRotationMembers(
          house.groupPublicId,
        );

      const members = Array.isArray(response)
        ? response
        : response?.items ?? [];

      // 백엔드 응답에 status가 없는 Mock 데이터도
      // 테스트할 수 있도록 함께 처리합니다.
      activeMembers = members.filter(
        (member) =>
          !member.status ||
          member.status === "ACTIVE",
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "하우스 구성원 정보를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );

      return;
    } finally {
      setIsCheckingMembers(false);
    }

    if (activeMembers.length === 0) {
      setErrorMessage(
        "현재 하우스의 구성원 정보를 확인할 수 없습니다. 화면을 새로고침한 후 다시 시도해 주세요.",
      );

      return;
    }

    // 현재 하우스에 나 혼자 남아 있다면
    // 일반 탈퇴가 아니라 하우스 삭제를 진행합니다.
    if (activeMembers.length === 1) {
      setIsDeleteModalOpen(true);
      return;
    }

    // 다른 구성원이 남아 있으면
    // 기존 하우스 탈퇴 API를 사용합니다.
    const confirmed = window.confirm(
      `"${house.groupName}"에서 정말 탈퇴하시겠어요?\n탈퇴 후에는 이 하우스의 업무와 일정을 확인할 수 없어요.`,
    );

    if (!confirmed) {
      return;
    }

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

      moveToHouseChoice();
    } catch (error) {
      console.error(error);

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
          "다른 구성원이 남아 있는 마지막 소유자는 탈퇴할 수 없어요. 다른 소유자를 지정한 후 다시 시도해 주세요.",
        );

        return;
      }

      if (
        error.code ===
          "VERSION_CONFLICT" ||
        error.status === 412
      ) {
        setErrorMessage(
          "하우스 정보가 변경되었습니다. 화면을 새로고침한 후 다시 시도해 주세요.",
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

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setErrorMessage("");
    setIsDeleteModalOpen(false);
  }

  async function handleConfirmLastMemberDelete(
    inputHouseName,
  ) {
    if (!house || isDeleting) {
      return;
    }

    // 화면에서 한 번 확인했더라도
    // 요청 직전에 다시 이름을 비교합니다.
    if (
      inputHouseName.trim() !==
      house.groupName
    ) {
      setErrorMessage(
        "하우스 이름이 일치하지 않습니다.",
      );

      return;
    }

    setErrorMessage("");
    setIsDeleting(true);

    try {
      const csrf = await getCsrfToken();

      await deleteGroup({
        groupPublicId:
          house.groupPublicId,
        csrf,
      });

      setIsDeleteModalOpen(false);
      moveToHouseChoice();
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      if (error.status === 403) {
        setErrorMessage(
          "하우스를 삭제할 권한이 없습니다.",
        );

        return;
      }

      if (error.status === 404) {
        setErrorMessage(
          "삭제할 하우스를 찾을 수 없습니다.",
        );

        return;
      }

      if (error.status === 409) {
        setErrorMessage(
          "다른 구성원이 참여하고 있어 하우스를 삭제할 수 없습니다. 구성원 정보를 다시 확인해 주세요.",
        );

        return;
      }

      setErrorMessage(
        error.message ??
          "하우스를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    isCheckingMembers,
    isLeaving,
    isDeleting,
    isDeleteModalOpen,
    errorMessage,
    handleLeaveHouse,
    closeDeleteModal,
    handleConfirmLastMemberDelete,
  };
}