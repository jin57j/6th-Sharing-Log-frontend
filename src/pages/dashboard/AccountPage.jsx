import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  House,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import useLeaveHouse from "../../hooks/useLeaveHouse";
import useUpdateNickname from "../../hooks/useUpdateNickname";

const ACCOUNT_TABS = [
  {
    id: "profile",
    label: "내 정보",
  },
  {
    id: "house",
    label: "하우스 정보",
  },
];

// 조회 전용 정보 한 줄을 표시하는 컴포넌트
function InformationRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#1A1428]/10 py-4 last:border-b-0">
      <span className="mt-0.5 rounded-lg bg-[#F8F4EE] p-2 text-[#8B8575]">
        <Icon size={18} aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#8B8575]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-[#1A1428]">
          {value}
        </p>
      </div>
    </div>
  );
}

// 닉네임 조회 및 수정 컴포넌트
function NicknameEditor({
  nickname: initialNickname,
  onUpdated,
}) {
  // 처음에는 조회 상태로 표시합니다.
  const [isEditing, setIsEditing] =
    useState(false);

  const {
    nickname,
    isSaving,
    errorMessage,
    isNicknameValid,
    hasNicknameChanged,
    maxNicknameLength,
    handleNicknameChange,
    resetNickname,
    handleSubmit,
  } = useUpdateNickname({
    initialNickname,

    // 저장 성공 후 공통 프로필을 변경하고 수정 모드를 닫습니다.
    onSuccess: (updatedUser) => {
      onUpdated(updatedUser);
      setIsEditing(false);
    },
  });

  // 평소에는 닉네임과 연필 아이콘만 표시합니다.
  if (!isEditing) {
    return (
      <div className="flex items-start gap-3 border-b border-[#1A1428]/10 py-4">
        <span className="mt-0.5 rounded-lg bg-[#F8F4EE] p-2 text-[#8B8575]">
          <UserRound
            size={18}
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#8B8575]">
            닉네임
          </p>

          <p className="mt-1 break-words text-sm font-bold text-[#1A1428]">
            {initialNickname ||
              "닉네임이 설정되지 않았어요"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetNickname();
            setIsEditing(true);
          }}
          aria-label="닉네임 수정"
          className="rounded-lg p-2 text-[#8B8575] transition hover:bg-[#EFEBE2] hover:text-[#E63946]"
        >
          <Pencil
            size={17}
            aria-hidden="true"
          />
        </button>
      </div>
    );
  }

  // 연필 아이콘을 누르면 수정 입력창을 표시합니다.
  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-[#1A1428]/10 py-4"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-lg bg-[#E63946]/10 p-2 text-[#E63946]">
          <UserRound
            size={18}
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0 flex-1">
          <label
            htmlFor="account-nickname"
            className="text-xs font-semibold text-[#8B8575]"
          >
            닉네임
          </label>

          <input
            id="account-nickname"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            maxLength={maxNicknameLength}
            autoComplete="nickname"
            autoFocus
            placeholder="닉네임을 입력해 주세요"
            className="mt-2 w-full rounded-xl border border-[#E63946]/30 bg-[#F8F4EE]/60 px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-[#8B8575]/60 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20"
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-[#8B8575]">
              1자 이상 20자 이하
            </p>

            <span className="shrink-0 text-xs font-semibold text-[#8B8575]">
              {nickname.length}/{maxNicknameLength}
            </span>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-[#E63946]/5 px-3 py-2 text-xs font-semibold text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                resetNickname();
                setIsEditing(false);
              }}
              className="rounded-xl border border-[#1A1428]/10 bg-white px-4 py-2.5 text-sm font-bold text-[#8B8575] transition hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={
                !isNicknameValid ||
                !hasNicknameChanged ||
                isSaving
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save
                size={16}
                aria-hidden="true"
              />

              {isSaving
                ? "저장 중..."
                : "저장"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

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
    isLeaving,
    errorMessage: leaveErrorMessage,
    handleLeaveHouse,
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
            내 정보와 참여 중인 하우스를 관리해요
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
              닉네임을 변경하거나 로그인 계정 정보를
              확인할 수 있어요.
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
                  사용자 정보를 불러오지 못했어요.
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
                현재 참여 중인 하우스 정보를 확인할 수
                있어요.
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

            {/* 기존 하우스 탈퇴 영역 */}
            {house && (
              <section className="mt-5 rounded-2xl border border-[#E63946]/20 bg-white p-6">
                <h2 className="text-lg font-black text-[#E63946]">
                  하우스 탈퇴
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8B8575]">
                  하우스를 탈퇴하면 해당 하우스의 업무,
                  일정 및 예약 정보를 확인할 수 없어요.
                  계정 자체는 삭제되지 않습니다.
                </p>

                {leaveErrorMessage && (
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
                    !house || isLeaving
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E63946] bg-white py-3.5 text-sm font-bold text-[#E63946] transition hover:bg-[#E63946] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                >
                  <LogOut
                    size={17}
                    aria-hidden="true"
                  />

                  {isLeaving
                    ? "탈퇴하는 중..."
                    : "하우스 탈퇴하기"}
                </button>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountPage;