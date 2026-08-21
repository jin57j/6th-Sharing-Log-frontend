import { useNavigate } from "react-router";

import useNotificationContext from "./useNotificationContext";

export default function useNotificationPage() {
  const navigate = useNavigate();
  const notifications = useNotificationContext();

  return {
    isLoading: notifications.loading,
    errorMessage: notifications.errorMessage,
    onReload: notifications.reload,
    deadlines: {
      items: notifications.deadlineItems,
      onSelect: () => navigate("/task"),
    },
    substitutes: {
      requests: notifications.substituteRequests,
      pendingCount: notifications.substituteRequests.filter(
        (request) => !request.myResponse,
      ).length,
      respondingRequestId: notifications.respondingRequestId,
      onAccept: (requestId) =>
        notifications.handleSubstituteResponse(requestId, "accept"),
      onReject: (requestId) =>
        notifications.handleSubstituteResponse(requestId, "reject"),
    },
  };
}
