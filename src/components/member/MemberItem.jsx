import MemberAvatar from "./MemberAvatar";

function MemberItem({
  member,
  actorMembershipId,
  canManage,
  isLastMember,
  isPromoting,
  isRemoving,
  isActionDisabled,
  onPromote,
  onRemove,
}) {
  const isOwner =
    member.role === "OWNER";

  const isMe =
    member.membershipId ===
    actorMembershipId;

  // 관리자이면서 자기 자신이 아닌 멤버에게만 관리 버튼을 표시합니다.
  const showManagementButtons =
    canManage && !isMe;

  return (
    <article
      className={`flex flex-wrap items-center gap-4 px-5 py-4 ${
        isLastMember
          ? ""
          : "border-b border-[#1A1428]/10"
      }`}
    >
      <MemberAvatar
        name={member.displayName}
        memberId={member.membershipId}
        size="lg"
        isOwner={isOwner}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-bold">
            {member.displayName ||
              "이름 없는 멤버"}
          </p>

          {isMe && (
            <span className="rounded-full bg-[#EFEBE2] px-2 py-0.5 text-[10px] font-bold text-[#8B8575]">
              나
            </span>
          )}
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${
          isOwner
            ? "bg-[#E63946]/10 text-[#E63946]"
            : "bg-[#EFEBE2] text-[#8B8575]"
        }`}
      >
        {isOwner ? "관리자" : "멤버"}
      </span>

      {showManagementButtons && (
        <div className="ml-16 flex w-full justify-end gap-2 sm:ml-0 sm:w-auto">
          {!isOwner && (
            <button
              type="button"
              onClick={() => onPromote(member)}
              disabled={isActionDisabled}
              className="rounded-lg border border-[#1A1428]/15 bg-white px-3 py-2 text-xs font-bold text-[#1A1428] transition-colors hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPromoting
                ? "승격 중..."
                : "관리자 승격"}
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(member)}
            disabled={isActionDisabled}
            className="rounded-lg border border-[#E63946]/30 bg-white px-3 py-2 text-xs font-bold text-[#E63946] transition-colors hover:bg-[#E63946] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRemoving
              ? "강퇴 중..."
              : "강퇴"}
          </button>
        </div>
      )}
    </article>
  );
}

export default MemberItem;