import { testHandler } from "./handlers/testHandler";
import { reservationHandler } from "./handlers/reservationHandler";
import { choreHandler } from "./handlers/choreHandler";
import { notificationHandler } from "./handlers/notificationHandler";

export const handlers = [
  ...testHandler,
  ...reservationHandler,
  ...choreHandler,
  ...notificationHandler,
];