import { useState } from "react";
import { useNavigate } from "react-router";

function InviteHousePage() {
  const navigate = useNavigate();
  // 랜덤 코드 생성은 추후 백엔드 구현 예정.. 일단 하드코딩으로 정해진 값을 넣어둠
  const [inviteCode, setInviteCode] = useState("DT6K9P");

  // 초대코드 복사하는 기능
  function handleCopyCode() {
    navigator.clipboard
      .writeText(inviteCode)
      .then(() => {
        alert("초대코드가 복사되었습니다! 🎉");
      })
      .catch(() => {
        alert("복사에 실패했습니다");
      });
  }

  // 메인 하우스로 들어가는 기능
  function handleStartHouse() {
    console.log("메인 화면으로 이동");
    navigate("/home");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f6f2] p-8 box-border font-sans">
      {/* 전체를 감싸는 화이트 카드 */}
      <div className="bg-white flex flex-col items-center text-center py-10 px-6 sm:px-8 rounded-[24px] border border-[#f0f0f5] shadow-[0_8px_24px_rgba(0,0,0,0.04)] w-full max-w-[400px]">
        <span className="text-4xl mb-4">🎉</span>
        <h2 className="text-[#1a1a24] text-2xl font-extrabold m-0 mb-2 break-keep">
          하우스가 만들어졌어요!
        </h2>
        <p className="text-[#8b8b99] text-sm m-0 mb-8 break-keep">
          아래 초대코드를 멤버에게 공유해요
        </p>

        {/* 초대코드 표시 영역 */}
        <div className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-xl p-5 mb-5 flex flex-col items-center gap-3">
          <span className="text-[#8b8b99] text-xs font-bold tracking-wider">
            초대코드
          </span>

          {/* 코드가 돋보이도록 크기와 자간을 키움 */}
          <div className="text-3xl font-extrabold tracking-[0.2em] text-[#1a1a24] mb-1">
            {inviteCode}
          </div>

          {/* 보조 액션: 코드 복사 버튼 */}
          <button
            onClick={handleCopyCode}
            className="w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[#1a1a24] font-semibold py-2.5 px-5 rounded-lg text-[14px] transition-colors duration-200"
          >
            코드 복사하기
          </button>
        </div>

        {/* 안내 문구 */}
        <p className="text-[#a1a1aa] text-xs leading-relaxed mb-8 break-keep">
          멤버가 앱에서 "하우스에 참가하고 싶어요"를 선택한 뒤<br />이 코드를
          입력하면 돼요.
        </p>

        {/* 메인 액션: 하우스 시작하기 버튼 */}
        <button
          onClick={handleStartHouse}
          className="w-full bg-[#1a1a24] hover:bg-[#2d2d3a] text-white font-semibold py-3.5 px-6 rounded-xl text-[16px] transition-colors duration-200"
        >
          하우스 시작하기
        </button>
      </div>
    </main>
  );
}

export default InviteHousePage;
