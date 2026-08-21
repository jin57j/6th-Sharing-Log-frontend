import useLeaveHouse from "./useLeaveHouse";

function useAccountPage(profile) {
  const {
    user,
    group: house,
    isLoading,
    errorMessage,
    updateCurrentUser,
    updateCurrentGroup,
  } = profile;

  const leaveHouse =
    useLeaveHouse(house);

  const isOwner =
    house?.role === "OWNER";

  return {
    status: {
      isLoading,
      errorMessage,
    },

    userInformation: {
      user,
      onUpdated: updateCurrentUser,
    },

    house,
    isOwner,
    hasSelectedHouse: Boolean(
      house?.groupPublicId,
    ),

    houseInformation: {
      house,
      onUpdated: updateCurrentGroup,
      actions: {
        isCheckingMembers:
          leaveHouse.isCheckingMembers,
        isLeaving:
          leaveHouse.isLeaving,
        isDeleting:
          leaveHouse.isDeleting,
        isDeleteModalOpen:
          leaveHouse.isDeleteModalOpen,
        errorMessage:
          leaveHouse.errorMessage,
        onLeave:
          leaveHouse.handleLeaveHouse,
        onOpenDelete:
          leaveHouse.openDeleteModal,
      },
    },

    deleteModal:
      leaveHouse.isDeleteModalOpen &&
      house
        ? {
            houseName:
              house.groupName,
            deleteMode:
              leaveHouse.deleteMode,
            isDeleting:
              leaveHouse.isDeleting,
            errorMessage:
              leaveHouse.errorMessage,
            onClose:
              leaveHouse.closeDeleteModal,
            onConfirm:
              leaveHouse.handleConfirmDelete,
          }
        : null,
  };
}

export default useAccountPage;
