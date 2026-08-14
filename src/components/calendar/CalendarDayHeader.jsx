import { CALENDAR_DAY_LABELS } from "../../utils/calendarUtils";

export default function CalendarDayHeader() {
  return (
    <div className="grid grid-cols-7 border-t border-[#1A1428]/10 px-3 pb-1 pt-3">
      {CALENDAR_DAY_LABELS.map((dayLabel, index) => (
        <p
          key={dayLabel}
          className={`text-center text-[11px] font-semibold ${
            index === 0
              ? "text-[#E63946]/70"
              : index === 6
                ? "text-blue-400/80"
                : "text-[#8B8575]"
          }`}
        >
          {dayLabel}
        </p>
      ))}
    </div>
  );
}