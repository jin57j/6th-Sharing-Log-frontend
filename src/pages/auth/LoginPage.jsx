import { useEffect } from "react";
import { useNavigate } from "react-router";

import { getCurrentUser } from "../../api/authApi";
import { buildBackendUrl } from "../../api/apiConfig";
import googleIcon from "../../assets/images/google-g-logo.png";
import naverLoginButton from "../../assets/images/naver-login-button.png";

function LoginPage() {
  const navigate = useNavigate();

  // URL에 ?error=true가 있다면 OAuth 로그인 실패로 판단합니다.
  const loginFailed =
    new URLSearchParams(
      window.location.search,
    ).get("error") === "true";

  // OAuth 로그인 후 백엔드가 localhost:5173/로 돌려보내면
  // 현재 로그인 사용자 정보를 조회합니다.
  useEffect(() => {
    // OAuth 실패로 돌아온 경우에는 조회하지 않습니다.
    if (loginFailed) {
      return undefined;
    }

    let cancelled = false;

    async function checkLoginSession() {
      try {
        const user = await getCurrentUser();

        if (cancelled) {
          return;
        }

        // 로그인 확인을 위해 개발자 도구 콘솔에도 표시합니다.
        console.log("로그인한 사용자:", user);

        // 현재 백엔드 /api/auth/me 응답에는
        // 사용자의 하우스 정보가 포함되어 있지 않습니다.
        //
        // 따라서 로그인 성공 시 우선 하우스 선택 화면으로
        // 이동하도록 처리합니다.
        navigate("/house-choice", {
          replace: true,
        });
      } catch {
        // 로그인하지 않은 상태로 처음 접속했을 때
        // 사용자 조회가 실패하는 것은 정상입니다.
        console.log("현재 로그인 세션이 없습니다.");
      }
    }

    checkLoginSession();

    return () => {
      cancelled = true;
    };
  }, [loginFailed, navigate]);

  // OAuth 로그인은 fetch 요청이 아니라
  // 백엔드 로그인 주소로 브라우저 전체를 이동해야 합니다.
  function handleSocialLogin(provider) {
    window.location.href = buildBackendUrl(
      `/oauth2/authorization/${provider}`,
    );
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
              같이살기
            </span>
          </div>

          <h1 className="m-0 font-display text-3xl font-black leading-tight tracking-[-0.03em]">
            같이 살아도,
            <br />
            할 일은 가볍게
          </h1>

          <p className="mb-0 ml-0 mr-0 mt-3 text-sm text-[#8B8575]">
            공동생활의 모든 업무를 한 곳에서 관리해요
          </p>
        </header>

        {/* 로그인 카드 */}
        <section className="rounded-[28px] border border-[#1A1428]/10 bg-white p-8 shadow-xl">
          <h2 className="m-0 mb-6 text-center text-sm font-bold">
            시작하기
          </h2>

          {/* 로그인 실패 안내 */}
          {loginFailed && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 px-4 py-3 text-center text-xs font-semibold leading-5 text-[#E63946]"
            >
              로그인에 실패했어요. 잠시 후 다시 시도해 주세요.
            </p>
          )}

          {/* Google 로그인 버튼 */}
          <button
            type="button"
            onClick={() =>
              handleSocialLogin("google")
            }
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#F2F2F2] px-4 font-['Roboto'] text-sm font-medium leading-5 text-[#1F1F1F] transition hover:bg-[#E8E8E8] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B57D0]"
          >
            <img
              src={googleIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
            />

            <span>Google 계정으로 로그인</span>
          </button>

          {/* 네이버 로그인 버튼 */}
          <button
            type="button"
            onClick={() =>
              handleSocialLogin("naver")
            }
            aria-label="네이버 로그인"
            className="mt-3 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-[#03A94D] transition hover:brightness-95 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#03A94D]"
          >
            <img
              src={naverLoginButton}
              alt="네이버 로그인"
              className="h-12 w-auto max-w-none"
            />
          </button>

          <p className="mb-0 ml-0 mr-0 mt-6 text-center text-[11px] leading-5 text-[#8B8575]">
            계속하면 서비스 이용약관 및 개인정보 처리방침에
            동의하게 됩니다.
          </p>
        </section>

        {/* 주요 기능 안내 */}
        <ul className="mb-0 ml-0 mr-0 mt-6 flex list-none justify-center gap-5 p-0 text-xs text-[#8B8575]">
          <li className="flex items-center gap-1.5">
            <span
              className="text-base text-[#06D6A0]"
              aria-hidden="true"
            >
              ✓
            </span>
            자동 순환 배정
          </li>

          <li className="flex items-center gap-1.5">
            <span
              className="text-base text-[#06D6A0]"
              aria-hidden="true"
            >
              ✓
            </span>
            대타 요청
          </li>

          <li className="flex items-center gap-1.5">
            <span
              className="text-base text-[#06D6A0]"
              aria-hidden="true"
            >
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