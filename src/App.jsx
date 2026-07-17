import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import HouseChoicePage from "./pages/HouseChoicePage";

function App() {
  return (
    <Routes>

      <Route
      path="/"
      element={<LoginPage />}
      />

      <Route
      path="/house-choice"
      element={<HouseChoicePage />}
      />

    </Routes>
  );
}

export default App;