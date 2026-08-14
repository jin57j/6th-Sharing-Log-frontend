import { useState } from "react";
import { useOutletContext } from "react-router";
import { Search, Users } from "lucide-react";

import MemberItem from "../../components/member/MemberItem";
import MemberSearchBar from "../../components/member/MemberSearchBar";
import useMembers from "../../hooks/useMembers";
import usePromoteMember from "../../hooks/usePromoteMember";
import useRemoveMember from "../../hooks/useRemoveMember";

function Members() {
  const { activeGroup } = useOutletContext();
  const [searchKeyword, setSearchKeyword] = useState("");

  const groupId = activeGroup?.groupPublicId ?? "";
  const houseName = activeGroup?.groupName ?? "현재 하우스";

  const {
    members,
    sortedMembers,
    actorMembershipId,
    canManage,
    ownerCount,
    isLoading,
    errorMessage,
    updateMemberRole,
    removeMember,
  } = useMembers(groupId);

  const {
    promotingMembershipId,
    errorMessage: promoteErrorMessage,
    handlePromote,
  } = usePromoteMember({
    groupPublicId: groupId,
    onSuccess: updateMemberRole,
  });

  const {
    removingMembershipId,
    errorMessage: removeErrorMessage,
    handleRemove,
  } = useRemoveMember({
    groupPublicId: groupId,
    onSuccess: removeMember,
  });

  const isManagingMember = Boolean(
    promotingMembershipId || removingMembershipId,
  );

  const managementErrorMessage = promoteErrorMessage || removeErrorMessage;

  // 검색어 앞뒤의 공백을 제거하고 소문자로 변경합니다.
  const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();

  // 정렬된 멤버 중 닉네임에 검색어가 포함된 멤버만 남깁니다.
  const filteredMembers = sortedMembers.filter((member) => {
    const displayName = member.displayName?.trim().toLowerCase() ?? "";
    return displayName.includes(normalizedSearchKeyword);
  });

  const hasMembers = sortedMembers.length > 0;
  const hasSearchResult = filteredMembers.length > 0;

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-2xl p-5 pb-8 sm:p-8">
        <header>
          <p className="text-sm text-[#8B8575]">{houseName}의 참여 멤버</p>

          <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
            <Users size={28} aria-hidden="true" />
            멤버
          </h1>
        </header>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#EFEBE2] px-3 py-1.5 text-xs font-bold text-[#8B8575]">
            전체 {members.length}명
          </span>

          <span className="rounded-full bg-[#E63946]/10 px-3 py-1.5 text-xs font-bold text-[#E63946]">
            관리자 {ownerCount}명
          </span>
        </div>

        {/* 멤버 닉네임 검색창 */}
        <MemberSearchBar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          isDisabled={isLoading || Boolean(errorMessage)}
        />

        {managementErrorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-[#E63946]/20 bg-[#E63946]/5 px-5 py-4"
          >
            <p className="text-sm font-semibold leading-6 text-[#E63946]">
              {managementErrorMessage}
            </p>
          </div>
        )}

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

        {/* 하우스에 멤버가 없는 경우 */}
        {!isLoading && !errorMessage && !hasMembers && (
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

        {/* 멤버는 있지만 검색 결과가 없는 경우 */}
        {!isLoading && !errorMessage && hasMembers && !hasSearchResult && (
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
        )}

        {/* 검색된 멤버 목록 */}
        {!isLoading && !errorMessage && hasSearchResult && (
          <section
            aria-label="하우스 멤버 목록"
            className="mt-6 overflow-hidden rounded-2xl border border-[#1A1428]/10 bg-white shadow-sm"
          >
            {filteredMembers.map((member, index) => (
              <MemberItem
                key={member.membershipId}
                member={member}
                actorMembershipId={actorMembershipId}
                canManage={canManage}
                isLastMember={index === filteredMembers.length - 1}
                isPromoting={promotingMembershipId === member.membershipId}
                isRemoving={removingMembershipId === member.membershipId}
                isActionDisabled={isManagingMember}
                onPromote={handlePromote}
                onRemove={handleRemove}
              />
            ))}
          </section>
        )}

        {!isLoading && !errorMessage && hasMembers && (
          <p className="mt-4 text-center text-xs text-[#8B8575]">
            초대 코드로 새로운 멤버를 초대할 수 있어요.
          </p>
        )}
      </div>
    </div>
  );
}

export default Members;