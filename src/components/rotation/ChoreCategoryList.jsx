import { ChevronRight } from "lucide-react";

import MemberAvatar from "../member/MemberAvatar";
import { FREQUENCY_SECTIONS } from "../../constants/rotation";
import {
  findCurrentOccurrence,
  formatChoreSchedule,
  getOccurrenceAssignee,
} from "../../utils/rotationUtils";
import { getChoreIcon } from "../../utils/choreUtils";

export default function ChoreCategoryList({ chores, occurrences, onOpenCalendar }) {
  return (
    <>
      {FREQUENCY_SECTIONS.map((section) => {
        const sectionChores = chores.filter(
          (chore) => chore.schedule?.frequency === section.value,
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
              {sectionChores.map((chore, index) => {
                const choreOccurrences = occurrences.filter(
                  (occ) => occ.choreId === chore.choreId,
                );
                const nextOccurrence = findCurrentOccurrence(choreOccurrences);
                const nextAssignee = getOccurrenceAssignee(nextOccurrence);

                return (
                  <button
                    key={chore.choreId}
                    type="button"
                    onClick={() => onOpenCalendar(chore)}
                    className={`flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[#F8F4EE] active:bg-[#EFEBE2] ${
                      index === sectionChores.length - 1
                        ? ""
                        : "border-b border-[#1A1428]/10"
                    }`}
                  >
                    <img
                      src={getChoreIcon(chore.name)}
                      alt=""
                      className="h-10 w-10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{chore.name}</p>
                      <p className="mt-1 text-xs text-[#8B8575]">
                        {formatChoreSchedule(chore)}
                      </p>
                    </div>

                    {nextAssignee ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <MemberAvatar
                          name={nextAssignee.displayName}
                          memberId={nextAssignee.membershipId}
                          size="sm"
                        />
                        <span className="hidden max-w-20 truncate text-xs font-semibold sm:block">
                          {nextAssignee.displayName}
                        </span>
                      </div>
                    ) : (
                      <span className="shrink-0 text-xs text-[#8B8575]">
                        담당자 미정
                      </span>
                    )}

                    <ChevronRight
                      size={16}
                      className="shrink-0 text-[#8B8575]"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
