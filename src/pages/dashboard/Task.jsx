import ChoreModal from "../../components/common/ChoreModal";
import useTasks from "../../hooks/useTasks";

export default function Task() {
  // 🌟 분리된 훅에서 필요한 데이터와 핸들러를 꺼내옵니다.
  const {
    chores,
    isModalOpen,
    editingChore,
    openAddModal,
    openEditModal,
    closeModal,
    handleChoreSubmit,
    handleDelete,
  } = useTasks();

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
          <div className="flex gap-4 text-sm font-bold text-gray-500">
            <span>반복</span>
            <span>관리</span>
          </div>
        </div>

        {chores.length > 0 ? (
          <ul>
            {chores.map((chore) => (
              <li
                key={chore.choreId}
                className="flex items-center justify-between px-6 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🧹</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{chore.name}</h3>
                    <p className="text-xs text-gray-400">
                      마감 정보 연동 필요 · 로테이션 4명
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

                  <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-red-400 rounded-full">
                    김
                  </div>

                  <button
                    onClick={() => openEditModal(chore)}
                    className="p-2 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(chore.choreId, chore.version)}
                    className="p-2 text-gray-400 transition-colors hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
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
          onClose={closeModal} // 👈 훅에서 가져온 닫기 함수 연결
          initialData={editingChore}
          onSubmit={handleChoreSubmit}
        />
      )}
    </div>
  );
}