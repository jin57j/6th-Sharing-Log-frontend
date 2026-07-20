import { Link } from "react-router";

function SelectHousePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f6f2] p-8 box-border font-sans">
      {/* 상단 타이틀 영역 */}
      <div className="text-center mb-10">
        <h1 className="text-[#1a1a24] text-3xl md:text-4xl font-extrabold m-0 mb-3 break-keep">
          어떻게 시작할까요?
        </h1>
        <p className="text-[#737380] text-base m-0 break-keep">
          새 하우스를 만들거나 초대코드로 참가할 수 있어요
        </p>
      </div>

      {/* 카드 컨테이너 */}
      <div className="flex flex-col gap-5 w-full max-w-[420px]">
        {/* 첫 번째 카드 */}
        <Link
          to="/create-house"
          className="group bg-white flex flex-col items-center text-center py-8 px-6 rounded-[24px] border border-[#f0f0f5] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.08)] no-underline"
        >
          <span className="text-4xl mb-3">✨</span>
          <strong className="text-[#1a1a24] text-xl font-bold mb-2">
            새 하우스를 만들고 싶어요
          </strong>
          <span className="text-[#8b8b99] text-sm mb-6">
            하우스 정보를 입력하고 초대코드를 만들어요
          </span>

          <span className="inline-block bg-[#f2f2f7] group-hover:bg-[#e5e5ea] text-[#1a1a24] font-semibold py-3 px-6 rounded-xl text-[15px] transition-colors duration-200 w-4/5">
            시작하기
          </span>
        </Link>

        {/* 두 번째 카드 */}
        <Link
          to="/join-house"
          className="group bg-white flex flex-col items-center text-center py-8 px-6 rounded-[24px] border border-[#f0f0f5] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.08)] no-underline"
        >
          <span className="text-4xl mb-3">🤝</span>
          <strong className="text-[#1a1a24] text-xl font-bold mb-2">
            하우스에 참가하고 싶어요
          </strong>
          <span className="text-[#8b8b99] text-sm mb-6">
            초대코드를 입력해서 기존 하우스에 들어가요
          </span>

          {/* 가짜 버튼 */}
          <span className="inline-block bg-[#f2f2f7] group-hover:bg-[#e5e5ea] text-[#1a1a24] font-semibold py-3 px-6 rounded-xl text-[15px] transition-colors duration-200 w-4/5">
            코드 입력
          </span>
        </Link>
      </div>
    </main>
  );
}

export default SelectHousePage;
