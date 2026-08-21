import { useState } from "react";
import { useOutletContext } from "react-router";
import ChoreModal from "../../components/common/ChoreModal";
import useTasks from "../../hooks/useTasks";
import { useGroupMembers } from "../../hooks/useGroupMember";
import { rotationApi } from "../../api/rotationApi";
import { getChoreIcon } from "../../utils/choreUtils";
import searchIcon from "../../assets/icon/search_icon.svg";
import fixIcon from "../../assets/icon/fix_icon.svg";
import trashcanIcon from "../../assets/icon/trashcan_icon.svg";

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
  const { activeGroup } = useOutletContext();

  const activeGroupId = activeGroup?.groupPublicId ?? "";

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
  } = useTasks(activeGroupId);

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

      // 2. 섞여 있는 전체 일정 중, '지금 누른 업무(choreId)'만 깐깐하게 걸러냅니다!
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
    <div className="min-h-screen p-4 sm:p-8 font-sans bg-[#F7F4EF]">
      {/* 상단 헤더: 모바일 대응 (flex-col sm:flex-row) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between max-w-4xl mx-auto mb-6 gap-4">
        <div>
          <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500">
            반복과 담당자를 편하게 관리해요
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            업무 관리
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white transition-colors bg-[#C8494C] rounded-full hover:bg-[#b84a4a] active:scale-[0.98]"
        >
          + 업무 추가
        </button>
      </div>

      {/* 컨테이너 카드 */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <span className="text-xs sm:text-sm font-bold text-gray-500">
            업무
          </span>
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
                  className="flex flex-col px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {/* 리스트 아이템 메인 행 */}
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* 좌측: 아이콘 & 업무 정보 */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-3xl leading-none sm:text-[34px]"
                      >
                        {getChoreIcon(chore.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                            {chore.name}
                          </h3>
                          {/* 주기 태그 (모바일에서 이름 옆에 붙도록 설정) */}
                          <span className="shrink-0 px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-gray-600 bg-gray-100 rounded-full">
                            {chore.schedule?.frequency === "DAILY"
                              ? "매일"
                              : chore.schedule?.frequency === "WEEKLY"
                                ? "매주"
                                : "격주"}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
                          마감: {dueTimeText} · 로테이션 {memberCountText}
                        </p>
                      </div>
                    </div>

                    {/* 우측: 액션 버튼 그룹 */}
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                      <button
                        onClick={() => toggleRotation(chore)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                          expandedChoreId === chore.choreId
                            ? "text-blue-500 bg-blue-50"
                            : "text-gray-400 hover:text-blue-500 hover:bg-gray-100"
                        }`}
                        aria-label="로테이션 확인"
                      >
                        <img src={searchIcon} alt="" className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(chore)}
                        className="p-1.5 sm:p-2 rounded-lg text-gray-400 transition-colors hover:text-gray-600 hover:bg-gray-100"
                        aria-label="수정"
                      >
                        <img src={fixIcon} alt="" className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(chore.choreId, chore.version)
                        }
                        className="p-1.5 sm:p-2 rounded-lg text-gray-400 transition-colors hover:text-red-500 hover:bg-red-50"
                        aria-label="삭제"
                      >
                        <img src={trashcanIcon} alt="" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* 펼쳐지는 로테이션 순서 박스 */}
                  {expandedChoreId === chore.choreId && (
                    <div className="p-3 sm:p-4 mt-3 bg-[#FDF8E7] rounded-xl text-xs sm:text-sm text-gray-700 animate-fade-in">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="font-bold text-gray-900 shrink-0">
                          로테이션 순서:
                        </span>
                        <span className="font-medium text-blue-600 break-all">
                          {rotationMap[chore.choreId]
                            ? rotationMap[chore.choreId].join(" → ")
                            : "불러오는 중..."}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-12 sm:py-16 text-center text-xs sm:text-sm text-gray-400">
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
