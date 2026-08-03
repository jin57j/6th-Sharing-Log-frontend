import { useState } from "react";
import { NavLink } from "react-router";
import { FileText, LogOut, Menu, X } from "lucide-react";
import { PRIMARY_MENU_ITEMS, SECONDARY_MENU_ITEMS } from "../../constants/menu";
import { useLogout } from "../../hooks/useLogout";
import Logo from "../common/Logo";
import useNotificationContext from "../../hooks/useNotificationContext";

// 사용자 프로필 아이콘
function UserAvatar() {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E63946] text-xs font-bold text-white">
      김
    </span>
  );
}

// 사이드바의 개별 메뉴 버튼 1개를 그리는 컴포넌트
function SidebarMenuItem({ to, label, icon: Icon, badge, primary = false, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) => {
        const baseStyle = "flex w-full items-center gap-3 rounded-xl text-sm transition-colors";
        const typeStyle = primary ? "px-3 py-3 font-bold" : "px-3 py-2.5 font-semibold";
        const activeStyle = isActive
          ? primary
            ? "bg-[#E63946] text-white shadow-sm"
            : "bg-[#FFB703]/25 text-[#1A1428]"
          : "text-[#8B8575] hover:bg-[#EFEBE2] hover:text-[#1A1428]";

        return `${baseStyle} ${typeStyle} ${activeStyle}`;
      }}
    >
      <Icon size={primary ? 18 : 17} aria-hidden="true" />
      <span>{label}</span>
      {badge > 0 && (
        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#E63946] px-1 text-[10px] text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

// 상단 헤더 바(모바일에서만 보임)
function MobileHeader({ onOpenMenu }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#1A1428]/10 bg-white px-5 lg:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="메뉴 열기"
        className="rounded-lg p-1.5 text-[#1A1428] transition-colors hover:bg-[#EFEBE2]"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <Logo />

      <NavLink
        to="/notice"
        aria-label="공지 보기"
        className="rounded-lg p-1.5 text-[#1A1428] transition-colors hover:bg-[#EFEBE2]"
      >
        <FileText size={20} aria-hidden="true" />
      </NavLink>
    </header>
  );
}

// 사이드바의 메뉴판 전체를 배치하는 컴포넌트
function SidebarPanel({
  mobile = false,
  onClose,
  onLogout,
  isLoggingOut,
  notificationCount,
}) {
  return (
    <aside
      className={`${
        mobile ? "relative z-10 flex h-full w-[286px]" : "hidden h-full w-[258px] shrink-0 lg:flex"
      } flex-col border-r border-[#1A1428]/10 bg-white p-4`}
    >
      <div className="flex items-center justify-between px-2 py-2">
        <Logo />
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="rounded-lg p-1.5 text-[#1A1428] transition-colors hover:bg-[#EFEBE2]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-7 space-y-1">
        {PRIMARY_MENU_ITEMS.map((item) => (
          <SidebarMenuItem
            key={item.to}
            {...item}
            primary
            onNavigate={mobile ? onClose : undefined}
          />
        ))}
      </div>

      <div className="mt-7 border-t border-[#1A1428]/10 pt-5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B8575]">
          더보기
        </p>
        <div className="space-y-1">
          {SECONDARY_MENU_ITEMS.map((item) => (
            <SidebarMenuItem
              key={item.to}
              {...item}
              badge={
                item.to === "/notification"
                  ? notificationCount
                  : item.badge
              }
              onNavigate={mobile ? onClose : undefined}
            />
))}
        </div>
      </div>

      <div className="mt-auto border-t border-[#1A1428]/10 pt-4">
        <div className="flex items-center gap-3 px-2">
          <UserAvatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#1A1428]">김지수</p>
            <p className="truncate text-xs text-[#8B8575]">강남 쉐어하우스</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            aria-label={isLoggingOut ? "로그아웃 처리 중" : "로그아웃"}
            className="rounded-lg p-1.5 text-[#8B8575] transition-colors hover:bg-[#EFEBE2] hover:text-[#1A1428] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleLogout, isLoggingOut } = useLogout();
  const { notificationCount } = useNotificationContext();

  // 로그아웃 실행 후 모바일 메뉴까지 함께 닫아주는 핸들러
  const onLogout = () => {
    handleLogout(() => setIsMobileMenuOpen(false));
  };

  return (
    <>
      {/* PC 사이드바 */}
      <SidebarPanel
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
        notificationCount={notificationCount}
      />

      <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

      {/* 모바일 사이드바 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="메뉴 닫기"
            className="absolute inset-0 bg-[#1A1428]/25"
          />

          <SidebarPanel
            mobile
            onClose={() => setIsMobileMenuOpen(false)}
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
            notificationCount={notificationCount}
          />
        </div>
      )}
    </>
  );
}