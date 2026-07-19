import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

function Layout() {
    return(
        <div>
            {/* 왼쪽 메뉴 영역(페이지 선택창) */}
            <Sidebar />

            <hr /> {/* 구분을 위한 임시 선 */}

            <main>
                {/* 오른쪽 컨텐츠(메인 페이지창) */}
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;