import { useState } from "react";
import ChoreModal from "../../components/common/ChoreModal";
import useTasks from "../../hooks/useTasks";
import { useGroupMembers } from "../../hooks/useGroupMember";
import { rotationApi } from "../../api/rotationApi";

const extractMemberIds = (eligibility) => {
  if (!eligibility) return [];
  if (
    Array.isArray(eligibility.membershipIds) &&
    eligibility.membershipIds.length > 0
  ) {
    return eligibility.membershipIds;
  }
  if (Array.isArray(eligibility.members)) {
    return eligibility.members.map((m) =>
      typeof m === "object" ? m.membershipId : m,
    );
  }
  return [];
};

export default function Task() {
  const {
    groupId,
    chores,
    isModalOpen,
    editingChore,
    openAddModal,
    openEditModal,
    closeModal,
    handleChoreSubmit,
    handleDelete,
  } = useTasks();

  const { members: groupMembers } = useGroupMembers(groupId);
  const [expandedChoreId, setExpandedChoreId] = useState(null);
  const [rotationMap, setRotationMap] = useState({});

  const toggleRotation = async (chore) => {
    const choreId = typeof chore === "object" ? chore.choreId : chore;

    if (expandedChoreId === choreId) {
      setExpandedChoreId(null);
      return;
    }

    setExpandedChoreId(choreId);
    if (rotationMap[choreId]) return;

    try {
      const offsets = [0, 1, 2, 3];
      const previewPromises = offsets.map((offset) =>
        // 서버에 요청 (서버가 choreId를 무시하더라도 일단 보냄)
        rotationApi.getWeeklyPreview(groupId, { choreId, weekOffset: offset }),
      );

      const responses = await Promise.all(previewPromises);

      // 1. 모든 응답 데이터를 하나로 합칩니다.
      const allOccurrences = responses.flatMap((res) => res.items || []);

      // 🌟 [핵심 수정] 2. 섞여 있는 전체 일정 중, '지금 누른 업무(choreId)'만 깐깐하게 걸러냅니다!
      const targetOccurrences = allOccurrences.filter(
        (item) => item.choreId === choreId,
      );

      // 3. 걸러낸 일정에서 담당자 이름만 추출합니다.
      const names = targetOccurrences
        .filter((item) => item.currentAssignee)
        .map((item) => item.currentAssignee.displayName);

      const displayNames = names.slice(0, 5);

      setRotationMap((prev) => ({
        ...prev,
        [choreId]:
          displayNames.length > 0 ? displayNames : ["예정된 당번이 없습니다."],
      }));
    } catch (error) {
      console.error("미래 로테이션 조회 실패", error);
      setRotationMap((prev) => ({
        ...prev,
        [choreId]: ["미래 로테이션 정보를 불러오지 못했습니다."],
      }));
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-[#F7F4EF]">
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-6">
        <div>
          <p className="mb-2 text-sm text-gray-500">
            반복과 담당자를 편하게 관리해요
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900">업무·관리</h1>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3 font-bold text-white transition-colors bg-[#C8494C] rounded-full hover:bg-[#b84a4a]"
        >
          + 업무 추가
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-500">업무</span>
          <div className="flex gap-4 text-sm font-bold text-gray-500"></div>
        </div>

        {chores.length > 0 ? (
          <ul>
            {chores.map((chore) => {
              const memberIds = extractMemberIds(chore.eligibility);
              const memberCountText =
                chore.eligibility?.mode === "ALL_ACTIVE_MEMBERS"
                  ? `${Array.isArray(groupMembers) ? groupMembers.length : groupMembers?.items?.length || 0}명`
                  : `${memberIds.length}명`;

              const dueTimeText = chore.schedule?.dueTime
                ? chore.schedule.dueTime.slice(0, 5)
                : "미정";

              return (
                <li
                  key={chore.choreId}
                  className="flex flex-col px-6 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🧹</span>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {chore.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          마감: {dueTimeText} · 로테이션 {memberCountText}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full">
                        {chore.schedule?.frequency === "DAILY"
                          ? "매일"
                          : chore.schedule?.frequency === "WEEKLY"
                            ? "매주"
                            : "격주"}
                      </span>
                      <button
                        onClick={() => toggleRotation(chore)}
                        className={`p-2 transition-colors ${expandedChoreId === chore.choreId ? "text-blue-500" : "text-gray-400 hover:text-blue-500"}`}
                      >
                        🔍
                      </button>
                      <button
                        onClick={() => openEditModal(chore)}
                        className="p-2 text-gray-400 transition-colors hover:text-gray-600"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(chore.choreId, chore.version)
                        }
                        className="p-2 text-gray-400 transition-colors hover:text-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {expandedChoreId === chore.choreId && (
                    <div className="p-4 mt-4 bg-[#FDF8E7] rounded-xl text-sm text-gray-700 animate-fade-in">
                      <span className="mr-2 font-bold text-gray-900">
                        🔄 로테이션 순서:
                      </span>
                      <span className="font-medium text-blue-600">
                        {rotationMap[chore.choreId]
                          ? rotationMap[chore.choreId].join(" → ")
                          : "불러오는 중..."}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-16 text-center text-gray-400">
            등록된 업무가 없습니다.
          </div>
        )}
      </div>

      {isModalOpen && (
        <ChoreModal
          key={editingChore ? editingChore.choreId : "new-chore"}
          isOpen={isModalOpen}
          onClose={closeModal}
          initialData={editingChore}
          onSubmit={handleChoreSubmit}
          groupId={groupId}
        />
      )}
    </div>
  );
}