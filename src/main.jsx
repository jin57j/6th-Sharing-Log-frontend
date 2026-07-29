import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./index.css";

async function enableMocking() {
  // 개발 모드(DEV)이면서 + .env의 값이 true일 때만 MSW 실행함
  const isMocking = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === "true";
  if (!isMocking) return;

  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});