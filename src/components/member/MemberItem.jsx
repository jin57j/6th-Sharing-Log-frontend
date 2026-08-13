import MemberAvatar from "./MemberAvatar";

function MemberItem({
  member,
  actorMembershipId,
  isLastMember,
}) {
  const isOwner =
    member.role === "OWNER";

  const isMe =
    member.membershipId ===
    actorMembershipId;

  return (
    <article
      className={`flex items-center gap-4 px-5 py-4 ${
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
    </article>
  );
}

export default MemberItem;