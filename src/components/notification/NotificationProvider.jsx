// useNotifications()를 한 번 실행 후
// 그 결과를 사이드바와 알림 화면에 함께 전달해줌
import NotificationContext from "../../contexts/notificationContext";
import useNotifications from "../../hooks/useNotifications";

export default function NotificationProvider({ children }) {
  const notificationState = useNotifications();

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
}