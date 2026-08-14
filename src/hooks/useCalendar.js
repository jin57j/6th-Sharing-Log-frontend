import {
  useEffect,
  useState,
} from "react";

import { rotationApi } from "../api/rotationApi";

const WEEK_OFFSETS = [
  0,
  1,
  2,
  3,
  4,
];

function mergeOccurrences(responses) {
  const occurrenceMap = new Map();

  responses.forEach((response) => {
    const items = Array.isArray(
      response?.items,
    )
      ? response.items
      : [];

    items.forEach((occurrence) => {
      if (
        occurrence.status ===
        "CANCELLED"
      ) {
        return;
      }

      occurrenceMap.set(
        occurrence.occurrenceId,
        occurrence,
      );
    });
  });

  return Array.from(
    occurrenceMap.values(),
  ).sort(
    (firstOccurrence, secondOccurrence) =>
      new Date(firstOccurrence.dueAt) -
      new Date(secondOccurrence.dueAt),
  );
}

function getPlanningRange(responses) {
  const fromDates = responses
    .map(
      (response) =>
        response?.fromInclusive,
    )
    .filter(Boolean)
    .sort();

  const toDates = responses
    .map(
      (response) =>
        response?.toExclusive,
    )
    .filter(Boolean)
    .sort();

  if (
    fromDates.length === 0 ||
    toDates.length === 0
  ) {
    return null;
  }

  return {
    fromInclusive: fromDates[0],
    toExclusive:
      toDates[toDates.length - 1],
  };
}

function useCalendar(groupId) {
  const [
    occurrences,
    setOccurrences,
  ] = useState([]);

  const [planningRange, setPlanningRange] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    let cancelled = false;

    async function loadCalendar() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // 백엔드의 이번 주부터 4주 후까지 총 5개 주차를 동시에 조회합니다.
        const responses =
          await Promise.all(
            WEEK_OFFSETS.map(
              (weekOffset) =>
                rotationApi.getWeeklyPreview(
                  groupId,
                  {
                    weekOffset,
                  },
                ),
            ),
          );

        if (cancelled) {
          return;
        }

        // 격주 업무가 주차 응답에 중복으로 들어올 수 있어 occurrenceId로 제거합니다.
        setOccurrences(
          mergeOccurrences(responses),
        );

        setPlanningRange(
          getPlanningRange(responses),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "달력 일정을 불러오지 못했습니다.",
          error,
        );

        setErrorMessage(
          "달력 일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCalendar();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return {
    occurrences,
    planningRange,
    isLoading,
    errorMessage,
  };
}

export default useCalendar;