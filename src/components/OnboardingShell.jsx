// 홈화면 들어가기 전 배경화면 디자인 컴포넌트
function OnboardingShell({ children }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F4EE] p-5 font-sans text-[#1A1428]">
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

      {children}
    </main>
  );
}

export default OnboardingShell;