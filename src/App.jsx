import { Routes, Route } from "react-router";

import LoginPage from "./pages/auth/LoginPage";
import SelectHousePage from "./pages/house/SelectHousePage";
import CreateHousePage from "./pages/house/CreateHousePage";
import InviteHousePage from "./pages/house/InviteHousePage";
import JoinHousePage from "./pages/house/JoinHousePage";
// 로그인 및 하우스 생성, 출입

import Layout from "./components/layout/Layout";
import Home from "./pages/dashboard/Home";
import Rotation from "./pages/dashboard/Rotation";
import Task from "./pages/dashboard/Task";
import Reservation from "./pages/dashboard/Reservation";
import CompletedTasks from "./pages/dashboard/CompletedTasks";
import Notice from "./pages/dashboard/Notice";
// 메인 대시보드

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/house-choice" element={<SelectHousePage />} />

      <Route path="/create-house" element={<CreateHousePage />} />

      <Route path="/invite-house" element={<InviteHousePage />} />

      <Route path="/join-house" element={<JoinHousePage />} />

      {/* 대시보드 영역(Layout으로 감싼 부분) */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />

        <Route path="/rotation" element={<Rotation />} />
        <Route path="/task" element={<Task />} />

        <Route path="/reservation" element={<Reservation />} />
        <Route path="/completed-tasks" element={<CompletedTasks />} />
        <Route path="/notice" element={<Notice />} />
      </Route>
    </Routes>
  );
}

export default App;
