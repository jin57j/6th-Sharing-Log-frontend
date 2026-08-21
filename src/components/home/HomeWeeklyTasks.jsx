import WeeklyTaskCarousel from "./WeeklyTaskCarousel";

function HomeWeeklyTasks({ groupId, tasks, onComplete, onRequestSubstitute }) {
  return (
    <section className="mb-12">
      <header className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="mb-1 flex items-center gap-1.5 text-xl font-bold">
            이번 주 내 업무
          </h2>
        </div>
        <span className="rounded-full bg-[#FCE8E8] px-3.5 py-1.5 text-[13px] font-bold text-[#D9534F]">
          {tasks.length}개 남음
        </span>
      </header>

      {tasks.length > 0 ? (
        <WeeklyTaskCarousel
          key={groupId}
          tasks={tasks}
          onComplete={onComplete}
          onRequestSubstitute={onRequestSubstitute}
        />
      ) : (
        <div className="rounded-[20px] border border-gray-100 bg-white py-10 text-center shadow-sm">
          <p className="font-bold text-gray-500">
            이번 주 배정된 업무가 없습니다 🎉
          </p>
        </div>
      )}
    </section>
  );
}

export default HomeWeeklyTasks;
