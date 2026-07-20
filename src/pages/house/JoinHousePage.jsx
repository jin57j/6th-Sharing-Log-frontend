import { useState } from "react";
import { useNavigate } from "react-router";

function JoinHousePage() {
  const [typedCode, setTypedCode] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // 1. 공백 제거 및 대문자 변환 (사용자 편의성 위함)
    const cleanCode = typedCode.trim().toUpperCase();
    console.log("입력된 초대코드:", cleanCode);

    // 2. 임시 유효성 검사 (6자리 코드가 맞는지 확인)
    if (cleanCode.length !== 6) {
      alert("초대코드는 6자리여야 합니다. 다시 확인해 주세요! 🔍");
      return;
    }

    // 3. 백엔드 연결 전 임시 통과 처리
    alert("하우스 입장에 성공했습니다! 🎉");
    navigate("/home"); // 가입 성공 후 홈 화면으로 이동
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f6f2] p-8 box-border font-sans">
      {/* 폼 전체를 감싸는 화이트 카드 */}
      <div className="bg-white flex flex-col items-center text-center py-10 px-6 sm:px-8 rounded-[24px] border border-[#f0f0f5] shadow-[0_8px_24px_rgba(0,0,0,0.04)] w-full max-w-[400px]">
        <span className="text-4xl mb-4">🏠</span>
        <h1 className="text-[#1a1a24] text-2xl font-extrabold m-0 mb-2 break-keep">
          하우스 참여하기
        </h1>
        <p className="text-[#8b8b99] text-sm m-0 mb-8 break-keep">
          공유받은 6자리 초대코드를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col text-left gap-2">
            <label
              htmlFor="invite-code-input"
              className="text-[#1a1a24] text-sm font-bold ml-1"
            >
              초대코드 입력
            </label>
            <input
              id="invite-code-input"
              type="text"
              value={typedCode}
              onChange={(e) => setTypedCode(e.target.value.toUpperCase())}
              placeholder="예: DT6K9P"
              maxLength="6"
              required
              className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-xl px-4 py-3.5 text-xl text-center tracking-[0.2em] font-bold text-[#1a1a24] outline-none focus:border-[#a8a8b3] focus:ring-1 focus:ring-[#a8a8b3] transition-all placeholder:text-[#c4c4cc] placeholder:font-medium placeholder:tracking-normal"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a1a24] hover:bg-[#2d2d3a] text-white font-semibold py-3.5 px-6 rounded-xl text-[16px] transition-colors duration-200 mt-2"
          >
            하우스 입장하기
          </button>
        </form>
      </div>
    </main>
  );
}

export default JoinHousePage;
