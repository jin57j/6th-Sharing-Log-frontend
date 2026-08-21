import { Search, Users } from "lucide-react";

import MemberItem from "./MemberItem";

function MemberInviteHint() {
  return (
    <p className="mt-4 text-center text-xs text-[#8B8575]">
      초대 코드로 새로운 멤버를 초대할 수 있어요.
    </p>
  );
}

function MembersListSection({
  members,
  actorMembershipId,
  canManage,
  isLoading,
  errorMessage,
  hasMembers,
  hasSearchResult,
  promotingMembershipId,
  removingMembershipId,
  isManagingMember,
  onPromote,
  onRemove,
}) {
  if (isLoading) {
    return (
      <div className="mt-6 rounded-2xl border border-[#1A1428]/10 bg-white px-5 py-12 text-center">
        <p role="status" className="text-sm font-semibold text-[#8B8575]">
          멤버 목록을 불러오는 중이에요...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="mt-6 rounded-2xl border border-[#E63946]/20 bg-[#E63946]/5 px-5 py-5"
      >
        <p className="text-sm font-semibold leading-6 text-[#E63946]">
          {errorMessage}
        </p>
      </div>
    );
  }

  if (!hasMembers) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-[#1A1428]/15 bg-white px-5 py-12 text-center">
        <Users
          size={34}
          className="mx-auto text-[#8B8575]"
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-bold">아직 표시할 멤버가 없어요.</p>
      </div>
    );
  }

  if (!hasSearchResult) {
    return (
      <>
        <div className="mt-6 rounded-2xl border border-dashed border-[#1A1428]/15 bg-white px-5 py-12 text-center">
          <Search
            size={32}
            className="mx-auto text-[#8B8575]"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-bold">검색 결과가 없어요.</p>
          <p className="mt-1 text-xs text-[#8B8575]">
            다른 닉네임으로 검색해 주세요.
          </p>
        </div>
        <MemberInviteHint />
      </>
    );
  }

  return (
    <>
      <section
        aria-label="하우스 멤버 목록"
        className="mt-6 overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm"
      >
        {members.map((member, index) => (
          <MemberItem
            key={member.membershipId}
            member={member}
            actorMembershipId={actorMembershipId}
            canManage={canManage}
            isLastMember={index === members.length - 1}
            isPromoting={promotingMembershipId === member.membershipId}
            isRemoving={removingMembershipId === member.membershipId}
            isActionDisabled={isManagingMember}
            onPromote={onPromote}
            onRemove={onRemove}
          />
        ))}
      </section>

      <MemberInviteHint />
    </>
  );
}

export default MembersListSection;
