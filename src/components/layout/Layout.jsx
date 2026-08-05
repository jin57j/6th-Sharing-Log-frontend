import { Outlet } from "react-router";

import useCurrentProfile from "../../hooks/useCurrentProfile";
import NotificationProvider from "../notification/NotificationProvider";
import BottomNavigationBar from "./BottomNavigationBar";
import Sidebar from "./Sidebar";

function Layout() {
  // 사용자·하우스 정보를 Layout에서 한 번만 조회합니다.
  const profile = useCurrentProfile();

  return (
    <NotificationProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-[#F8F4EE]">
        {/* 사이드바에 프로필 정보를 전달합니다. */}
        <Sidebar profile={profile} />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-20 pt-16 lg:pb-0 lg:pt-0">
          {/* 하위 화면에도 같은 프로필 정보를 전달합니다. */}
          <Outlet context={{ profile }} />
        </main>

        <BottomNavigationBar />
      </div>
    </NotificationProvider>
  );
}

export default Layout;