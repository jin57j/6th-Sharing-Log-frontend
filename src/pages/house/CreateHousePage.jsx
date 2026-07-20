import { useState } from "react";
import { useNavigate } from "react-router";

function CreateHousePage() {
  const navigate = useNavigate();

  const [houseName, setHouseName] = useState("");
  const [address, setAddress] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("제출된 데이터:", { houseName, address });
    navigate("/invite-house");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f6f2] p-8 box-border font-sans">
      {/* 폼 전체를 감싸는 화이트 카드 */}
      <div className="bg-white flex flex-col items-center text-center py-10 px-6 sm:px-8 rounded-[24px] border border-[#f0f0f5] shadow-[0_8px_24px_rgba(0,0,0,0.04)] w-full max-w-[400px]">
        <span className="text-4xl mb-4">✨</span>
        <h1 className="text-[#1a1a24] text-2xl font-extrabold m-0 mb-2 break-keep">
          새 하우스 만들기
        </h1>
        <p className="text-[#8b8b99] text-sm m-0 mb-8 break-keep">
          하우스 정보를 입력하면 초대코드가 생성돼요
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* 하우스 이름 (필수정보) */}
          <div className="flex flex-col text-left gap-2">
            <label
              htmlFor="house-name"
              className="text-[#1a1a24] text-sm font-bold ml-1"
            >
              하우스 이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="house-name"
              type="text"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              placeholder="예: 강남 쉐어하우스"
              required
              className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-xl px-4 py-3.5 text-base text-[#1a1a24] outline-none focus:border-[#a8a8b3] focus:ring-1 focus:ring-[#a8a8b3] transition-all placeholder:text-[#c4c4cc] placeholder:font-medium"
            />
          </div>

          {/* 하우스 주소 (선택정보) */}
          <div className="flex flex-col text-left gap-2">
            <label
              htmlFor="house-address"
              className="text-[#1a1a24] text-sm font-bold ml-1"
            >
              하우스 주소{" "}
              <span className="text-[#8b8b99] font-normal text-xs">(선택)</span>
            </label>
            <input
              id="house-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: 서울시 강남구 역삼동"
              className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-xl px-4 py-3.5 text-base text-[#1a1a24] outline-none focus:border-[#a8a8b3] focus:ring-1 focus:ring-[#a8a8b3] transition-all placeholder:text-[#c4c4cc] placeholder:font-medium"
            />
          </div>

          {/* 하우스 만들기 완료 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#1a1a24] hover:bg-[#2d2d3a] text-white font-semibold py-3.5 px-6 rounded-xl text-[16px] transition-colors duration-200 mt-4"
          >
            하우스 만들기
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateHousePage;
