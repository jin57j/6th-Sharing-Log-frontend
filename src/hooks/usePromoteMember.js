import { useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import { promoteGroupMember } from "../api/groupApi";

export default function usePromoteMember({
  groupPublicId,
  onSuccess,
}) {
  const navigate = useNavigate();

  const [
    promotingMembershipId,
    setPromotingMembershipId,
  ] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handlePromote(member) {
    if (
      !groupPublicId ||
      !member?.membershipId ||
      promotingMembershipId
    ) {
      return;
    }

    const memberName =
      member.displayName || "선택한 멤버";

    const confirmed = window.confirm(
      `${memberName}님을 관리자로 지정할까요?\n관리자가 되면 하우스 설정을 변경할 수 있어요.`,
    );

    if (!confirmed) return;

    setPromotingMembershipId(
      member.membershipId,
    );

    setErrorMessage("");

    try {
      const csrf = await getCsrfToken();

      const promotedMember =
        await promoteGroupMember({
          groupPublicId,
          membershipPublicId:
            member.membershipId,
          csrf,
        });

      onSuccess?.(
        promotedMember.membershipPublicId,
        promotedMember.role,
      );
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
          "하우스 관리자만 다른 멤버를 관리자로 지정할 수 있어요.",
        );

        return;
      }

      if (error.status === 404) {
        setErrorMessage(
          "선택한 멤버를 찾을 수 없어요. 멤버 목록을 새로고침해 주세요.",
        );

        return;
      }

      setErrorMessage(
        error.message ??
          "멤버를 관리자로 지정하지 못했습니다.",
      );
    } finally {
      setPromotingMembershipId("");
    }
  }

  return {
    promotingMembershipId,
    errorMessage,
    handlePromote,
  };
}