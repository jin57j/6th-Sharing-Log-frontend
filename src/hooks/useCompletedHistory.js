import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { rotationApi } from "../api/rotationApi";

function useCompletedHistory(
  groupId,
  mineOnly,
) {
  const [
    occurrences,
    setOccurrences,
  ] = useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [reloadCount, setReloadCount] =
    useState(0);

  const reload = useCallback(() => {
    setReloadCount(
      (currentCount) =>
        currentCount + 1,
    );
  }, []);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    let cancelled = false;

    async function loadCompletedHistory() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response =
          await rotationApi.getCompletedHistory(
            groupId,
            {
              mineOnly,
              includeOverdue: true,
            },
          );

        if (cancelled) {
          return;
        }

        setOccurrences(
          Array.isArray(response?.items)
            ? response.items
            : [],
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "완료 업무 이력을 불러오지 못했습니다.",
          error,
        );

        setOccurrences([]);

        setErrorMessage(
          "완료 업무 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCompletedHistory();

    return () => {
      cancelled = true;
    };
  }, [
    groupId,
    mineOnly,
    reloadCount,
  ]);

  return {
    occurrences:
      groupId ? occurrences : [],

    isLoading:
      Boolean(groupId) && isLoading,

    errorMessage:
      groupId
        ? errorMessage
        : "",

    reload,
  };
}

export default useCompletedHistory;
