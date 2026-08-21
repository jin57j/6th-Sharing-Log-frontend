import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { rotationApi } from "../api/rotationApi";

function belongsToMember(
  occurrence,
  membershipId,
) {
  if (
    occurrence.status === "COMPLETED"
  ) {
    return (
      occurrence.completedBy
        ?.membershipId === membershipId
    );
  }

  return (
    occurrence.currentAssignee
      ?.membershipId === membershipId
  );
}

function useWeeklyCompletionRate(
  groupId,
  membershipId,
) {
  const [completedCount, setCompletedCount] =
    useState(0);
  const [totalCount, setTotalCount] =
    useState(0);
  const [isLoading, setIsLoading] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [reloadCount, setReloadCount] =
    useState(0);

  const reload = useCallback(() => {
    setReloadCount(
      (currentCount) =>
        currentCount + 1,
    );
  }, []);

  useEffect(() => {
    if (!groupId || !membershipId) {
      return undefined;
    }

    let cancelled = false;

    async function loadWeeklyRate() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response =
          await rotationApi.getWeeklyPreview(
            groupId,
            {
              weekOffset: 0,
            },
          );

        if (cancelled) {
          return;
        }

        const items = Array.isArray(
          response?.items,
        )
          ? response.items
          : [];

        const myOccurrences =
          items.filter(
            (occurrence) =>
              occurrence.status !==
                "CANCELLED" &&
              occurrence.status !==
                "SKIPPED" &&
              belongsToMember(
                occurrence,
                membershipId,
              ),
          );

        setTotalCount(
          myOccurrences.length,
        );
        setCompletedCount(
          myOccurrences.filter(
            (occurrence) =>
              occurrence.status ===
              "COMPLETED",
          ).length,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "이번 주 완료율을 불러오지 못했습니다.",
          error,
        );
        setCompletedCount(0);
        setTotalCount(0);
        setErrorMessage(
          "완료율을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadWeeklyRate();

    return () => {
      cancelled = true;
    };
  }, [
    groupId,
    membershipId,
    reloadCount,
  ]);

  const hasActiveGroup = Boolean(
    groupId && membershipId,
  );

  return {
    completedCount: hasActiveGroup
      ? completedCount
      : 0,
    totalCount: hasActiveGroup
      ? totalCount
      : 0,
    isLoading:
      hasActiveGroup && isLoading,
    errorMessage: hasActiveGroup
      ? errorMessage
      : "",
    reload,
  };
}

export default useWeeklyCompletionRate;
