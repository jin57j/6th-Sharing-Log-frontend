import { Route, Routes } from "react-router";

import Layout from "./components/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import ProfileSetupPage from "./pages/auth/ProfileSetupPage";
import AccountPage from "./pages/dashboard/AccountPage";
import CompletedTasks from "./pages/dashboard/CompletedTasks";
import Home from "./pages/dashboard/Home";
import Members from "./pages/dashboard/Members";
import Notice from "./pages/dashboard/Notice";
import Notification from "./pages/dashboard/Notification";
import Reservation from "./pages/dashboard/Reservation";
import Rotation from "./pages/dashboard/Rotation";
import Task from "./pages/dashboard/Task";
import CreateHousePage from "./pages/house/CreateHousePage";
import InviteHousePage from "./pages/house/InviteHousePage";
import JoinHousePage from "./pages/house/JoinHousePage";
import SelectHousePage from "./pages/house/SelectHousePage";

function App() {
  return (
    <Routes>
      {/* 로그인 및 하우스 입장 화면 */}
      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        path="/profile-setup"
        element={<ProfileSetupPage />}
      />

      <Route
        path="/house-choice"
        element={<SelectHousePage />}
      />

      <Route
        path="/create-house"
        element={<CreateHousePage />}
      />

      <Route
        path="/invite-house"
        element={<InviteHousePage />}
      />

      <Route
        path="/join-house"
        element={<JoinHousePage />}
      />

      {/* 공통 사이드바와 하단 메뉴를 사용하는 대시보드 */}
      <Route element={<Layout />}>
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/rotation"
          element={<Rotation />}
        />

        <Route
          path="/task"
          element={<Task />}
        />

        <Route
          path="/members"
          element={<Members />}
        />

        <Route
          path="/reservation"
          element={<Reservation />}
        />

        <Route
          path="/completed-tasks"
          element={<CompletedTasks />}
        />

        <Route
          path="/notice"
          element={<Notice />}
        />

        <Route
          path="/notification"
          element={<Notification />}
        />

        <Route
          path="/account"
          element={<AccountPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;