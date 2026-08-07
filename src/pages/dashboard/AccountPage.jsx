import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  House,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import DeleteHouseModal from "../../components/account/DeleteHouseModal";
import InformationRow from "../../components/account/InformationRow";
import NicknameEditor from "../../components/account/NicknameEditor";
import { ACCOUNT_TABS } from "../../constants/account";
import useLeaveHouse from "../../hooks/useLeaveHouse";

function AccountPage() {
  const [activeTab, setActiveTab] =
    useState("profile");

  // Layout에서 조회한 공통 사용자·하우스 정보를 받습니다.
  const { profile } = useOutletContext();

  const {
    user,
    group: house,
    isLoading,
    errorMessage: profileErrorMessage,
    updateCurrentUser,
  } = profile;

  const {
    isCheckingMembers,
    isLeaving,
    isDeleting,
    isDeleteModalOpen,
    errorMessage: leaveErrorMessage,
    handleLeaveHouse,
    closeDeleteModal,
    handleConfirmLastMemberDelete,
  } = useLeaveHouse(house);

  if (isLoading) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p
          role="status"
          className="text-sm font-semibold text-[#8B8575]"
        >
          계정 정보를 불러오는 중이에요...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-3xl p-5 pb-8 sm:p-8">
        {/* 페이지 제목 */}
        <header>
          <p className="text-sm text-[#8B8575]">
            내 정보와 참여 중인 하우스를
            관리해요
          </p>

          <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
            <UserRound
              size={27}
              aria-hidden="true"
            />
            계정
          </h1>
        </header>

        {/* 사용자·하우스 정보 조회 오류 */}
        {profileErrorMessage && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
          >
            {profileErrorMessage}
          </p>
        )}

        {/* 계정 화면 탭 */}
        <div
          role="tablist"
          aria-label="계정 정보 메뉴"
          className="mt-8 grid grid-cols-2 rounded-2xl bg-[#EFEBE2] p-1"
        >
          {ACCOUNT_TABS.map((tab) => {
            const isActive =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-white text-[#E63946] shadow-sm"
                    : "text-[#8B8575] hover:text-[#1A1428]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 내 정보 탭 */}
        {activeTab === "profile" && (
          <section
            role="tabpanel"
            className="mt-5 rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <UserRound
                size={21}
                aria-hidden="true"
              />

              <h2 className="text-lg font-black">
                내 정보
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#8B8575]">
              닉네임을 변경하거나 로그인
              계정 정보를 확인할 수 있어요.
            </p>

            <div className="mt-5">
              {user ? (
                <>
                  {/* 닉네임 조회 및 수정 */}
                  <NicknameEditor
                    nickname={user.nickname}
                    onUpdated={
                      updateCurrentUser
                    }
                  />

                  {/* 이메일은 조회만 가능합니다. */}
                  <InformationRow
                    icon={Mail}
                    label="이메일"
                    value={
                      user.email ||
                      "이메일 정보가 없어요"
                    }
                  />
                </>
              ) : (
                <p className="rounded-xl bg-[#F8F4EE] px-4 py-5 text-center text-sm font-semibold text-[#8B8575]">
                  사용자 정보를 불러오지
                  못했어요.
                </p>
              )}
            </div>
          </section>
        )}

        {/* 하우스 정보 탭 */}
        {activeTab === "house" && (
          <div role="tabpanel">
            <section className="mt-5 rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <House
                  size={21}
                  aria-hidden="true"
                />

                <h2 className="text-lg font-black">
                  하우스 정보
                </h2>
              </div>

              <p className="mt-1 text-sm text-[#8B8575]">
                현재 참여 중인 하우스 정보를
                확인할 수 있어요.
              </p>

              {house ? (
                <div className="mt-5">
                  <InformationRow
                    icon={House}
                    label="하우스 이름"
                    value={house.groupName}
                  />

                  <InformationRow
                    icon={MapPin}
                    label="주소"
                    value={
                      house.groupAddress ||
                      "등록된 주소가 없어요"
                    }
                  />

                  <InformationRow
                    icon={ShieldCheck}
                    label="내 역할"
                    value={
                      house.role === "OWNER"
                        ? "관리자"
                        : "멤버"
                    }
                  />
                </div>
              ) : (
                <p className="mt-5 rounded-xl bg-[#F8F4EE] px-4 py-5 text-center text-sm font-semibold text-[#8B8575]">
                  참여 중인 하우스가 없어요.
                </p>
              )}
            </section>

            {/* 하우스 탈퇴 영역 */}
            {house && (
              <section className="mt-5 rounded-2xl border border-[#E63946]/20 bg-white p-6">
                <h2 className="text-lg font-black text-[#E63946]">
                  하우스 탈퇴
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8B8575]">
                  하우스를 탈퇴하면 해당
                  하우스의 업무, 일정 및 예약
                  정보를 확인할 수 없어요. 계정
                  자체는 삭제되지 않습니다.
                </p>

                {leaveErrorMessage &&
                  !isDeleteModalOpen && (
                    <p
                      role="alert"
                      className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
                    >
                      {leaveErrorMessage}
                    </p>
                  )}

                <button
                  type="button"
                  onClick={handleLeaveHouse}
                  disabled={
                    !house ||
                    isCheckingMembers ||
                    isLeaving ||
                    isDeleting
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E63946] bg-white py-3.5 text-sm font-bold text-[#E63946] transition hover:bg-[#E63946] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                >
                  <LogOut
                    size={17}
                    aria-hidden="true"
                  />

                  {isCheckingMembers
                    ? "구성원 확인 중..."
                    : isLeaving
                      ? "탈퇴하는 중..."
                      : "하우스 탈퇴하기"}
                </button>
              </section>
            )}
          </div>
        )}
      </div>

      {/* 마지막 구성원일 때만 표시되는 삭제 확인창 */}
      {isDeleteModalOpen && house && (
        <DeleteHouseModal
          houseName={house.groupName}
          isDeleting={isDeleting}
          errorMessage={
            leaveErrorMessage
          }
          onClose={closeDeleteModal}
          onConfirm={
            handleConfirmLastMemberDelete
          }
        />
      )}
    </div>
  );
}

export default AccountPage;