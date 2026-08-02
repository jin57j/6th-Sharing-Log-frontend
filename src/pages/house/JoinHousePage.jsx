import OnboardingShell from "../../components/OnboardingShell";
import { INVITE_CODE_LENGTH } from "../../constants/invitation";
import useJoinHouse from "../../hooks/useJoinHouse";

function JoinHousePage() {
  const {
    typedCode,
    cleanCode,
    errorMessage,
    isJoining,
    handleInputChange,
    handleSubmit,
    navigate,
  } = useJoinHouse();

  return (
    <OnboardingShell>
      <div className="relative w-full max-w-sm">
        <header className="mb-6 text-center">
          <div
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#06D6A0]/15 text-2xl"
            aria-hidden="true"
          >
            🤝
          </div>

          <h1 className="font-display text-2xl font-black tracking-[-0.03em]">
            하우스 참가하기
          </h1>

          <p className="mt-1.5 text-sm text-[#8B8575]">
            하우스 관리자에게 초대코드를 받아 입력해요
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[#1A1428]/10 bg-white p-7 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <label htmlFor="invite-code-input" className="text-sm font-bold">
              초대코드
            </label>

            <span
              className={`text-[11px] font-bold ${
                cleanCode.length === INVITE_CODE_LENGTH
                  ? "text-[#06D6A0]"
                  : "text-[#8B8575]"
              }`}
            >
              {cleanCode.length}/{INVITE_CODE_LENGTH}
            </span>
          </div>

          <input
            id="invite-code-input"
            type="text"
            value={typedCode}
            onChange={handleInputChange}
            placeholder={`${INVITE_CODE_LENGTH}자리 초대코드`}
            maxLength={INVITE_CODE_LENGTH}
            autoComplete="off"
            spellCheck={false}
            disabled={isJoining}
            required
            className={`mt-2 w-full rounded-xl border bg-[#EFEBE2]/40 px-4 py-3.5 text-center font-mono text-base font-black tracking-[0.08em] outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-[#8B8575]/70 focus:ring-2 focus:ring-[#E63946]/20 ${
              errorMessage
                ? "border-[#E63946]"
                : "border-[#1A1428]/10 focus:border-[#E63946]/40"
            }`}
          />

          {errorMessage && (
            <p
              role="alert"
              className="mt-2 text-xs font-semibold leading-5 text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

          <p className="mt-3 text-xs leading-5 text-[#8B8575]">
            발급받은 코드를 공백 없이 입력해 주세요.
          </p>

          <button
            type="submit"
            disabled={!cleanCode || isJoining}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E63946] py-3.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isJoining ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
                참가 중...
              </>
            ) : (
              <>
                하우스 참가하기
                <span aria-hidden="true">›</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isJoining}
            className="mt-3 w-full rounded-xl py-3 text-sm font-semibold text-[#8B8575] transition hover:text-[#1A1428]"
          >
            ← 뒤로 가기
          </button>
        </form>
      </div>
    </OnboardingShell>
  );
}

export default JoinHousePage;