import { useContext } from "react";

import NotificationContext from "../contexts/notificationContext";

export default function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext는 NotificationProvider 안에서 사용해야 합니다.",
    );
  }

  return context;
}