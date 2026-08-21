import {
  useEffect,
  useState,
} from "react";

import {
  deletePushSubscription,
  registerPushSubscription,
} from "../api/pushApi";

import {
  createPushSubscription,
  getCurrentPushSubscription,
  hasVapidPublicKey,
  isMockApiEnabled,
  isPushNotificationSupported,
} from "../utils/pushNotification";

function getInitialPermission() {
  if (
    !isPushNotificationSupported()
  ) {
    return "unsupported";
  }

  return Notification.permission;
}

export default function usePushSubscription() {
  const isSupported =
    isPushNotificationSupported();

  const isConfigured =
    hasVapidPublicKey();

  const isMockMode =
    isMockApiEnabled();

  const [
    isSubscribed,
    setIsSubscribed,
  ] = useState(false);

  const [permission, setPermission] =
    useState(getInitialPermission);

  const [isLoading, setIsLoading] =
    useState(isSupported);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  useEffect(() => {
    if (!isSupported) {
      return undefined;
    }

    let cancelled = false;

    async function loadSubscription() {
      try {
        const subscription =
          await getCurrentPushSubscription();

        if (!cancelled) {
          setIsSubscribed(
            Boolean(subscription),
          );
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message ??
              "푸시 알림 상태를 확인하지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSubscription();

    return () => {
      cancelled = true;
    };
  }, [isSupported]);

  async function enablePushNotification() {
    if (
      isUpdating ||
      !isSupported ||
      !isConfigured ||
      isMockMode
    ) {
      return;
    }

    let createdSubscription = null;

    try {
      setIsUpdating(true);
      setErrorMessage("");
      setSuccessMessage("");

      const nextPermission =
        await Notification.requestPermission();

      setPermission(nextPermission);

      if (
        nextPermission !== "granted"
      ) {
        throw new Error(
          "브라우저에서 알림 권한을 허용해 주세요.",
        );
      }

      createdSubscription =
        await createPushSubscription();

      await registerPushSubscription(
        createdSubscription,
      );

      setIsSubscribed(true);

      setSuccessMessage(
        "현재 브라우저에서 푸시 알림을 받을 수 있어요.",
      );
    } catch (error) {
      if (createdSubscription) {
        try {
          await createdSubscription.unsubscribe();
        } catch {
          // 백엔드 등록에 실패한 구독을 정리하지 못해도
          // 사용자에게 원래 발생한 오류를 보여줍니다.
        }
      }

      setIsSubscribed(false);

      if (error.status === 401) {
        setErrorMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요.",
        );

        return;
      }

      if (error.status === 403) {
        setErrorMessage(
          "푸시 알림 등록 권한을 확인하지 못했습니다.",
        );

        return;
      }

      setErrorMessage(
        error.message ??
          "푸시 알림을 켜지 못했습니다.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function disablePushNotification() {
    if (isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);
      setErrorMessage("");
      setSuccessMessage("");

      const subscription =
        await getCurrentPushSubscription();

      if (!subscription) {
        setIsSubscribed(false);

        setSuccessMessage(
          "현재 브라우저에 등록된 푸시 알림이 없어요.",
        );

        return;
      }

      await deletePushSubscription(
        subscription.endpoint,
      );

      await subscription.unsubscribe();

      setIsSubscribed(false);

      setSuccessMessage(
        "현재 브라우저의 푸시 알림을 해제했습니다.",
      );
    } catch (error) {
      if (error.status === 401) {
        setErrorMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요.",
        );

        return;
      }

      setErrorMessage(
        error.message ??
          "푸시 알림을 해제하지 못했습니다.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return {
    isSupported,
    isConfigured,
    isMockMode,
    isSubscribed,
    permission,
    isLoading,
    isUpdating,
    errorMessage,
    successMessage,
    enablePushNotification,
    disablePushNotification,
  };
}
