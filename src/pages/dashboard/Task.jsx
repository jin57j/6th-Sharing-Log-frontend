
import { useState, useEffect } from "react";
import ChoreModal from "../../components/common/ChoreModal";
import { choreApi } from "../../api/choreApi";
import { getCurrentUser } from "../../api/authApi"; 
import { getMyGroup } from "../../api/groupApi";

export default function Task() {
  const [groupId, setGroupId] = useState(null); 
  const [chores, setChores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChore, setEditingChore] = useState(null);

  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        console.log("그룹 정보 요청 시작...");
        const response = await getMyGroup();
        console.log("서버에서 받은 그룹 응답 전체:", response);

        const group = response?.data || response;
        const targetGroupId = group?.groupPublicId;

        if (targetGroupId) {
          setGroupId(targetGroupId);
          console.log("✅ 그룹 ID 세팅 성공:", targetGroupId);
        } else {
          console.error("❌ 그룹 데이터 안에 groupPublicID가 없습니다:", group);
        }
      } catch (error) {
        console.error("❌ 그룹 정보를 가져오는 중 에러 발생:", error);
      }
    };

    fetchUserGroup();
  }, []);

  const loadChores = async (currentGroupId) => {
    try {
      const data = await choreApi.getChores(currentGroupId);
      setChores(data.items || data || []);
    } catch (error) {
      console.error("Failed to fetch chores:", error);
    }
  };

  useEffect(() => {
    if (!groupId) return; 
    loadChores(groupId);
  }, [groupId]);

  const openAddModal = () => {
    setEditingChore(null);
    setIsModalOpen(true);
  };

  const openEditModal = (chore) => {
    setEditingChore(chore);
    setIsModalOpen(true);
  };

  // 🌟 3. 폼 제출 핸들러 (수정 시 version 전달 추가)
  const handleChoreSubmit = async (formData) => {
    if (!groupId) return;

    try {
      if (editingChore) {
        // [수정] - API에 4번째 인자로 버전을 문자열로 전달합니다!
        await choreApi.updateChore(
          groupId, 
          editingChore.choreId, 
          formData, 
          String(editingChore.version) // 👈 기존 데이터의 version 전달
        );
      } else {
        // [생성]
        await choreApi.createChore(groupId, formData);
      }

      await loadChores(groupId); 
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit chore:", error);
    }
  };

  // 🌟 4. 삭제 핸들러 (version 파라미터 추가)
  const handleDelete = async (choreId, version) => { // 👈 version 파라미터 추가
    if (!groupId) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      // API에 3번째 인자로 버전을 문자열로 전달합니다!
      await choreApi.deleteChore(groupId, choreId, String(version)); // 👈 version 전달
      loadChores(groupId); 
    } catch (error) {
      console.error("Failed to delete chore:", error);
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
                    // 🌟 클릭 시 choreId와 함께 version 데이터도 같이 넘겨줍니다!
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
          onClose={() => setIsModalOpen(false)}
          initialData={editingChore}
          onSubmit={handleChoreSubmit}
        />
      )}
    </div>
  );
}