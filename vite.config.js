import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://Sharinglog-env.eba-mitpdzez.ap-northeast-2.elasticbeanstalk.com",
        changeOrigin: true,
      },
      "/oauth2": {
        target: "http://Sharinglog-env.eba-mitpdzez.ap-northeast-2.elasticbeanstalk.com",
        changeOrigin: true,
      },
      "/login": {
        target: "http://Sharinglog-env.eba-mitpdzez.ap-northeast-2.elasticbeanstalk.com",
        changeOrigin: true,
      },
      "/invite": {
        target: "http://Sharinglog-env.eba-mitpdzez.ap-northeast-2.elasticbeanstalk.com",
        changeOrigin: true,
      },
    },
  },
});
