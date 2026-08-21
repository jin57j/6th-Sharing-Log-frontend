import { X } from "lucide-react";

import {
  PRIMARY_MENU_ITEMS,
  SECONDARY_MENU_ITEMS,
} from "../../../constants/menu";
import Logo from "../../common/Logo";
import SidebarMenuItem from "./SidebarMenuItem";
import SidebarUserProfile from "./SidebarUserProfile";

function SidebarPanel({
  mobile = false,
  onClose,
  onLogout,
  isLoggingOut,
  notificationCount,
  nickname,
  houseName,
  isProfileLoading,
  profileErrorMessage,
}) {
  const onNavigate = mobile ? onClose : undefined;

  return (
    <aside
      className={`${
        mobile
          ? "relative z-10 flex h-full w-[286px]"
          : "hidden h-full w-[258px] shrink-0 lg:flex"
      } flex-col border-r border-[#1A1428]/10 bg-white p-4`}
    >
      <div className="flex items-center justify-between px-2 py-2">
        <Logo onClick={onNavigate} />
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
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="mt-7 border-t border-[#1A1428]/10 pt-5">
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
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>

      <SidebarUserProfile
        nickname={nickname}
        houseName={houseName}
        isProfileLoading={isProfileLoading}
        profileErrorMessage={profileErrorMessage}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />
    </aside>
  );
}

export default SidebarPanel;
