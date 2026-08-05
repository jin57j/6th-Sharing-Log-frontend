import {
  LogOut,
  UserRound,
} from "lucide-react";

import useLeaveHouse from "../../hooks/useLeaveHouse";

function AccountPage() {
  const {
    house,
    isLoading,
    isLeaving,
    errorMessage,
    handleLeaveHouse,
  } = useLeaveHouse();

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

        {/* 하우스 정보 */}
        {house && (
          <section className="mt-8 rounded-2xl border border-[#1A1428]/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">
              참여 중인 하우스
            </h2>

            <div className="mt-4 rounded-xl bg-[#F8F4EE] p-4">
              <p className="text-base font-bold">
                {house.groupName}
              </p>

              {house.groupAddress && (
                <p className="mt-1 text-sm text-[#8B8575]">
                  {house.groupAddress}
                </p>
              )}

              <span className="mt-3 inline-flex rounded-full bg-[#FFB703]/20 px-3 py-1 text-xs font-bold">
                {house.role === "OWNER"
                  ? "관리자"
                  : "멤버"}
              </span>
            </div>
          </section>
        )}

        {/* 탈퇴 영역 */}
        <section className="mt-8 rounded-2xl border border-[#E63946]/20 bg-white p-6">
          <h2 className="text-lg font-black text-[#E63946]">
            하우스 탈퇴
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#8B8575]">
            하우스를 탈퇴하면 해당 하우스의 업무,
            일정 및 예약 정보를 확인할 수 없어요.
            계정 자체는 삭제되지 않습니다.
          </p>

          {errorMessage && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={handleLeaveHouse}
            disabled={!house || isLeaving}
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
      </div>
    </div>
  );
}

export default AccountPage;