import { Link } from "react-router";

function HouseAddActions() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-black text-[#1A1428]">하우스 추가</h2>
      <div className="space-y-3">
        <Link
          to="/create-house"
          className="group relative block w-full overflow-hidden rounded-2xl border-2 border-[#E63946] bg-[#E63946] p-5 text-left text-white no-underline shadow-lg transition hover:brightness-95 active:scale-[0.98]"
        >
          <div className="relative flex items-center gap-4">
            <span className="text-3xl" aria-hidden="true">
              ✨
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block font-display text-base font-black">
                새 하우스 만들기
              </strong>
              <span className="mt-1 block text-xs text-white/75">
                하우스 정보를 입력하고 초대코드를 받아요
              </span>
            </span>
            <span className="text-xl" aria-hidden="true">
              ›
            </span>
          </div>
        </Link>

        <Link
          to="/join-house"
          className="group relative block w-full overflow-hidden rounded-2xl border-2 border-[#1A1428]/10 bg-white p-5 text-left text-[#1A1428] no-underline shadow-sm transition hover:border-[#06D6A0]/60 hover:bg-[#06D6A0]/5 active:scale-[0.98]"
        >
          <div className="relative flex items-center gap-4">
            <span className="text-3xl" aria-hidden="true">
              🤝
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block font-display text-base font-black">
                초대코드로 참가하기
              </strong>
              <span className="mt-1 block text-xs text-[#8B8575]">
                기존 하우스에 새로운 멤버로 들어가요
              </span>
            </span>
            <span className="text-xl text-[#06D6A0]" aria-hidden="true">
              ›
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default HouseAddActions;
