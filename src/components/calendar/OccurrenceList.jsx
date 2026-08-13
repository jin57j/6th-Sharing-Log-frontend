import {
  Clock3,
} from "lucide-react";

import {
  FREQUENCY_LABELS,
} from "../../constants/calendar";
import {
  parseDateKey,
} from "../../utils/calendarUtils";
import MemberAvatar from "../member/MemberAvatar";

// 백엔드가 보내준 dueAt을 사용자가 보기 좋은 시간으로 바꿉니다.
function formatDueTime(
  dueAt,
  timeZone,
) {
  if (!dueAt) {
    return "시간 미정";
  }

  const dueDate = new Date(dueAt);

  if (
    Number.isNaN(dueDate.getTime())
  ) {
    return "시간 미정";
  }

  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      timeZone:
        timeZone || "Asia/Seoul",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  ).format(dueDate);
}

function OccurrenceList({
  selectedDateKey,
  selectedOccurrences,
  actorMembershipId,
  calendarTab,
}) {
  const selectedDate =
    parseDateKey(selectedDateKey);

  return (
    <div className="border-t border-[#1A1428]/10 px-5 py-4">
      {/* 선택한 날짜 */}
      <p className="mb-3 text-xs font-bold text-[#8B8575]">
        {selectedDate?.getMonth() + 1}
        월{" "}
        {selectedDate?.getDate()}
        일
      </p>

      {selectedOccurrences.length >
      0 ? (
        <div className="space-y-3">
          {selectedOccurrences.map(
            (occurrence) => {
              const assignee =
                occurrence.currentAssignee;

              const isMine =
                assignee?.membershipId ===
                actorMembershipId;

              const frequencyLabel =
                FREQUENCY_LABELS[
                  occurrence.frequency
                ] ?? "반복";

              const dueTime =
                formatDueTime(
                  occurrence.dueAt,
                  occurrence.timeZoneIdSnapshot,
                );

              return (
                <article
                  key={
                    occurrence.occurrenceId
                  }
                  className="flex items-center gap-3 rounded-xl bg-[#F8F4EE] px-4 py-3"
                >
                  {/* 업무 이름과 일정 정보 */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {
                        occurrence.choreName
                      }
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8B8575]">
                      <span>
                        {frequencyLabel} 업무
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-[#8B8575]/40"
                      >
                        ·
                      </span>

                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Clock3
                          size={12}
                          aria-hidden="true"
                        />

                        마감 {dueTime}
                      </span>
                    </div>
                  </div>

                  {/* 담당자 정보 */}
                  {assignee ? (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <MemberAvatar
                        name={
                          assignee.displayName
                        }
                        memberId={
                          assignee.membershipId
                        }
                        size="sm"
                      />

                      <span className="max-w-24 truncate text-xs font-semibold">
                        {
                          assignee.displayName
                        }
                        {isMine
                          ? " (나)"
                          : ""}
                      </span>
                    </div>
                  ) : (
                    <span className="shrink-0 text-xs text-[#8B8575]">
                      담당자 미정
                    </span>
                  )}
                </article>
              );
            },
          )}
        </div>
      ) : (
        <p className="text-sm text-[#8B8575]">
          {calendarTab === "mine"
            ? "내 업무가 없는 날이에요."
            : "업무가 없는 날이에요."}
        </p>
      )}
    </div>
  );
}

export default OccurrenceList;