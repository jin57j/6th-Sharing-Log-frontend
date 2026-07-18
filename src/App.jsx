import { Routes, Route } from "react-router";
import LoginPage from "./pages/auth/LoginPage";
import SelectHousePage from "./pages/house/SelectHousePage";
import CreateHousePage from "./pages/house/CreateHousePage";
import InviteHousePage from "./pages/house/InviteHousePage";
import JoinHousePage from "./pages/house/JoinHousePage";
import MainPage from "./pages/main/MainPage";

function App() {
  return (
    <Routes>

      <Route
      path="/"
      element={<LoginPage />}
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

      <Route
      path="/main"
      element={<MainPage />}
      />

    </Routes>
  );
}

export default App;