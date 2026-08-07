import { Outlet } from "react-router";

import useCurrentProfile from "../../hooks/useCurrentProfile";
import NotificationProvider from "../notification/NotificationProvider";
import BottomNavigationBar from "./BottomNavigationBar";
import Sidebar from "./Sidebar";

function Layout() {
  // 사용자 정보와 현재 참여 중인 하우스 정보를 조회합니다.
  const profile = useCurrentProfile();

  // 하우스 정보가 아직 로딩 중이면 빈 문자열입니다.
  // 조회가 완료되면 실제 groupPublicId가 들어갑니다.
  const groupId =
    profile.group?.groupPublicId ?? "";

  return (
    <NotificationProvider
      groupId={groupId}
    >
      <div className="flex h-dvh w-full overflow-hidden bg-[#F8F4EE]">
        <Sidebar profile={profile} />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-20 pt-16 lg:pb-0 lg:pt-0">
          <Outlet
            context={{
              profile,
              activeGroup: profile.activeGroup,
            }}
          />
        </main>

        <BottomNavigationBar />
      </div>
    </NotificationProvider>
  );
}

export default Layout;