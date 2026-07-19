import { useState } from "react";
import { Link } from "react-router";
import {
  HiMenu,
  HiX,
  HiHome,
  HiRefresh,
  HiClipboardList,
  HiCalendar,
  HiBell,
  HiCog,
  HiDocumentText,
  HiCheckCircle,
  HiInformationCircle,
} from "react-icons/hi";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav
      className={`${isOpen ? "w-64" : "w-20"} transition-all duration-300 h-screen bg-gray-50 border-r border-gray-200 p-5 flex flex-col justify-between`}
    >
      <div>
        {/* 헤더 및 토글 버튼 */}
        <div className="flex items-center justify-between mb-10">
          {isOpen && <h3 className="font-bold text-xl">Sharing Log</h3>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>

        {/* 메뉴 리스트 */}
        <ul className="space-y-4">
          <MenuLink to="/home" icon={<HiHome />} label="홈" isOpen={isOpen} />
          <MenuLink
            to="/rotation"
            icon={<HiRefresh />}
            label="로테이션"
            isOpen={isOpen}
          />
          <MenuLink
            to="/task"
            icon={<HiClipboardList />}
            label="업무"
            isOpen={isOpen}
          />
          <MenuLink
            to="/reservation"
            icon={<HiCalendar />}
            label="예약"
            isOpen={isOpen}
          />

          {isOpen && (
            <div className="mt-8 mb-2 text-xs text-gray-400 font-semibold uppercase">
              더보기
            </div>
          )}

          <MenuLink
            to="/notice"
            icon={<HiInformationCircle />}
            label="공지"
            isOpen={isOpen}
          />
          <MenuLink
            to="/notification"
            icon={<HiBell />}
            label="알림"
            isOpen={isOpen}
          />
          <MenuLink
            to="/completed-tasks"
            icon={<HiCheckCircle />}
            label="완료 업무"
            isOpen={isOpen}
          />
          <MenuLink
            to="/settings"
            icon={<HiCog />}
            label="설정"
            isOpen={isOpen}
          />
          <MenuLink
            to="/rules"
            icon={<HiDocumentText />}
            label="규칙"
            isOpen={isOpen}
          />
        </ul>
      </div>

      {/* 사용자 정보 */}
      <div className={`mt-auto pt-5 border-t ${!isOpen && "text-center"}`}>
        <p className={`text-sm ${!isOpen ? "hidden" : "block"}`}>
          김지수 (강남 쉐어하우스)
        </p>
        {!isOpen && (
          <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto" />
        )}
      </div>
    </nav>
  );
}

// 메뉴 링크를 재사용 가능한 컴포넌트로 분리
function MenuLink({ to, icon, label, isOpen }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span className="text-xl">{icon}</span>
        {isOpen && <span>{label}</span>}
      </Link>
    </li>
  );
}

export default Sidebar;
