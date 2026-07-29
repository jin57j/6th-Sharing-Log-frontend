// 핸들러 합치는 곳
import { testHandler } from "./handlers/testHandler";
import { reservationHandler } from "./handlers/reservationHandler";

export const handlers = [
  ...testHandler,
  ...reservationHandler,
];