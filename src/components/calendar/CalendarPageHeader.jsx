function CalendarPageHeader({
  houseName,
  embedded,
}) {
  return (
    <header className="mb-5 flex items-end justify-between">
      <div>
        <h2
          className={`mb-1 flex items-center gap-1.5 font-bold ${
            embedded
              ? "text-xl"
              : "text-lg"
          }`}
        >
          달력
        </h2>

        <p className="text-[13px] text-[#888]">
          {houseName}의 업무 일정
        </p>
      </div>
    </header>
  );
}

export default CalendarPageHeader;
