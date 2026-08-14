import {
  useEffect,
  useState,
} from "react";

import { rotationApi } from "../api/rotationApi";

const generateWeeks = () => {
  const today = new Date();
  const day = today.getDay();

  const diff =
    today.getDate() -
    day +
    (day === 0 ? -6 : 1);

  const thisMonday = new Date(
    today.setDate(diff),
  );

  const weeks = [];

  for (
    let index = 0;
    index < 4;
    index += 1
  ) {
    const start = new Date(
      thisMonday,
    );

    start.setDate(
      thisMonday.getDate() +
        index * 7,
    );

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date) =>
      `${date.getMonth() + 1}/${date.getDate()}`;

    weeks.push({
      label:
        index === 0
          ? "이번 주"
          : `${index}주 후`,

      dateRange: `${formatDate(start)} — ${formatDate(end)}`,

      isCurrent: index === 0,
    });
  }

  return weeks;
};

export default function useRotation(
  groupId,
) {
  const [
    occurrences,
    setOccurrences,
  ] = useState([]);

  const [activeTab, setActiveTab] =
    useState("WEEKLY");

  const [
    expandedWeek,
    setExpandedWeek,
  ] = useState(0);

  const [weeks] = useState(
    generateWeeks,
  );

  // Layout에서 받은 현재 하우스 ID와
  // 선택한 주차를 이용해 로테이션을 조회합니다.
  useEffect(() => {
    if (
      !groupId ||
      expandedWeek === null
    ) {
      return;
    }

    let cancelled = false;

    async function loadOccurrences() {
      try {
        const data =
          await rotationApi.getWeeklyPreview(
            groupId,
            {
              frequency: activeTab,
              weekOffset:
                expandedWeek,
            },
          );

        if (!cancelled) {
          setOccurrences(
            data.items ?? data ?? [],
          );
        }
      } catch (error) {
        console.error(
          "로테이션을 불러오지 못했습니다.",
          error,
        );
      }
    }

    loadOccurrences();

    return () => {
      cancelled = true;
    };
  }, [
    groupId,
    activeTab,
    expandedWeek,
  ]);

  return {
    activeTab,
    setActiveTab,
    expandedWeek,
    setExpandedWeek,
    weeks,
    occurrences,
  };
}
