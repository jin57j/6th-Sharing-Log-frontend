import { useState } from "react";
import { useNavigate } from "react-router";

import { memberApi } from "../api/memberApi";

export default function useRemoveMember({
  groupPublicId,
  onSuccess,
}) {
  const navigate = useNavigate();

  // 현재 강퇴 처리 중인 멤버의 ID입니다.
  // 어떤 멤버의 버튼에 "강퇴 중..."을 표시할 때 사용합니다.
  const [
    removingMembershipId,
    setRemovingMembershipId,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleRemove(member) {
    // 하우스나 멤버 정보가 없거나
    // 이미 다른 강퇴 요청을 처리 중이라면 실행하지 않습니다.
    if (
      !groupPublicId ||
      !member?.membershipId ||
      removingMembershipId
    ) {
      return;
    }

    const memberName =
      member.displayName ||
      "선택한 멤버";

    const confirmed = window.confirm(
      `${memberName}님을 하우스에서 강퇴할까요?\n강퇴된 멤버는 더 이상 이 하우스에 접근할 수 없어요.`,
    );

    if (!confirmed) {
      return;
    }

    setRemovingMembershipId(
      member.membershipId,
    );

    setErrorMessage("");

    try {
      await memberApi.removeMember(
        groupPublicId,
        member.membershipId,
        member.version,
      );

      // 강퇴 성공 후 Members 화면의 목록에서
      // 해당 멤버를 제거하도록 부모에게 알립니다.
      onSuccess?.(member.membershipId);
    } catch (error) {
      console.error(
        "멤버 강퇴에 실패했습니다.",
        error,
      );

      // 로그인 세션이 만료된 경우 로그인 화면으로 이동합니다.
      if (error.status === 401) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      // 관리자가 아닌 사용자가 강퇴를 요청한 경우입니다.
      if (error.status === 403) {
        setErrorMessage(
          "하우스 관리자만 다른 멤버를 강퇴할 수 있어요.",
        );

        return;
      }

      // 대상 멤버가 이미 나갔거나 존재하지 않는 경우입니다.
      if (error.status === 404) {
        setErrorMessage(
          "선택한 멤버를 찾을 수 없어요. 멤버 목록을 새로고침해 주세요.",
        );

        return;
      }

      // 화면에서 조회한 멤버 정보와
      // 서버에 저장된 최신 정보의 버전이 다른 경우입니다.
      if (error.status === 409) {
        setErrorMessage(
          "멤버 정보가 변경되었어요. 페이지를 새로고침한 후 다시 시도해 주세요.",
        );

        return;
      }

      setErrorMessage(
        error.message ||
          "멤버를 강퇴하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      // 성공하거나 실패해도 처리 중 상태를 해제합니다.
      setRemovingMembershipId("");
    }
  }

  return {
    removingMembershipId,
    errorMessage,
    handleRemove,
  };
}