// 테스트용 핸들러
import { http, HttpResponse } from "msw";

export const testHandler = [
  http.get("/api/v1/test", () => {
    return HttpResponse.json({ message: "MSW 세팅 성공" });
  }),
];