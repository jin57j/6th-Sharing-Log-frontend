// 현재는 안쓰는 페이지

import { mockNotices } from "../../mocks/homeData";

function NoticePage() {
  return (
    <div className="min-h-screen bg-[#F9F8F5] px-5 py-10">
      {/* 페이지 헤더 */}
      <header className="mb-8">
        <h1 className="text-[28px] font-black text-[#111] mb-1.5">공지</h1>
        <p className="text-[14px] text-[#888]">우리 집의 새로운 소식이에요</p>
      </header>

      {/* 공지 카드 리스트 */}
      <ul className="flex flex-col gap-4">
        {mockNotices.map((notice) => (
          <li
            key={notice.id}
            className="bg-white p-6 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100"
          >
            {/* 상단 뱃지 및 날짜 영역 */}
            <div className="flex items-center gap-2 mb-3">
              {notice.isPinned && (
                <span className="px-2 py-0.5 text-[11px] font-bold text-[#E53E3E] bg-[#FCE8E8] rounded-md">
                  고정
                </span>
              )}
              <span className="text-[13px] text-[#888]">{notice.date}</span>
            </div>

            {/* 내용 영역 */}
            <h3 className="mb-2 text-lg font-bold text-[#111]">
              {notice.title}
            </h3>
            <p className="text-[14px] text-[#888]">{notice.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoticePage;
