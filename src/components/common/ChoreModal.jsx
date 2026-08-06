import { useState } from "react";

export default function ChoreModal({ isOpen, onClose, onSubmit, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [frequency, setFrequency] = useState(
    initialData?.schedule?.frequency || "WEEKLY",
  );
  // 백엔드가 요구하는 시간 형식에 맞게 기본값 설정 (예: "20:00:00" 또는 "20:00")
  const [dueDate, setDueDate] = useState(
    initialData?.schedule?.dueTime || "20:00",
  );

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    // 🌟 1. 시간 포맷 맞추기 (HH:mm -> HH:mm:ss)
    // 사용자가 "20:00"으로 입력했다면 "20:00:00"으로 변환
    let formattedTime = dueDate || "20:00";
    if (formattedTime.length === 5) {
      formattedTime = `${formattedTime}:00`;
    }

    // 🌟 2. 명세에 따른 스케줄 필드 null 처리
    const schedule = {
      frequency,
      dueTime: formattedTime,
      weeklyDueDay: frequency === "WEEKLY" ? "MONDAY" : null, // 선택 안 된 건 반드시 null
      biweeklyAnchorDate: frequency === "BIWEEKLY" ? "2026-08-05" : null, // 선택 안 된 건 반드시 null
    };

    const choreData = {
      name,
      schedule,
      eligibility: {
        mode: "ALL_ACTIVE_MEMBERS",
        membershipIds: [],
      },
    };

    onSubmit(choreData);
    onClose(); // 제출 후 모달 닫기
  };

  return (
    // 모달 배경 (어둡게 처리 및 클릭 시 닫기)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full top-5 right-5 hover:bg-gray-200"
        >
          ✕
        </button>

        {/* 헤더 */}
        <div className="mb-6">
          <p className="mb-1 text-xs font-bold text-red-500">
            {initialData ? "EDIT CHORE" : "NEW CHORE"}
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {initialData ? "업무 수정하기" : "새 업무 만들기"}
          </h2>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 업무명 입력 */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-bold text-gray-800">
              업무명
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 주방 정리"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-400"
              required
            />
          </div>

          {/* 반복 유형 및 마감 시간 (가로 배치) */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-gray-800">
                반복 유형
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-400"
              >
                <option value="DAILY">매일</option>
                <option value="WEEKLY">매주</option>
                <option value="BIWEEKLY">격주</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-gray-800">
                마감 시간
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="20:00"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-400"
                required
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full py-4 font-bold text-white transition-colors bg-[#C8494C] rounded-xl hover:bg-[#b84a4a]"
          >
            {initialData ? "수정하기" : "생성하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
