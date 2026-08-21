import {
  useEffect,
  useState,
} from "react";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../api/notificationApi";

export default function useNotificationSettings() {
  const [dueSoonEnabled, setDueSoonEnabled] =
    useState(true);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const preferences =
          await getNotificationPreferences();

        if (!cancelled) {
          setDueSoonEnabled(
            preferences?.dueSoonEnabled ?? true,
          );
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message ??
              "알림 설정을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleToggle() {
    setDueSoonEnabled((currentValue) =>
      !currentValue,
    );

    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const preferences =
        await updateNotificationPreferences({
          dueSoonEnabled,
        });

      setDueSoonEnabled(
        preferences?.dueSoonEnabled ??
          dueSoonEnabled,
      );

      setSuccessMessage(
        "알림 설정을 저장했습니다.",
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
          "알림 설정을 저장하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    dueSoonEnabled,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    handleToggle,
    handleSubmit,
  };
}
