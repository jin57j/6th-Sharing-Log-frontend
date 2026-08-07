import { useState, useEffect } from "react";
import { rotationApi } from "../api/rotationApi";
import { getMyGroup } from "../api/groupApi";

// 오늘 날짜를 기준으로 동적 주차(월~일)를 계산하는 함수
const generateWeeks = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const thisMonday = new Date(today.setDate(diff));

  const weeks = [];
  for (let i = 0; i < 3; i++) {
    const start = new Date(thisMonday);
    start.setDate(thisMonday.getDate() + i * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;

    weeks.push({
      label: i === 0 ? "이번 주" : `${i}주 후`,
      dateRange: `${formatDate(start)} — ${formatDate(end)}`,
      isCurrent: i === 0,
    });
  }
  return weeks;
};

export default function useRotation() {
  const [groupId, setGroupId] = useState(null);
  const [occurrences, setOccurrences] = useState([]);
  const [activeTab, setActiveTab] = useState("WEEKLY");
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [weeks] = useState(() => generateWeeks());

  // 1. 그룹 정보 로드
  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const response = await getMyGroup();
        const data = response?.data || response;

        // 🌟 배열로 응답이 올 경우를 안전하게 처리
        const group = Array.isArray(data) ? data[0] : data;
        const targetGroupId = group?.groupPublicId || group?.groupId;

        if (targetGroupId) {
          setGroupId(targetGroupId);
        } else {
          console.error("❌ 그룹 데이터를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("Failed to fetch user group:", error);
      }
    };
    fetchUserGroup();
  }, []);

  // 2. 업무 로테이션(Occurrence) 목록 로드
  useEffect(() => {
    // 🌟 expandedWeek가 null일 때(아코디언을 닫을 때)는 API 호출을 중단하여 에러를 방지합니다.
    if (!groupId || expandedWeek === null) return;

    const fetchOccurrences = async () => {
      try {
        const data = await rotationApi.getWeeklyPreview(groupId, {
          frequency: activeTab,
          weekOffset: expandedWeek,
        });
        setOccurrences(data.items || data || []);
      } catch (error) {
        console.error("Failed to fetch occurrences:", error);
      }
    };
    fetchOccurrences();
  }, [groupId, activeTab, expandedWeek]);
  // 🌟 expandedWeek가 바뀔 때도 재호출되도록 의존성 배열에 추가

  return {
    activeTab,
    setActiveTab,
    expandedWeek,
    setExpandedWeek,
    weeks,
    occurrences,
  };
}
