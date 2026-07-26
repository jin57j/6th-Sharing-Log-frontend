import googleIcon from "../../assets/images/google-icon.svg";

function LoginPage() {
  function handleLogin() {
    // 1. 환경 변수에서 백엔드 서버 주소를 가져옵니다. (예: .env 파일에 VITE_API_BASE_URL 설정 필요)
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    if (!backendUrl) {
      console.error(
        "백엔드 서버 주소(VITE_API_BASE_URL)가 설정되지 않았습니다.",
      );
      return;
    }

    // 2. 백엔드의 구글 로그인 엔드포인트로 이동합니다.
    // (백엔드 개발자와 논의한 경로가 다를 경우 /api/auth/google 부분을 수정하세요)
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F4EE] p-5 font-sans text-[#1A1428]">
      {/* 배경 장식 */}
      <div
        className="pointer-events-none absolute left-[6%] top-[10%] h-28 w-28 rotate-12 rounded-3xl bg-[#FFB703]/40"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-[12%] right-[8%] h-36 w-36 rounded-full border-[14px] border-[#06D6A0]/25"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-[6%] left-[40%] h-14 w-14 rotate-45 rounded-2xl bg-[#E63946]/15"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[25%] top-[8%] h-10 w-10 rounded-full bg-[#06D6A0]/30"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* 서비스 소개 */}
        <header className="mb-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2.5">
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E63946] text-2xl shadow-md"
              aria-hidden="true"
            >
              🏠
            </span>

            <span className="font-display text-2xl font-black tracking-[-0.02em]">
              Sharing Log
            </span>
          </div>

          <h1 className="m-0 font-display text-3xl font-black leading-tight tracking-[-0.03em]">
            같이 살아도,
            <br />할 일은 가볍게
          </h1>

          <p className="mb-0 ml-0 mr-0 mt-3 text-sm text-[#8B8575]">
            공동생활의 모든 업무를 한 곳에서 관리해요
          </p>
        </header>

        {/* 로그인 카드 */}
        <section className="rounded-[28px] border border-[#1A1428]/10 bg-white p-8 shadow-xl">
          <h2 className="m-0 mb-6 text-center text-sm font-bold">시작하기</h2>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#1A1428]/10 bg-white px-4 py-4 text-sm font-bold shadow-sm transition hover:border-[#1A1428]/20 hover:bg-[#EFEBE2] active:scale-[0.98]"
            onClick={handleLogin}
          >
            <img src={googleIcon} alt="" className="h-5 w-5" />

            <span>Google 계정으로 계속하기</span>
          </button>

          <p className="mb-0 ml-0 mr-0 mt-6 text-center text-[11px] leading-5 text-[#8B8575]">
            계속하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </section>

        {/* 주요 기능 안내 */}
        <ul className="mb-0 ml-0 mr-0 mt-6 flex list-none justify-center gap-5 p-0 text-xs text-[#8B8575]">
          <li className="flex items-center gap-1.5">
            <span className="text-base text-[#06D6A0]" aria-hidden="true">
              ✓
            </span>
            자동 순환 배정
          </li>

          <li className="flex items-center gap-1.5">
            <span className="text-base text-[#06D6A0]" aria-hidden="true">
              ✓
            </span>
            대타 요청
          </li>

          <li className="flex items-center gap-1.5">
            <span className="text-base text-[#06D6A0]" aria-hidden="true">
              ✓
            </span>
            공간 예약
          </li>
        </ul>
      </div>
    </main>
  );
}

export default LoginPage;
