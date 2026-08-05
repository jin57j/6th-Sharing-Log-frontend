import { useState } from "react";
import { Pencil, Save, UserRound } from "lucide-react";

import useUpdateNickname from "../../hooks/useUpdateNickname";

// 닉네임 조회 및 수정 컴포넌트
export default function NicknameEditor({
  nickname: initialNickname,
  onUpdated,
}) {
  // 처음에는 조회 상태로 표시합니다.
  const [isEditing, setIsEditing] = useState(false);

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
          <UserRound size={18} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#8B8575]">닉네임</p>

          <p className="mt-1 break-words text-sm font-bold text-[#1A1428]">
            {initialNickname || "닉네임이 설정되지 않았어요"}
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
          <Pencil size={17} aria-hidden="true" />
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
          <UserRound size={18} aria-hidden="true" />
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
            <p className="text-xs text-[#8B8575]">1자 이상 20자 이하</p>

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
                !isNicknameValid || !hasNicknameChanged || isSaving
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} aria-hidden="true" />
              {isSaving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}