// [전체 메인 레이아웃 컴포넌트]
// 모바일/데스크톱 화면에 맞춰 사이드바와 하단 네비게이션 바를 고정시킴.
import { Outlet } from "react-router";

import NotificationProvider from "../notification/NotificationProvider";
import BottomNavigationBar from "./BottomNavigationBar";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <NotificationProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-[#F8F4EE]">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 영역 */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-20 pt-16 lg:pb-0 lg:pt-0">
          <Outlet />
        </main>

        {/* 하단 네비게이션 바 */}
        <BottomNavigationBar />
      </div>
    </NotificationProvider>
  );
}

export default Layout;