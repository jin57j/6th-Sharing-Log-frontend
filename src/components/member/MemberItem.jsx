import { Star } from "lucide-react";
import { AVATAR_COLORS } from "../../constants/member";
import { getInitial } from "../../utils/memberUtils";

export default function MemberItem({
  member,
  index,
  actorMembershipId,
  isLastMember,
}) {
  const isOwner = member.role === "OWNER";
  const isMe = member.membershipId === actorMembershipId;
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <article
      className={`flex items-center gap-4 px-5 py-4 ${
        isLastMember ? "" : "border-b border-[#1A1428]/10"
      }`}
    >
      {/* 멤버 프로필 아이콘 */}
      <div className="relative shrink-0">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-base font-black text-white"
          style={{ backgroundColor: avatarColor }}
          aria-hidden="true"
        >
          {getInitial(member.displayName)}
        </span>

        {/* 관리자 프로필에는 별 아이콘을 표시합니다. */}
        {isOwner && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#E63946] text-white shadow-sm">
            <Star size={10} fill="currentColor" aria-hidden="true" />
          </span>
        )}
      </div>

      {/* 멤버 닉네임 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-bold">
            {member.displayName || "이름 없는 멤버"}
          </p>

          {/* 현재 로그인한 사용자에게 '나'를 표시합니다. */}
          {isMe && (
            <span className="rounded-full bg-[#EFEBE2] px-2 py-0.5 text-[10px] font-bold text-[#8B8575]">
              나
            </span>
          )}
        </div>
      </div>

      {/* 관리자 또는 일반 멤버 역할 표시 */}
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