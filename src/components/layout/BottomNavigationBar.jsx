import {
  Calendar,
  CalendarDays,
  ClipboardList,
  Home,
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
    to: "/calendar",
    label: "달력",
    icon: Calendar,
  },
  {
    to: "/task",
    label: "일정",
    icon: ClipboardList,
  },
  {
    to: "/reservation",
    label: "공간 예약",
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
        `flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-bold transition-colors ${
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

function BottomNavigationBar() {
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
      </div>
    </nav>
  );
}

export default BottomNavigationBar;