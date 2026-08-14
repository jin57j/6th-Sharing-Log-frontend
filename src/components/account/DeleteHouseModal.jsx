import { useState } from "react";
import {
  AlertTriangle,
  X,
} from "lucide-react";

function DeleteHouseModal({
  houseName,
  deleteMode,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}) {
  const [
    inputHouseName,
    setInputHouseName,
  ] = useState("");

  const isHouseNameMatched =
    inputHouseName.trim() === houseName;

  const isLastMemberDeletion =
    deleteMode === "last-member";

  function handleClose() {
    if (isDeleting) {
      return;
    }

    setInputHouseName("");
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !isHouseNameMatched ||
      isDeleting
    ) {
      return;
    }

    onConfirm(inputHouseName.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-house-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E63946]/10 text-[#E63946]">
            <AlertTriangle
              size={22}
              aria-hidden="true"
            />
          </span>

          <button
            type="button"
            aria-label="삭제 확인창 닫기"
            disabled={isDeleting}
            onClick={handleClose}
            className="rounded-full p-2 text-[#8B8575] transition hover:bg-[#F8F4EE] hover:text-[#1A1428] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </div>

        <h2
          id="delete-house-title"
          className="mt-5 text-xl font-black text-[#1A1428]"
        >
          하우스를 삭제할까요?
        </h2>

        {isLastMemberDeletion ? (
          <p className="mt-3 text-sm leading-6 text-[#6F695D]">
            현재 이 하우스의 마지막
            구성원이에요.
            <br />
            하우스에서 나가면 하우스도 함께
            삭제됩니다.
          </p>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[#6F695D]">
            하우스를 삭제하면 현재 참여 중인 모든
            구성원이 하우스에서 나가게 됩니다.
            <br />
            업무, 일정, 예약 정보에도 더 이상
            접근할 수 없습니다.
          </p>
        )}

        <p className="mt-3 text-sm font-semibold leading-6 text-[#E63946]">
          삭제된 하우스는 다시 복구할 수 없어요.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <label
            htmlFor="delete-house-name"
            className="block text-sm font-bold text-[#1A1428]"
          >
            확인을 위해 하우스 이름을 입력해
            주세요.
          </label>

          <p className="mt-2 rounded-xl bg-[#F8F4EE] px-4 py-3 text-sm font-bold text-[#1A1428]">
            {houseName}
          </p>

          <input
            id="delete-house-name"
            type="text"
            value={inputHouseName}
            disabled={isDeleting}
            onChange={(event) =>
              setInputHouseName(
                event.target.value,
              )
            }
            placeholder="하우스 이름 입력"
            autoComplete="off"
            autoFocus
            className="mt-3 w-full rounded-xl border border-[#DDD7CC] bg-white px-4 py-3 text-sm font-semibold text-[#1A1428] outline-none transition placeholder:text-[#AAA397] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/15 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          {inputHouseName.length > 0 &&
            !isHouseNameMatched && (
              <p className="mt-2 text-xs font-semibold text-[#E63946]">
                하우스 이름이 일치하지 않습니다.
              </p>
            )}

          {errorMessage && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-6 text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleClose}
              className="flex-1 rounded-xl border border-[#DDD7CC] px-4 py-3 text-sm font-bold text-[#6F695D] transition hover:bg-[#F8F4EE] disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={
                !isHouseNameMatched ||
                isDeleting
              }
              className="flex-1 rounded-xl bg-[#E63946] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#E5A7AC]"
            >
              {isDeleting
                ? "삭제하는 중..."
                : isLastMemberDeletion
                  ? "나가기 및 삭제"
                  : "하우스 삭제"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteHouseModal;