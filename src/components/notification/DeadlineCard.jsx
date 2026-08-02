import { Clock3 } from "lucide-react";
import { formatRemainingTime } from "../../utils/date";

export default function DeadlineCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-[#1A1428]/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FFB703]/20 text-[#D28A00]">
          <Clock3 size={21} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-[#1A1428]">{item.choreName}</h3>
            <span className="shrink-0 text-sm font-bold text-[#E63946]">
              {formatRemainingTime(item.dueAt)}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-[#8B8575]">
            담당 업무의 마감 시간이 가까워지고 있어요.
          </p>
        </div>
      </div>
    </button>
  );
}