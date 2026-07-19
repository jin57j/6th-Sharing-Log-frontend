import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단/사이드바 영역 */}
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* 하단바 영역*/}
      <Footer />
    </div>
  );
}

export default Layout;
