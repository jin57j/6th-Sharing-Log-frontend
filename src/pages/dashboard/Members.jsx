import { useOutletContext } from "react-router";

import MemberManagementError from "../../components/member/MemberManagementError";
import MemberSearchBar from "../../components/member/MemberSearchBar";
import MembersListSection from "../../components/member/MembersListSection";
import MembersPageHeader from "../../components/member/MembersPageHeader";
import useMembersPage from "../../hooks/useMembersPage";

function Members() {
  const { activeGroup } = useOutletContext();
  const page = useMembersPage(activeGroup);

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-2xl p-5 pb-8 sm:p-8">
        <MembersPageHeader {...page.header} />
        <MemberSearchBar {...page.search} />
        <MemberManagementError errorMessage={page.managementErrorMessage} />
        <MembersListSection {...page.list} />
      </div>
    </div>
  );
}

export default Members;
