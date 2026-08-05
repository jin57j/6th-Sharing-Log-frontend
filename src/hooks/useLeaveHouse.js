import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getCsrfToken } from "../api/authApi";
import {
  getMyGroup,
  leaveGroup,
} from "../api/groupApi";

export default function useLeaveHouse() {
  const navigate = useNavigate();

  const [house, setHouse] = useState(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isLeaving, setIsLeaving] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  // 계정 페이지에 들어오면 현재 하우스 정보를 조회합니다.
  useEffect(() => {
    let cancelled = false;

    async function loadMyHouse() {
      try {
        const group = await getMyGroup();

        if (cancelled) {
          return;
        }

        // 가입한 하우스가 없다면 하우스 선택 화면으로 이동합니다.
        if (!group) {
          navigate("/house-choice", {
            replace: true,
          });

          return;
        }

        setHouse(group);
      } catch (error) {
        if (cancelled) {
          return;
        }

        // 로그인 세션이 없으면 로그인 화면으로 이동합니다.
        if (error.status === 401) {
          navigate("/", {
            replace: true,
          });

          return;
        }

        setErrorMessage(
          error.message ??
            "하우스 정보를 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMyHouse();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleLeaveHouse() {
    if (!house || isLeaving) {
      return;
    }

    // 실수로 탈퇴하지 않도록 마지막으로 확인합니다.
    const confirmed = window.confirm(
      `"${house.groupName}"에서 정말 탈퇴하시겠어요?\n탈퇴 후에는 하우스 업무와 일정을 확인할 수 없어요.`,
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setIsLeaving(true);

    try {
      // 1. 변경 요청에 필요한 CSRF 토큰을 받습니다.
      const csrf = await getCsrfToken();

      // 2. 하우스 탈퇴 API를 요청합니다.
      await leaveGroup({
        groupPublicId: house.groupPublicId,
        membershipPublicId:
          house.membershipPublicId,
        membershipVersion:
          house.membershipVersion,
        csrf,
      });

      // 3. 계정은 유지되므로 로그인 화면이 아닌
      // 하우스 생성·참여 선택 화면으로 이동합니다.
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

      // 마지막 OWNER가 탈퇴하려는 경우
      if (
        error.code ===
        "LAST_OWNER_CANNOT_LEAVE"
      ) {
        setErrorMessage(
          "마지막 소유자는 하우스를 탈퇴할 수 없어요. 다른 멤버에게 소유자 권한을 넘긴 후 다시 시도해 주세요.",
        );

        return;
      }

      // 조회 이후 멤버십 정보가 변경된 경우
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
    house,
    isLoading,
    isLeaving,
    errorMessage,
    handleLeaveHouse,
  };
}