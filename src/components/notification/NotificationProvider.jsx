import NotificationContext from "../../contexts/notificationContext";
import useNotifications from "../../hooks/useNotifications";

export default function NotificationProvider({
  groupId,
  children,
}) {
  // Layout에서 전달받은 실제 groupPublicId로
  // 알림 API를 호출합니다.
  const notificationState =
    useNotifications(groupId);

  return (
    <NotificationContext.Provider
      value={notificationState}
    >
      {children}
    </NotificationContext.Provider>
  );
}