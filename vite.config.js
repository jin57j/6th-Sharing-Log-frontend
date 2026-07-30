import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const BACKEND_ORIGIN =
  "http://sharinglog-env.eba-mitpdzez.ap-northeast-2.elasticbeanstalk.com";

function createProxyConfig() {
  return {
    target: BACKEND_ORIGIN,

    // 요청의 Host를 AWS 백엔드 주소로 변경
    changeOrigin: true,

    configure(proxy) {
      proxy.on("proxyReq", (proxyRequest) => {
        // 브라우저가 보낸 localhost Origin을
        // AWS 백엔드 Origin으로 변경해서 CORS 차단을 방지
        proxyRequest.setHeader("Origin", BACKEND_ORIGIN);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": createProxyConfig(),
      "/oauth2": createProxyConfig(),
      "/login": createProxyConfig(),
      "/invite": createProxyConfig(),
    },
  },
});