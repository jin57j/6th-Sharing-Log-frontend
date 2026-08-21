import {
  formatOccurrenceDateTime,
  getOccurrenceAssignee,
} from "../../utils/rotationUtils";
import MemberAvatar from "../member/MemberAvatar";

function ChoreAssignmentSummary({ currentOccurrence, actorMembershipId }) {
  const currentAssignee = getOccurrenceAssignee(currentOccurrence);

  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-4">
        <p className="text-[11px] font-bold text-[#8B8575]">다음 마감</p>
        <p className="mt-1.5 text-sm font-black text-[#E63946] sm:text-base">
          {formatOccurrenceDateTime(currentOccurrence)}
        </p>
      </section>

      <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-4">
        <p className="text-[11px] font-bold text-[#8B8575]">현재 담당자</p>
        {currentAssignee ? (
          <div className="mt-1.5 flex min-w-0 items-center gap-2">
            <MemberAvatar
              name={currentAssignee.displayName}
              memberId={currentAssignee.membershipId}
              size="sm"
            />
            <p className="truncate text-sm font-bold">
              {currentAssignee.displayName}
              {currentAssignee.membershipId === actorMembershipId
                ? " (나)"
                : ""}
            </p>
          </div>
        ) : (
          <p className="mt-1.5 text-sm font-semibold text-[#8B8575]">
            담당자 미정
          </p>
        )}
      </section>
    </div>
  );
}

export default ChoreAssignmentSummary;
