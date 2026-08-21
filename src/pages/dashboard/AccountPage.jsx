import { useOutletContext } from "react-router";
import {
  House,
  LogOut,
  Mail,
  MapPin,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import DeleteHouseModal from "../../components/account/DeleteHouseModal";
import HouseInformationEditor from "../../components/account/HouseInformationEditor";
import InformationRow from "../../components/account/InformationRow";

import NicknameEditor from "../../components/account/NicknameEditor";
import NotificationSettingsSection from "../../components/account/NotificationSettingsSection";
import OtherSettingsSection from "../../components/account/OtherSettingsSection";
import useLeaveHouse from "../../hooks/useLeaveHouse";

function AccountPage() {
  const { profile } = useOutletContext();

  const {
    user,
    group: house,
    isLoading,
    errorMessage: profileErrorMessage,
    updateCurrentUser,
    updateCurrentGroup,
  } = profile;

  const {
    isCheckingMembers,
    isLeaving,
    isDeleting,
    isDeleteModalOpen,
    deleteMode,
    errorMessage: leaveErrorMessage,
    handleLeaveHouse,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
  } = useLeaveHouse(house);

  if (isLoading) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <p
          role="status"
          className="text-sm font-semibold text-[#8B8575]"
        >
          설정 정보를 불러오는 중이에요...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full text-[#1A1428]">
      <div className="mx-auto max-w-3xl p-5 pb-8 sm:p-8">
        <header>
          <p className="text-sm text-[#8B8575]">
            내 정보와 하우스 설정을 한곳에서 관리해요
          </p>

          <h1 className="mt-1 flex items-center gap-2 font-display text-[30px] font-black tracking-[-0.03em]">
            <Settings
              size={27}
              aria-hidden="true"
            />
            설정
          </h1>
        </header>

        {profileErrorMessage && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
          >
            {profileErrorMessage}
          </p>
        )}

        <div className="mt-8 space-y-5">
          {/* 내 정보 */}
          <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <UserRound
                size={21}
                aria-hidden="true"
              />

              <h2 className="text-lg font-black">
                내 정보
              </h2>
            </div>

            <p className="mt-1 text-sm leading-6 text-[#8B8575]">
              닉네임을 변경하거나 로그인 계정 정보를
              확인할 수 있어요.
            </p>

            <div className="mt-5">
              {user ? (
                <>
                  <NicknameEditor
                    nickname={user.nickname}
                    onUpdated={
                      updateCurrentUser
                    }
                  />

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
                  사용자 정보를 불러오지 못했어요.
                </p>
              )}
            </div>
          </section>

          {/* 관리자에게만 보이는 기타 설정 */}
          {house?.role === "OWNER" && (
            <OtherSettingsSection
              house={house}
            />
          )}

          {/* 개인 알림 설정 */}
          {house?.groupPublicId && (
            <NotificationSettingsSection />
          )}

          {/* 하우스 정보 */}
          <section className="rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <House
                size={21}
                aria-hidden="true"
              />

              <h2 className="text-lg font-black">
                하우스 정보
              </h2>
            </div>

            <p className="mt-1 text-sm leading-6 text-[#8B8575]">
              현재 선택한 하우스의 정보와 내 역할을
              확인할 수 있어요.
            </p>

            {house ? (
              <>
                <div className="mt-5">
                  {house.role === "OWNER" ? (
                    <HouseInformationEditor
                      key={
                        house.groupPublicId
                      }
                      house={house}
                      onUpdated={
                        updateCurrentGroup
                      }
                    />
                  ) : (
                    <>
                      <InformationRow
                        icon={House}
                        label="하우스 이름"
                        value={
                          house.groupName
                        }
                      />

                      <InformationRow
                        icon={MapPin}
                        label="주소"
                        value={
                          house.groupAddress ||
                          "등록된 주소가 없어요"
                        }
                      />
                    </>
                  )}

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

                {/* 하우스 탈퇴 */}
                <div className="mt-6 border-t border-[#E63946]/20 pt-6">
                  <h3 className="font-black text-[#E63946]">
                    하우스 탈퇴
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#8B8575]">
                    이 하우스에서 나가더라도 다른
                    구성원은 계속 하우스를 사용할 수
                    있어요. 계정 자체는 삭제되지
                    않습니다.
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
                    onClick={
                      handleLeaveHouse
                    }
                    disabled={
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
                </div>

                {/* 관리자 전용 하우스 삭제 */}
                {house.role === "OWNER" && (
                  <div className="mt-6 border-t border-[#E63946]/20 pt-6">
                    <h3 className="font-black text-[#E63946]">
                      하우스 삭제
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#8B8575]">
                      구성원 수와 관계없이 하우스 전체를
                      삭제합니다. 모든 구성원이 하우스에서
                      나가게 되며 다시 복구할 수 없어요.
                    </p>

                    <button
                      type="button"
                      onClick={
                        openDeleteModal
                      }
                      disabled={
                        isCheckingMembers ||
                        isLeaving ||
                        isDeleting
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E63946] py-3.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                    >
                      <Trash2
                        size={17}
                        aria-hidden="true"
                      />

                      {isDeleting
                        ? "삭제하는 중..."
                        : "하우스 삭제하기"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-5 rounded-xl bg-[#F8F4EE] px-4 py-5 text-center text-sm font-semibold text-[#8B8575]">
                참여 중인 하우스가 없어요.
              </p>
            )}
          </section>
        </div>
      </div>

      {isDeleteModalOpen && house && (
        <DeleteHouseModal
          houseName={house.groupName}
          deleteMode={deleteMode}
          isDeleting={isDeleting}
          errorMessage={
            leaveErrorMessage
          }
          onClose={closeDeleteModal}
          onConfirm={
            handleConfirmDelete
          }
        />
      )}
    </div>
  );
}

export default AccountPage;
