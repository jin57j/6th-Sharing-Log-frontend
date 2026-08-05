import OnboardingShell from "../../components/OnboardingShell";
import useProfileSetup from "../../hooks/useProfileSetup";

function ProfileSetupPage() {
  const {
    nickname,
    setNickname,
    errorMessage,
    isSubmitting,
    isNicknameValid,
    maxNicknameLength,
    handleSubmit,
  } = useProfileSetup();

  return (
    <OnboardingShell>
      <div className="relative w-full max-w-sm">
        <header className="mb-6 text-center">
          <div
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E63946]/10 text-2xl"
            aria-hidden="true"
          >
            👋
          </div>

          <h1 className="font-display text-2xl font-black tracking-[-0.03em]">
            만나서 반가워요!
          </h1>

          <p className="mt-1.5 text-sm leading-6 text-[#8B8575]">
            같이살기에서 사용할
            <br />
            닉네임을 입력해 주세요
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[#1A1428]/10 bg-white p-7 shadow-xl"
        >
          <div>
            <label
              htmlFor="nickname"
              className="mb-2 block text-sm font-bold"
            >
              닉네임
              <span className="ml-1 text-[#E63946]">
                *
              </span>
            </label>

            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(event) =>
                setNickname(event.target.value)
              }
              placeholder="사용할 닉네임을 입력해 주세요"
              maxLength={maxNicknameLength}
              autoComplete="nickname"
              autoFocus
              required
              className="w-full rounded-xl border border-[#1A1428]/10 bg-[#EFEBE2]/40 px-4 py-3 text-sm outline-none transition placeholder:text-[#8B8575]/70 focus:border-[#E63946]/40 focus:ring-2 focus:ring-[#E63946]/20"
            />

            <p className="mb-0 mt-2 text-right text-xs text-[#8B8575]">
              {nickname.length}/{maxNicknameLength}
            </p>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-sm font-semibold leading-5 text-[#E63946]"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={
              !isNicknameValid || isSubmitting
            }
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#E63946] py-3.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "저장하는 중..."
              : "시작하기"}
          </button>
        </form>
      </div>
    </OnboardingShell>
  );
}

export default ProfileSetupPage;