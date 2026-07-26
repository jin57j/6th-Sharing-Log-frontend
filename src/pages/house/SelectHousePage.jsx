import { Link } from "react-router";

import OnboardingShell from "../../components/OnboardingShell";

function SelectHousePage() {
  return (
    <OnboardingShell>
      <div className="relative w-full max-w-sm">
        <header className="mb-8 text-center">
          <div
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E63946] text-2xl shadow-md"
            aria-hidden="true"
          >
            🏠
          </div>

          <h1 className="font-display text-2xl font-black tracking-[-0.03em]">
            어떻게 시작할까요?
          </h1>

          <p className="mt-2 text-sm text-[#8B8575]">
            새 하우스를 만들거나 초대코드로 참가할 수 있어요
          </p>
        </header>

        <div className="space-y-3">
          <Link
            to="/create-house"
            className="group relative block w-full overflow-hidden rounded-2xl border-2 border-[#E63946] bg-[#E63946] p-6 text-left text-white no-underline shadow-lg transition hover:brightness-95 active:scale-[0.98]"
          >
            <div
              className="absolute -right-4 -top-4 h-20 w-20 rounded-full border-[6px] border-white/15"
              aria-hidden="true"
            />

            <div className="relative">
              <span className="text-3xl" aria-hidden="true">
                ✨
              </span>

              <h2 className="mt-3 font-display text-lg font-black">
                새 하우스를 만들고 싶어요
              </h2>

              <p className="mt-1 text-sm text-white/75">
                하우스 정보를 입력하고 초대코드를 받아요
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-xs font-bold">
                시작하기
                <span aria-hidden="true">›</span>
              </span>
            </div>
          </Link>

          <Link
            to="/join-house"
            className="group relative block w-full overflow-hidden rounded-2xl border-2 border-[#1A1428]/10 bg-white p-6 text-left text-[#1A1428] no-underline shadow-sm transition hover:border-[#06D6A0]/60 hover:bg-[#06D6A0]/5 active:scale-[0.98]"
          >
            <div
              className="absolute -right-4 -top-4 h-20 w-20 rounded-full border-[6px] border-[#06D6A0]/15"
              aria-hidden="true"
            />

            <div className="relative">
              <span className="text-3xl" aria-hidden="true">
                🤝
              </span>

              <h2 className="mt-3 font-display text-lg font-black">
                하우스에 참가하고 싶어요
              </h2>

              <p className="mt-1 text-sm text-[#8B8575]">
                초대코드를 입력해서 기존 하우스에 들어가요
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#EFEBE2] px-3 py-2 text-xs font-bold">
                코드 입력
                <span aria-hidden="true">›</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </OnboardingShell>
  );
}

export default SelectHousePage;