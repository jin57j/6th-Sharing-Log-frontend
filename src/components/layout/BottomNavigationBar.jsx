/*
  [모바일 전용 하단 네비게이션 바]
  - 모바일(1024px 미만) 스크린 하단에 고정되는 4칸짜리 메뉴바
  - 데스크톱(lg 이상) 환경에서는 숨겨짐
  - isActive 사용 - 현재 선택된 메뉴를 감지해 하이라이트(빨간색 + 굵게) 처리해줌
 */

import { NavLink } from "react-router";
import {
  CalendarDays,
  ClipboardList,
  Home,
  RotateCcw,
} from "lucide-react";

const menuItems = [
  { to: "/home", label: "홈", icon: Home },
  { to: "/rotation", label: "로테이션", icon: RotateCcw },
  { to: "/task", label: "업무 · 일정", icon: ClipboardList },
  { to: "/reservation", label: "공간 예약", icon: CalendarDays },
];

// 하단바에 들어갈 "개별 메뉴 버튼" 컴포넌트
function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-bold transition-colors ${
          isActive ? "text-[#E63946]" : "text-[#8B8575] hover:text-[#1A1428]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={20} strokeWidth={isActive ? 2.7 : 1.8} aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

// 모바일 화면 하단 전체 메뉴바
function BottomNavigationBar() {
  return (
    <nav
      aria-label="모바일 하단 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1A1428]/10 bg-white/95 shadow-[0_-4px_20px_rgba(26,20,40,0.06)] backdrop-blur lg:hidden"
    >
      <div className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {menuItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

export default BottomNavigationBar;