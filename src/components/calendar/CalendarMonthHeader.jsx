import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function CalendarMonthHeader({
  year,
  month,
  canMovePrevious,
  canMoveNext,
  onMovePrevious,
  onMoveNext,
}) {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <p className="font-display text-base font-black">
        {year}년 {month + 1}월
      </p>

      <div className="flex gap-0.5">
        <button
          type="button"
          onClick={onMovePrevious}
          disabled={!canMovePrevious}
          aria-label="이전 달"
          className="rounded-lg p-2 transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ChevronLeft
            size={16}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={onMoveNext}
          disabled={!canMoveNext}
          aria-label="다음 달"
          className="rounded-lg p-2 transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ChevronRight
            size={16}
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}

export default CalendarMonthHeader;
