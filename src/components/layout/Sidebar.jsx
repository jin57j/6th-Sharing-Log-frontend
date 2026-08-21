import { useLogout } from "../../hooks/useLogout";
import useNotificationContext from "../../hooks/useNotificationContext";
import MobileHeader from "./sidebar/MobileHeader";
import MobileSidebarOverlay from "./sidebar/MobileSidebarOverlay";
import SidebarPanel from "./sidebar/SidebarPanel";

export default function Sidebar({
  profile,
  isMobileMenuOpen,
  onCloseMobileMenu,
}) {
  const { handleLogout, isLoggingOut } = useLogout();
  const { notificationCount } = useNotificationContext();
  const {
    nickname,
    houseName,
    isLoading: isProfileLoading,
    errorMessage: profileErrorMessage,
  } = profile;

  function onLogout() {
    handleLogout(onCloseMobileMenu);
  }

  const panelProps = {
    onLogout,
    isLoggingOut,
    notificationCount,
    nickname,
    houseName,
    isProfileLoading,
    profileErrorMessage,
  };

  return (
    <>
      <SidebarPanel {...panelProps} />
      <MobileHeader />
      {isMobileMenuOpen && (
        <MobileSidebarOverlay
          onClose={onCloseMobileMenu}
          {...panelProps}
        />
      )}
    </>
  );
}
