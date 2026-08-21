function TaskHeader({ onAdd }) {
  return (
    <div className="mx-auto mb-6 flex max-w-4xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">
          반복과 담당자를 편하게 관리해요
        </p>

        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          업무 관리
        </h1>
      </div>

      <button
        onClick={onAdd}
        className="w-full rounded-full bg-[#C8494C] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b84a4a] active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3 sm:text-base"
      >
        + 업무 추가
      </button>
    </div>
  );
}

export default TaskHeader;
