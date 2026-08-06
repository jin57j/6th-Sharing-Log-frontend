import { useState, useEffect } from "react";
import { rotationApi } from "../../api/rotationApi";
import { getMyGroup } from "../../api/groupApi"; // 🌟 getCurrentUser 대신 getMyGroup 임포트

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

export default function Rotation() {
  const [groupId, setGroupId] = useState(null);
  const [occurrences, setOccurrences] = useState([]);
  const [activeTab, setActiveTab] = useState("WEEKLY");
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    setWeeks(generateWeeks());
  }, []);

  // 🌟 그룹 ID 세팅 (Task.jsx와 동일한 로직으로 수정)
  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const response = await getMyGroup();
        const group = response?.data || response;
        const targetGroupId = group?.groupPublicId; // 대소문자 주의 (groupPublicId)

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
  useEffect(() => {
    if (!groupId) return; // 👈 그룹 ID가 아직 없으면 요청을 보내지 않음

  useEffect(() => {
    if (!groupId) return;

    const fetchOccurrences = async () => {
      try {
        const data = await rotationApi.getOccurrences(groupId, {
          frequency: activeTab,
        });
        setOccurrences(data.items || data || []);
      } catch (error) {
        console.error("Failed to fetch occurrences:", error);
      }
    };
    fetchOccurrences();
  }, [groupId, activeTab]);

  return (
    <div className="min-h-screen p-8 font-sans bg-[#F9F9F7]">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 영역 */}
        <div className="mb-8">
          <p className="mb-2 text-sm text-gray-500">우리 집 당번을 한눈에</p>
          <h1 className="text-3xl font-extrabold text-gray-900">
            업무 로테이션
          </h1>
        </div>

        {/* 탭 전환 영역 */}
        <div className="flex p-1 mb-6 bg-gray-100 rounded-full">
          {[
            { id: "DAILY", label: "매일 업무" },
            { id: "WEEKLY", label: "매주 업무" },
            { id: "BIWEEKLY", label: "격주 업무" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-sm font-bold rounded-full transition-all ${
                activeTab === tab.id
                  ? "bg-white shadow-sm text-red-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 안내 배너 */}
        <div className="p-5 mb-8 border border-green-200 bg-green-50 rounded-2xl">
          <p className="font-bold text-gray-800">
            <span className="mr-2">✨</span>
            로테이션은 구성원 순서대로 자동 배정돼요.
          </p>
          <p className="mt-1 ml-6 text-sm text-gray-500">
            대타가 수락된 업무는 기존 당번 대신 대타 멤버가 표시됩니다.
          </p>
        </div>

        {/* 주차별 아코디언 리스트 */}
        <div className="space-y-4">
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-3xl"
            >
              <button
                onClick={() =>
                  setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)
                }
                className="flex items-center justify-between w-full p-6 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {week.label} · {week.dateRange}
                  </h3>
                  {week.isCurrent && (
                    <span className="text-sm font-bold text-red-500">
                      진행 중인 주
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-500">
                  {expandedWeek === weekIndex ? "▲" : "▼"}
                </div>
              </button>

              {expandedWeek === weekIndex && (
                <div className="px-6 pb-6">
                  {occurrences.length > 0 ? (
                    <ul className="space-y-3">
                      {occurrences.map((occurrence) => {
                        const assignee = occurrence.currentAssignee;

                        return (
                          <li
                            key={occurrence.occurrenceId}
                            className="flex items-center justify-between p-5 bg-[#F9F9F7] rounded-2xl"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">
                                {occurrence.choreName?.includes("쓰레기")
                                  ? "🗑️"
                                  : "🍽️"}
                              </span>
                              <div>
                                <h4 className="font-bold text-gray-900">
                                  {occurrence.choreName}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {occurrence.dueAt
                                    ? new Date(
                                        occurrence.dueAt,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "기한 미정"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {assignee ? (
                                <>
                                  <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-gray-400 rounded-full">
                                    {assignee.displayName.charAt(0)}
                                  </div>
                                  <span className="font-bold text-gray-900">
                                    {assignee.displayName}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  담당자 미정
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="py-8 text-center text-gray-400">
                      해당 주기에 배정된 업무가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
