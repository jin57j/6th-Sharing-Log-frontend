import { useState } from "react";
import { useNavigate } from "react-router";

import OnboardingShell from "../../components/OnboardingShell";

function JoinHousePage() {
  const navigate = useNavigate();

  const [typedCode, setTypedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const cleanCode = typedCode.trim();

  function handleInputChange(event) {
    setTypedCode(event.target.value);
    setErrorMessage("");
  }

  async function getCsrfToken() {
    // 토큰 삭제, 세션 쿠키 전송을 위해 credentials: "include" 유지
    const response = await fetch(`/api/auth/csrf`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("보안 토큰을 가져오지 못했습니다.");
    }

    return response.json();
  }

  async function getErrorMessage(response) {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await response.json();
      return (
        body.detail ??
        body.message ??
        body.error ??
        "하우스 참가에 실패했습니다."
      );
    }

    return response.status === 401 || response.redirected
      ? "로그인 후 다시 시도해 주세요."
      : "초대코드를 확인하거나 관리자에게 새 코드를 요청해 주세요.";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const isValidCode = /^[A-Za-z0-9_-]{22}$/.test(cleanCode);

    if (!isValidCode) {
      setErrorMessage(
        "영문, 숫자, -, _로 이루어진 22자리 코드를 입력해 주세요.",
      );
      return;
    }

    try {
      setErrorMessage("");
      setIsJoining(true);

      const csrf = await getCsrfToken();
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `/api/invitations/${encodeURIComponent(cleanCode)}/accept`,
        {
          method: "POST",
          credentials: "include", // 세션 쿠키 전송
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            [csrf.headerName]: csrf.token,
          },
        },
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const joinedGroup = await response.json();

      navigate("/home", {
        replace: true,
        state: {
          groupId: joinedGroup.groupId,
          houseName: joinedGroup.groupName,
          role: joinedGroup.role,
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "하우스 참가에 실패했습니다.",
      );
    } finally {
      setIsJoining(false);
    }
  }

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
                cleanCode.length === 22 ? "text-[#06D6A0]" : "text-[#8B8575]"
              }`}
            >
              {cleanCode.length}/22
            </span>
          </div>

          <input
            id="invite-code-input"
            type="text"
            value={typedCode}
            onChange={handleInputChange}
            placeholder="22자리 초대코드"
            maxLength={22}
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
