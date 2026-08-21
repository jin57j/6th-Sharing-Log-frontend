import { useState } from "react";

import useReservation from "./useReservation";

export default function useReservationPage(profile) {
  const [activeTab, setActiveTab] = useState("reservation");

  const {
    group,
    isLoading: isProfileLoading,
    errorMessage: profileErrorMessage,
  } = profile;

  const groupId = group?.groupPublicId ?? "";
  const reservation = useReservation(groupId);
  const selectedSpace = reservation.spaces.find(
    (space) =>
      String(space.spaceId) === String(reservation.selectedSpaceId),
  );

  return {
    status: {
      isLoading: isProfileLoading,
      errorMessage:
        profileErrorMessage ||
        (!groupId ? "참여 중인 하우스가 없습니다." : ""),
    },
    tabs: {
      activeTab,
      onChange: setActiveTab,
    },
    message: reservation.message,
    reservationPanel: {
      form: {
        spaces: reservation.spaces,
        selectedSpaceId: reservation.selectedSpaceId,
        setSelectedSpaceId: reservation.setSelectedSpaceId,
        today: reservation.today,
        selectedDate: reservation.selectedDate,
        setSelectedDate: reservation.setSelectedDate,
        onSubmit: reservation.handleReservation,
      },
      list: {
        selectedDate: reservation.selectedDate,
        selectedSpaceName:
          selectedSpace?.name ?? "공간을 선택해 주세요",
        loading: reservation.loading,
        reservations: reservation.reservations,
        onCancel: reservation.handleCancel,
      },
    },
    managementPanel: {
      spaces: reservation.spaces,
      deletingSpaceId: reservation.deletingSpaceId,
      onAddSpace: reservation.handleAddSpace,
      onDeleteSpace: reservation.handleDeleteSpace,
    },
  };
}
