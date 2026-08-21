import { ChevronRight, History } from "lucide-react";
import { FREQUENCY_SECTIONS } from "../../constants/rotation";
import { getChoreIcon } from "../../utils/choreUtils";

export default function CompletedChoreList({ choreSummaries, onOpenCalendar }) {
  if (choreSummaries.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-[#1A1428]/15 bg-white px-5 py-14 text-center">
        <History size={34} className="mx-auto text-[#8B8575]" aria-hidden="true" />
        <p className="mt-3 text-sm font-bold">표시할 업무 기록이 없어요.</p>
        <p className="mt-1 text-xs leading-5 text-[#8B8575]">
          완료하거나 마감이 지난 업무가 생기면 이곳에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      {FREQUENCY_SECTIONS.map((section) => {
        const sectionChores = choreSummaries.filter(
          (chore) => chore.frequency === section.value,
        );

        if (sectionChores.length === 0) return null;

        return (
          <section key={section.value} className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-black">{section.title}</h2>
              <span className="rounded-full bg-[#EFEBE2] px-2.5 py-1 text-[11px] font-bold text-[#8B8575]">
                {sectionChores.length}개
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm">
              {sectionChores.map((chore, index) => (
                <button
                  key={chore.choreId}
                  type="button"
                  onClick={() => onOpenCalendar(chore)}
                  className={`flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[#F8F4EE] ${
                    index === sectionChores.length - 1
                      ? ""
                      : "border-b border-[#1A1428]/10"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-10 shrink-0 text-center text-3xl leading-none"
                  >
                    {getChoreIcon(
                      chore.name,
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{chore.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-[#8B8575]">
                      <span>완료 {chore.completedCount}건</span>
                      <span>미완료 {chore.overdueCount}건</span>
                      {chore.substituteCount > 0 && (
                        <span className="text-[#E63946]">
                          대타 {chore.substituteCount}건
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={17} className="shrink-0 text-[#8B8575]" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
