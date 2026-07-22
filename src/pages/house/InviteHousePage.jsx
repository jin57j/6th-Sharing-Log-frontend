import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router";

import OnboardingShell from "../../components/OnboardingShell";

//22자리 초대코드를 보기 편하게 4자리씩 띄어쓰기해주는 함수
function makeReadableCode(code) {
  return code.match(/.{1,4}/g)?.join(" ") ?? code;
}
// 만료 날짜(ISO 문자열)를 받아 읽기 쉬운 한국어 문장으로 변환하는 함수
function formatExpiry(value) {
  const date = new Date(value);

  // 날짜값이 이상하면 "24시간 후"라는 안전장치 문구를 보여줌
  if (Number.isNaN(date.getTime())) {
    return "24시간 후";
  }

  // 올바른 날짜값이면 한글이 호함된 포맷으로 에쁘게 바꿔줌
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function InviteHousePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const inviteCode =
    location.state?.inviteCode ??
    "ShLogInviteCode2026001";

  const expiresAt = location.state?.expiresAt;

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("초대코드를 복사하지 못했어요.");
    }
  }

  function handleStartHouse() {
    navigate("/home");
  }

  return (
    <OnboardingShell>
      <div className="relative w-full max-w-sm text-center">
        <header className="mb-6">
          <div
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#06D6A0]/20 text-3xl"
            aria-hidden="true"
          >
            🎉
          </div>

          <h1 className="font-display text-2xl font-black tracking-[-0.03em]">
            하우스가 만들어졌어요!
          </h1>

          <p className="mt-2 text-sm text-[#8B8575]">
            아래 초대코드를 멤버에게 공유해요
          </p>
        </header>

        <section className="rounded-[28px] border border-[#1A1428]/10 bg-white p-7 shadow-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#8B8575]">
            초대코드 · 22자리
          </p>

          <div className="mb-4 rounded-2xl border border-dashed border-[#E63946]/30 bg-[#EFEBE2]/60 px-4 py-6">
            <p className="break-words font-display text-xl font-black leading-relaxed tracking-[0.12em] text-[#E63946]">
              {makeReadableCode(inviteCode)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className={`mb-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition ${
              copied
                ? "border-[#06D6A0] bg-[#06D6A0]/10 text-[#176555]"
                : "border-[#1A1428]/10 hover:bg-[#EFEBE2]"
            }`}
          >
            <span aria-hidden="true">
              {copied ? "✅" : "📋"}
            </span>

            {copied ? "복사됐어요!" : "코드 복사하기"}
          </button>

          <div className="mb-5 rounded-xl bg-[#FFB703]/15 px-4 py-3 text-left">
            <p className="text-xs font-bold">
              ⏰ 발급 후 24시간 동안 사용할 수 있어요
            </p>

            <p className="mt-1 text-[11px] text-[#8B8575]">
              {expiresAt ? formatExpiry(expiresAt) : "24시간 후"} 만료
            </p>
          </div>

          <p className="mb-5 text-[11px] leading-5 text-[#8B8575]">
            멤버가 앱에서 “하우스에 참가하고 싶어요”를
            선택한 뒤 이 코드를 입력하면 돼요.
          </p>

          <button
            type="button"
            onClick={handleStartHouse}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E63946] py-3.5 text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98]"
          >
            하우스 시작하기
            <span aria-hidden="true">›</span>
          </button>
        </section>
      </div>
    </OnboardingShell>
  );
}

export default InviteHousePage;