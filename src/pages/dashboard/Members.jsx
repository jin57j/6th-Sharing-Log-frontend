import { useOutletContext } from "react-router";
import { Users } from "lucide-react";

import MemberItem from "../../components/member/MemberItem";
import useMembers from "../../hooks/useMembers";

function Members() {
  // Layout에서 전달한 현재 하우스 정보를 가져옵니다.
  const { activeGroup } = useOutletContext();

  const groupId = activeGroup?.groupPublicId ?? "";
  const houseName = activeGroup?.groupName ?? "현재 하우스";

  const {
    members,
    sortedMembers,
    actorMembershipId,
    ownerCount,
    isLoading,
    errorMessage,
  } = useMembers(groupId);

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-2xl p-5 pb-8 sm:p-8">
        {/* 페이지 제목 */}
        <header>
          <p className="text-sm text-[#8B8575]">{houseName}</p>

          <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
            <Users size={28} aria-hidden="true" />
            멤버
          </h1>
        </header>

        {/* 전체 멤버 수와 관리자 수 */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#EFEBE2] px-3 py-1.5 text-xs font-bold text-[#8B8575]">
            전체 {members.length}명
          </span>

          <span className="rounded-full bg-[#E63946]/10 px-3 py-1.5 text-xs font-bold text-[#E63946]">
            관리자 {ownerCount}명
          </span>
        </div>

        {/* 멤버 목록을 불러오는 중인 상태 */}
        {isLoading && (
          <div className="mt-6 rounded-2xl border border-[#1A1428]/10 bg-white px-5 py-12 text-center">
            <p
              role="status"
              className="text-sm font-semibold text-[#8B8575]"
            >
              멤버 목록을 불러오는 중이에요...
            </p>
          </div>
        )}

        {/* 멤버 목록 조회 실패 상태 */}
        {!isLoading && errorMessage && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-[#E63946]/20 bg-[#E63946]/5 px-5 py-5"
          >
            <p className="text-sm font-semibold leading-6 text-[#E63946]">
              {errorMessage}
            </p>
          </div>
        )}

        {/* 멤버가 없는 상태 */}
        {!isLoading && !errorMessage && sortedMembers.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#1A1428]/15 bg-white px-5 py-12 text-center">
            <Users
              size={34}
              className="mx-auto text-[#8B8575]"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-bold">
              아직 표시할 멤버가 없어요.
            </p>
          </div>
        )}

        {/* 하우스 멤버 목록 */}
        {!isLoading && !errorMessage && sortedMembers.length > 0 && (
          <section
            aria-label="하우스 멤버 목록"
            className="mt-6 overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm"
          >
            {sortedMembers.map((member, index) => (
              <MemberItem
                key={member.membershipId}
                member={member}
                index={index}
                actorMembershipId={actorMembershipId}
                isLastMember={index === sortedMembers.length - 1}
              />
            ))}
          </section>
        )}

        {/* 멤버 목록 아래 안내 문구 */}
        {!isLoading && !errorMessage && sortedMembers.length > 0 && (
          <p className="mt-4 text-center text-xs text-[#8B8575]">
            초대 코드로 새로운 멤버를 초대할 수 있어요.
          </p>
        )}
      </div>
    </div>
  );
}

export default Members;