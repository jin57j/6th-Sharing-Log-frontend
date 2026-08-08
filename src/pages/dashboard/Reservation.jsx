import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  CalendarDays,
  Settings2,
} from "lucide-react";

import ReservationForm from "../../components/reservation/ReservationForm";
import ReservationList from "../../components/reservation/ReservationList";
import SpaceForm from "../../components/reservation/SpaceForm";
import useReservation from "../../hooks/useReservation";

const RESERVATION_TABS = [
  {
    id: "reservation",
    label: "공간 예약",
    icon: CalendarDays,
  },
  {
    id: "management",
    label: "공간 관리",
    icon: Settings2,
  },
];

function Reservation() {
  const [activeTab, setActiveTab] =
    useState("reservation");

  // Layout에서 조회한 현재 하우스 정보를 받습니다.
  const { profile } =
    useOutletContext();

  const {
    group,
    isLoading:
      isProfileLoading,
    errorMessage:
      profileErrorMessage,
  } = profile;

  const groupId =
    group?.groupPublicId ?? "";

  const reservationState =
    useReservation(groupId);

  if (isProfileLoading) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p
          role="status"
          className="text-sm font-semibold text-[#8B8575]"
        >
          하우스 정보를 불러오는
          중이에요...
        </p>
      </div>
    );
  }

  if (
    profileErrorMessage ||
    !groupId
  ) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p
          role="alert"
          className="rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold text-[#E63946]"
        >
          {profileErrorMessage ||
            "참여 중인 하우스가 없습니다."}
        </p>
      </div>
    );
  }

  const {
    today,

    spaces,
    selectedSpaceId,
    setSelectedSpaceId,

    selectedDate,
    setSelectedDate,

    reservations,
    loading,
    message,

    deletingSpaceId,

    handleAddSpace,
    handleDeleteSpace,
    handleReservation,
    handleCancel,
  } = reservationState;

  const selectedSpace =
    spaces.find(
      (space) =>
        String(space.spaceId) ===
        String(
          selectedSpaceId,
        ),
    );

  return (
    <main className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-4xl p-5 pb-8 sm:p-8">
        {/* 페이지 제목 */}
        <header>
          <p className="text-sm text-[#8B8575]">
            우리 집 공용공간을 겹치지
            않게
          </p>

          <h1 className="mt-1 font-display text-[30px] font-black tracking-[-0.03em]">
            공간 예약
          </h1>
        </header>

        {/* 공간 예약·공간 관리 탭 */}
        <div
          role="tablist"
          aria-label="공간 예약 메뉴"
          className="mt-7 grid grid-cols-2 rounded-2xl bg-[#EFEBE2] p-1"
        >
          {RESERVATION_TABS.map(
            (tab) => {
              const Icon = tab.icon;

              const isActive =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={
                    isActive
                  }
                  onClick={() =>
                    setActiveTab(
                      tab.id,
                    )
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-[#E63946] shadow-sm"
                      : "text-[#8B8575] hover:text-[#1A1428]"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={
                      isActive
                        ? 2.5
                        : 2
                    }
                    aria-hidden="true"
                  />

                  {tab.label}
                </button>
              );
            },
          )}
        </div>

        {/* 요청 성공 및 오류 메시지 */}
        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-[#E63946]/15 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold text-[#1A1428]"
          >
            {message}
          </p>
        )}

        {/* 공간 예약 탭 */}
        {activeTab ===
          "reservation" && (
          <div
            role="tabpanel"
            className="mt-6 space-y-6"
          >
            <ReservationForm
              spaces={spaces}
              selectedSpaceId={
                selectedSpaceId
              }
              setSelectedSpaceId={
                setSelectedSpaceId
              }
              today={today}
              selectedDate={
                selectedDate
              }
              setSelectedDate={
                setSelectedDate
              }
              onSubmit={
                handleReservation
              }
            />

            <ReservationList
              selectedDate={
                selectedDate
              }
              selectedSpaceName={
                selectedSpace?.name ??
                "공간을 선택해 주세요"
              }
              loading={loading}
              reservations={
                reservations
              }
              onCancel={
                handleCancel
              }
            />
          </div>
        )}

        {/* 공간 관리 탭 */}
        {activeTab ===
          "management" && (
          <div
            role="tabpanel"
            className="mt-6"
          >
            <SpaceForm
              spaces={spaces}
              deletingSpaceId={
                deletingSpaceId
              }
              onAddSpace={
                handleAddSpace
              }
              onDeleteSpace={
                handleDeleteSpace
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default Reservation;