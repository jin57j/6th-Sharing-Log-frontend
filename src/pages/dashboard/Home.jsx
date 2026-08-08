import { useNavigate, useOutletContext } from "react-router";
import { LuBell } from "react-icons/lu";

import NoticeItem from "../../components/common/NoticeItem";
import TaskCard from "../../components/common/TaskCard";
import useTasks from "../../hooks/useTasks";
import { mockNotices } from "../../mocks/homeData";
import { getFormattedToday } from "../../utils/date";

function Home() {
  const today = getFormattedToday();
  const navigate = useNavigate();

  // Layout이 전달한 사용자 정보를 받습니다.
  const {
    profile,
    activeGroup,
  } = useOutletContext();

  const { nickname, isLoading: isProfileLoading } = profile;

  const { chores: tasks } = useTasks(
    activeGroup?.groupPublicId ?? "",
  );

  const handleCompleteTask = () => {
    console.log("홈 화면 완료 기능은 API 연동 필요");
  };

  // 정보를 불러오는 중에는 자연스러운 기본 문구를 표시합니다.
  const greetingName = isProfileLoading ? "사용자" : nickname || "사용자";

  return (
    <div className="min-h-screen bg-[#F7F4EF] px-5 py-10">
      {/* 상단 헤더 */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm text-[#888]">{today}</p>

          <h1 className="text-[28px] font-black text-[#222]">
            안녕하세요, {greetingName}님 👋
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/notification")}
          aria-label="알림 보기"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
        >
          <LuBell className="h-[18px] w-[18px]" />
        </button>
      </header>

      {/* 업무 섹션 */}
      <section className="mb-12">
        <header className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-1.5 text-lg font-bold">
              <span className="text-xs text-[#E53E3E]">🔴</span>
              오늘과 이번 주, 내 업무
            </h2>

            <p className="text-[13px] text-[#888]">
              완료하면 홈에서 사라지고 완료 업무에서 다시 볼 수 있어요.
            </p>
          </div>

          <span className="rounded-full bg-[#FCE8E8] px-3.5 py-1.5 text-[13px] font-bold text-[#D9534F]">
            {tasks.length}개 남음
          </span>
        </header>

        <ul className="flex gap-4 overflow-x-auto pb-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
            />
          ))}
        </ul>
      </section>

      {/* 공지 섹션 */}
      <section>
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">최근 공지</h2>

          <button
            type="button"
            onClick={() => navigate("/notice")}
            className="cursor-pointer bg-transparent text-[14px] font-bold text-[#D9534F]"
          >
            전체 보기
          </button>
        </header>

        <ul className="overflow-hidden rounded-[16px] border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {mockNotices.map((notice, index) => (
            <NoticeItem
              key={notice.id}
              notice={notice}
              isLast={index === mockNotices.length - 1}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
