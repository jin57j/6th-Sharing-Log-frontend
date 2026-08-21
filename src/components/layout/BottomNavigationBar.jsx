import {
  CalendarDays,
  CheckCircle2,
  Home,
  Menu,
  RotateCcw,
} from "lucide-react";
import { NavLink } from "react-router";

const menuItems = [
  {
    to: "/home",
    label: "홈",
    icon: Home,
  },
  {
    to: "/rotation",
    label: "로테이션",
    icon: RotateCcw,
  },
  {
    to: "/completed-tasks",
    label: "완료업무",
    icon: CheckCircle2,
  },
  {
    to: "/reservation",
    label: "공간예약",
    icon: CalendarDays,
  },
];

function NavItem({
  to,
  label,
  icon: Icon,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 font-sans text-[9px] font-bold transition-colors ${
          isActive
            ? "text-[#E63946]"
            : "text-[#8B8575] hover:text-[#1A1428]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            strokeWidth={
              isActive ? 2.7 : 1.8
            }
            aria-hidden="true"
          />

          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function AllMenuButton({
  isActive,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="전체 메뉴 열기"
      aria-pressed={isActive}
      className="flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 font-sans text-[9px] font-bold text-[#1A1428] transition-colors"
    >
      <Menu
        size={20}
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <span className="text-[9px] leading-normal">
        전체메뉴
      </span>
    </button>
  );
}

function BottomNavigationBar({
  isMenuOpen,
  onOpenMenu,
}) {
  return (
    <nav
      aria-label="모바일 하단 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1A1428]/10 bg-white/95 shadow-[0_-4px_20px_rgba(26,20,40,0.06)] backdrop-blur lg:hidden"
    >
      <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {menuItems.map((item) => (
          <NavItem
            key={item.to}
            {...item}
          />
        ))}

        <AllMenuButton
          isActive={isMenuOpen}
          onClick={onOpenMenu}
        />
      </div>
    </nav>
  );
}

export default BottomNavigationBar;
