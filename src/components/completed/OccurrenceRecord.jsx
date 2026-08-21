import MemberInformation from "./MemberInformation";
import { getChoreIcon } from "../../utils/choreUtils";
import {
  hasAction,
  isSubstituteCompletion,
} from "../../utils/completedTaskUtils";
import { formatOccurrenceDateTime } from "../../utils/rotationUtils";

export default function OccurrenceRecord({
  occurrence,
  isProcessing,
  onComplete,
  onUndoComplete,
}) {
  const isCompleted = occurrence.status === "COMPLETED";

  const isOverdue = occurrence.status === "ASSIGNED";

  const isSubstitute = isSubstituteCompletion(occurrence);

  const actualMember = isCompleted
    ? occurrence.completedBy
    : occurrence.currentAssignee;

  return (
    <article className="rounded-2xl border border-[#1A1428]/10 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src={getChoreIcon(occurrence.choreName)}
          alt=""
          className="h-11 w-11 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate font-black">{occurrence.choreName}</h4>

            {isCompleted && (
              <span className="rounded-full bg-[#DDF3E5] px-2 py-1 text-[10px] font-bold text-[#1C6B42]">
                완료
              </span>
            )}

            {isOverdue && (
              <span className="rounded-full bg-[#FFF0E8] px-2 py-1 text-[10px] font-bold text-[#A64A24]">
                미완료
              </span>
            )}

            {isSubstitute && (
              <span className="rounded-full bg-[#E63946]/10 px-2 py-1 text-[10px] font-bold text-[#E63946]">
                대타 완료
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-[#8B8575]">
            마감 {formatOccurrenceDateTime(occurrence)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-[#F8F4EE] p-3">
        <MemberInformation
          label="최초 담당자"
          member={occurrence.originalAssignee}
        />

        <MemberInformation
          label={isCompleted ? "실제 완료자" : "현재 담당자"}
          member={actualMember}
        />
      </div>

      {isSubstitute && (
        <p className="mt-3 rounded-xl bg-[#E63946]/5 px-3 py-2 text-xs font-semibold leading-5 text-[#E63946]">
          최초 담당자와 실제 완료자가 달라 대타로 완료된 업무예요.
        </p>
      )}

      {(hasAction(occurrence, "COMPLETE") ||
        hasAction(occurrence, "UNDO_COMPLETE")) && (
        <div className="mt-4 flex justify-end gap-2">
          {hasAction(occurrence, "COMPLETE") && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onComplete(occurrence)}
              className="rounded-xl bg-[#E63946] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#C92F3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? "처리 중..." : "업무 완료"}
            </button>
          )}

          {hasAction(occurrence, "UNDO_COMPLETE") && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onUndoComplete(occurrence)}
              className="rounded-xl bg-[#EFEBE2] px-4 py-2 text-xs font-bold transition hover:bg-[#E5DED1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? "처리 중..." : "완료 취소"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
