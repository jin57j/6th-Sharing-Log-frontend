import { useEffect, useState } from "react";

import { getCurrentUser } from "../api/authApi";
import { getMyGroup } from "../api/groupApi";

export default function useCurrentProfile() {
  const [nickname, setNickname] = useState("");
  const [houseName, setHouseName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentProfile() {
      try {
        const [user, group] = await Promise.all([
          getCurrentUser(),
          getMyGroup(),
        ]);

        if (cancelled) {
          return;
        }

        setNickname(
          user.nickname?.trim() || "사용자",
        );

        setHouseName(
          group?.groupName || "참여 중인 하우스 없음",
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setErrorMessage(
          error.message ??
            "사용자 정보를 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCurrentProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    nickname,
    houseName,
    isLoading,
    errorMessage,
  };
}