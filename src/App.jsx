import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Layout from "./components/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import ProfileSetupPage from "./pages/auth/ProfileSetupPage";
import AccountPage from "./pages/dashboard/AccountPage";
import Calendar from "./pages/dashboard/Calendar";
import CompletedTasks from "./pages/dashboard/CompletedTasks";
import Home from "./pages/dashboard/Home";
import Members from "./pages/dashboard/Members";
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
          path="/calendar"
          element={<Calendar />}
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
          path="/notification"
          element={<Notification />}
        />

        <Route
          path="/settings"
          element={<AccountPage />}
        />

        {/* 기존 계정 주소로 접근하면 새 설정 화면으로 이동합니다. */}
        <Route
          path="/account"
          element={
            <Navigate
              to="/settings"
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;