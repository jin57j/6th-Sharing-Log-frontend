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
      className={`flex flex-nowrap items-center gap-2 px-3 py-4 sm:flex-wrap sm:gap-4 sm:px-5 ${
        isLastMember
          ? ""
          : "border-b border-[#1A1428]/10"
      }`}
    >
      <span className="order-1 sm:order-none">
        <MemberAvatar
          name={member.displayName}
          memberId={member.membershipId}
          size="responsiveLg"
          isOwner={isOwner}
        />
      </span>

      <div className="order-2 min-w-0 flex-1 sm:order-none">
        <div className="flex flex-nowrap items-center gap-1 sm:flex-wrap sm:gap-2">
          <p className="truncate text-sm font-bold sm:text-base">
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
        className={`order-4 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold sm:order-none sm:px-3 sm:py-1.5 sm:text-[11px] ${
          isOwner
            ? "bg-[#E63946]/10 text-[#E63946]"
            : "bg-[#EFEBE2] text-[#8B8575]"
        }`}
      >
        {isOwner ? "관리자" : "멤버"}
      </span>

      {showManagementButtons && (
        <div className="order-3 flex w-auto shrink-0 justify-end gap-1 sm:order-none sm:gap-2">
          {!isOwner && (
            <button
              type="button"
              onClick={() => onPromote(member)}
              disabled={isActionDisabled}
              className="shrink-0 whitespace-nowrap rounded-lg border border-[#1A1428]/15 bg-white px-2 py-2 text-[11px] font-bold text-[#1A1428] transition-colors hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-xs"
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
            className="shrink-0 whitespace-nowrap rounded-lg border border-[#E63946]/30 bg-white px-2 py-2 text-[11px] font-bold text-[#E63946] transition-colors hover:bg-[#E63946] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-xs"
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
