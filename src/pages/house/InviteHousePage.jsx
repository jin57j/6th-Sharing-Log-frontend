import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import OnboardingShell from "../../components/OnboardingShell";

//22자리 초대코드를 보기 편하게 4자리씩 띄어쓰기해주는 함수
function makeReadableCode(code) {
  return code.match(/.{1,4}/g)?.join(" ") ?? code;
}

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

  const [copiedTarget, setCopiedTarget] = useState(null);

  const houseName = location.state?.houseName;
  const inviteCode = location.state?.inviteCode;
  const inviteUrl = location.state?.inviteUrl;
  const expiresAt = location.state?.expiresAt;

  useEffect(() => {
    if (!inviteCode || !inviteUrl) {
      navigate("/create-house", { replace: true });
    }
  }, [inviteCode, inviteUrl, navigate]);

  if (!inviteCode || !inviteUrl) {
    return null;
  }

  async function copy(value, target) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);

      window.setTimeout(() => {
        setCopiedTarget(null);
      }, 2000);
    } catch {
      alert("복사하지 못했어요. 다시 시도해 주세요.");
    }
  }

  function handleStartHouse() {
    navigate("/home", {
      state: {
        groupId: location.state?.groupId,
        houseName,
      },
    });
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

          {houseName && (
            <p className="mt-2 text-sm font-bold text-[#1A1428]">{houseName}</p>
          )}

          <p className="mt-2 text-sm text-[#8B8575]">
            아래 초대 링크를 멤버에게 공유해요
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
            onClick={() => copy(inviteCode, "code")}
            className={`mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition ${
              copiedTarget === "code"
                ? "border-[#06D6A0] bg-[#06D6A0]/10 text-[#176555]"
                : "border-[#1A1428]/10 hover:bg-[#EFEBE2]"
            }`}
          >
            <span aria-hidden="true">
              {copiedTarget === "code" ? "✅" : "📋"}
            </span>
            {copiedTarget === "code" ? "코드가 복사됐어요!" : "코드 복사하기"}
          </button>

          <button
            type="button"
            onClick={() => copy(inviteUrl, "link")}
            className={`mb-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition ${
              copiedTarget === "link"
                ? "border-[#06D6A0] bg-[#06D6A0]/10 text-[#176555]"
                : "border-[#1A1428]/10 hover:bg-[#EFEBE2]"
            }`}
          >
            <span aria-hidden="true">
              {copiedTarget === "link" ? "✅" : "🔗"}
            </span>
            {copiedTarget === "link"
              ? "초대 링크가 복사됐어요!"
              : "초대 링크 복사하기"}
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
            초대 링크를 연 멤버는 로그인 후 하우스 참가를 완료할 수 있어요.
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
