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

  // null: 삭제창 닫힘
  // last-member: 마지막 구성원이 나가면서 삭제
  // owner: 관리자가 직접 하우스 삭제
  const [deleteMode, setDeleteMode] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const isDeleteModalOpen =
    deleteMode !== null;

  function moveToHouseChoice() {
    // 삭제하거나 탈퇴한 하우스가 계속 선택되지 않도록
    // 브라우저에 저장한 현재 하우스 ID를 제거합니다.
    clearActiveGroupId();

    navigate("/house-choice", {
      replace: true,
    });
  }

  // 일반 하우스 탈퇴 버튼입니다.
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
      const response =
        await memberApi.getRotationMembers(
          house.groupPublicId,
        );

      const members = Array.isArray(response)
        ? response
        : response?.items ?? [];

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

    // 마지막 구성원이면 일반 탈퇴 대신
    // 하우스 이름을 입력한 후 삭제하도록 합니다.
    if (activeMembers.length === 1) {
      setDeleteMode("last-member");
      return;
    }

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
          "다른 구성원이 남아 있는 마지막 관리자는 탈퇴할 수 없어요. 다른 멤버를 관리자로 지정한 후 다시 시도해 주세요.",
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

  // 관리자가 구성원 수와 관계없이
  // 하우스 삭제 확인창을 엽니다.
  function openDeleteModal() {
    if (
      !house ||
      house.role !== "OWNER" ||
      isCheckingMembers ||
      isLeaving ||
      isDeleting
    ) {
      return;
    }

    setErrorMessage("");
    setDeleteMode("owner");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setErrorMessage("");
    setDeleteMode(null);
  }

  // 마지막 구성원 삭제와 관리자 직접 삭제가
  // 공통으로 사용하는 함수입니다.
  async function handleConfirmDelete(
    inputHouseName,
  ) {
    if (
      !house ||
      !deleteMode ||
      isDeleting
    ) {
      return;
    }

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

      setDeleteMode(null);
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
          "하우스 관리자만 하우스를 삭제할 수 있어요.",
        );

        return;
      }

      if (error.status === 404) {
        setErrorMessage(
          "삭제할 하우스를 찾을 수 없어요.",
        );

        return;
      }

      if (error.status === 409) {
        setErrorMessage(
          "하우스 상태가 변경되어 삭제하지 못했습니다. 화면을 새로고침한 후 다시 시도해 주세요.",
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
    deleteMode,

    errorMessage,

    handleLeaveHouse,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
  };
}