function CalendarScopeTabs({
  calendarTab,
  onChange,
}) {
  return (
    <div className="mt-5 flex rounded-2xl bg-[#EFEBE2] p-1.5">
      <button
        type="button"
        onClick={() => onChange("mine")}
        className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
          calendarTab === "mine"
            ? "bg-white text-[#E63946] shadow-sm"
            : "text-[#8B8575]"
        }`}
      >
        내 일정
      </button>

      <button
        type="button"
        onClick={() => onChange("all")}
        className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
          calendarTab === "all"
            ? "bg-white text-[#E63946] shadow-sm"
            : "text-[#8B8575]"
        }`}
      >
        전체 일정
      </button>
    </div>
  );
}

export default CalendarScopeTabs;
