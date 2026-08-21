import {
  LogOut,
  Trash2,
} from "lucide-react";

function HouseDangerZone({
  house,
  isCheckingMembers,
  isLeaving,
  isDeleting,
  isDeleteModalOpen,
  errorMessage,
  onLeave,
  onOpenDelete,
}) {
  const isActionDisabled =
    isCheckingMembers ||
    isLeaving ||
    isDeleting;

  return (
    <>
      <div className="mt-6 border-t border-[#E63946]/20 pt-6">
        <h3 className="font-black text-[#E63946]">
          하우스 탈퇴
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#8B8575]">
          이 하우스에서 나가더라도 다른 구성원은 계속
          하우스를 사용할 수 있어요. 계정 자체는
          삭제되지 않습니다.
        </p>

        {errorMessage &&
          !isDeleteModalOpen && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

        <button
          type="button"
          onClick={onLeave}
          disabled={isActionDisabled}
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

      {house.role === "OWNER" && (
        <div className="mt-6 border-t border-[#E63946]/20 pt-6">
          <h3 className="font-black text-[#E63946]">
            하우스 삭제
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#8B8575]">
            구성원 수와 관계없이 하우스 전체를
            삭제합니다. 모든 구성원이 하우스에서 나가게
            되며 다시 복구할 수 없어요.
          </p>

          <button
            type="button"
            onClick={onOpenDelete}
            disabled={isActionDisabled}
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
  );
}

export default HouseDangerZone;
