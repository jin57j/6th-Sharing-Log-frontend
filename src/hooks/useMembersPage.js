import { useState } from "react";

import useMembers from "./useMembers";
import usePromoteMember from "./usePromoteMember";
import useRemoveMember from "./useRemoveMember";
import { filterMembersByKeyword } from "../utils/memberUtils";

export default function useMembersPage(activeGroup) {
  const [searchKeyword, setSearchKeyword] = useState("");

  const groupId = activeGroup?.groupPublicId ?? "";
  const houseName = activeGroup?.groupName ?? "현재 하우스";
  const membersState = useMembers(groupId);
  const promoteState = usePromoteMember({
    groupPublicId: groupId,
    onSuccess: membersState.updateMemberRole,
  });
  const removeState = useRemoveMember({
    groupPublicId: groupId,
    onSuccess: membersState.removeMember,
  });

  const filteredMembers = filterMembersByKeyword(
    membersState.sortedMembers,
    searchKeyword,
  );
  const isManagingMember = Boolean(
    promoteState.promotingMembershipId || removeState.removingMembershipId,
  );

  return {
    header: {
      houseName,
      memberCount: membersState.members.length,
      ownerCount: membersState.ownerCount,
    },
    search: {
      searchKeyword,
      setSearchKeyword,
      isDisabled:
        membersState.isLoading || Boolean(membersState.errorMessage),
    },
    managementErrorMessage:
      promoteState.errorMessage || removeState.errorMessage,
    list: {
      members: filteredMembers,
      actorMembershipId: membersState.actorMembershipId,
      canManage: membersState.canManage,
      isLoading: membersState.isLoading,
      errorMessage: membersState.errorMessage,
      hasMembers: membersState.sortedMembers.length > 0,
      hasSearchResult: filteredMembers.length > 0,
      promotingMembershipId: promoteState.promotingMembershipId,
      removingMembershipId: removeState.removingMembershipId,
      isManagingMember,
      onPromote: promoteState.handlePromote,
      onRemove: removeState.handleRemove,
    },
  };
}
