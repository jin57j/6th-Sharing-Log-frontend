import { useOutletContext } from "react-router";

import useRotation from "../../hooks/useRotation";

export default function Rotation() {
  const { activeGroup } =
    useOutletContext();

  const {
    activeTab,
    setActiveTab,
    expandedWeek,
    setExpandedWeek,
    weeks,
    occurrences,
  } = useRotation(
    activeGroup?.groupPublicId ?? "",
  );

  // 🌟 날짜+요일+시간을 예쁘게 포맷팅하는 헬퍼 함수
  const formatDateTime = (dateString) => {
    if (!dateString) return "기한 미정";
    const d = new Date(dateString);
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const dayName = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${month}/${date}(${dayName}) ${time}`;
  };

  // 🌟 서버 데이터를 마감 시간(dueAt) 기준 오름차순(시간순)으로 정렬
  const sortedOccurrences = [...(occurrences || [])].sort(
    (a, b) => new Date(a.dueAt) - new Date(b.dueAt),
  );

  return (
    <div className="min-h-screen p-8 font-sans bg-[#F7F4EF]">
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
                  {sortedOccurrences.length > 0 ? (
                    <ul className="space-y-3">
                      {sortedOccurrences.map((occurrence) => {
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
                                {/* 🌟 포맷팅된 날짜/시간 적용 */}
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDateTime(occurrence.dueAt)}
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
